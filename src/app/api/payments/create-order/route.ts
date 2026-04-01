import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { PaymentType, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const createOrderSchema = z.object({
  projectId: z.string().min(1),
  amount: z.number().int().positive(),
  studentId: z.string().min(1),
});

const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalLimiter = globalThis as unknown as {
  paymentAttempts?: Map<string, number[]>;
};

const paymentAttempts = globalLimiter.paymentAttempts ?? new Map<string, number[]>();
if (!globalLimiter.paymentAttempts) {
  globalLimiter.paymentAttempts = paymentAttempts;
}

function consumeAttempt(key: string): boolean {
  const now = Date.now();
  const existing = paymentAttempts.get(key) ?? [];
  const valid = existing.filter((ts) => now - ts < WINDOW_MS);
  if (valid.length >= MAX_ATTEMPTS) return false;
  valid.push(now);
  paymentAttempts.set(key, valid);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payload for order creation",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { projectId, amount, studentId } = parsed.data;

    const limiterKey = `${studentId}:${request.headers.get("x-forwarded-for") ?? "local"}`;
    const allowed = consumeAttempt(limiterKey);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many payment attempts. Try again in an hour.",
        },
        { status: 429 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const useLiveRazorpay = Boolean(keyId && keySecret);

    const receipt = `proj_${projectId}_${Date.now()}`;

    const order = useLiveRazorpay
      ? await new Razorpay({
          key_id: keyId!,
          key_secret: keySecret!,
        }).orders.create({
          amount,
          currency: "INR",
          receipt,
          notes: { projectId, studentId },
        })
      : {
          id: `order_mock_${Date.now()}`,
          amount,
          currency: "INR",
          status: "created",
          receipt,
          notes: { projectId, studentId },
        };

    // Best-effort persistence. This keeps the route functional even if DB is not configured in local.
    try {
      await prisma.payment.create({
        data: {
          userId: studentId,
          amount,
          type: PaymentType.ATTEMPT_FEE,
          razorpayOrderId: order.id,
          status: PaymentStatus.PENDING,
        },
      });
    } catch (dbError) {
      console.warn("Payment persistence skipped in create-order:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...order,
          keyId: keyId ?? "rzp_test_mock",
          mode: useLiveRazorpay ? "live" : "mock",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/payments/create-order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create payment order",
      },
      { status: 500 }
    );
  }
}
