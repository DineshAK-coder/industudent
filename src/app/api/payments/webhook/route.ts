import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Razorpay webhook handler for payment events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");
      if (signature !== expectedSignature) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid webhook signature",
          },
          { status: 403 }
        );
      }
    } else if (!signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid webhook signature",
        },
        { status: 403 }
      );
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    const paymentEntity = event?.payload?.payment?.entity;
    const orderId: string | undefined = paymentEntity?.order_id;
    const paymentId: string | undefined = paymentEntity?.id;

    switch (event.event) {
      case "payment.authorized":
        console.log("Payment authorized:", event.payload);
        if (orderId) {
          await prisma.payment.updateMany({
            where: { razorpayOrderId: orderId },
            data: { razorpayPaymentId: paymentId ?? null, status: PaymentStatus.PENDING },
          });
        }
        break;

      case "payment.failed":
        console.log("Payment failed:", event.payload);
        if (orderId) {
          await prisma.payment.updateMany({
            where: { razorpayOrderId: orderId },
            data: { razorpayPaymentId: paymentId ?? null, status: PaymentStatus.FAILED },
          });
        }
        break;

      case "payment.captured":
        console.log("Payment captured:", event.payload);
        if (orderId) {
          await prisma.payment.updateMany({
            where: { razorpayOrderId: orderId },
            data: { razorpayPaymentId: paymentId ?? null, status: PaymentStatus.SUCCESS },
          });
        }
        break;

      case "refund.created":
        console.log("Refund created:", event.payload);
        if (orderId) {
          await prisma.payment.updateMany({
            where: { razorpayOrderId: orderId },
            data: { status: PaymentStatus.REFUNDED },
          });
        }
        break;

      default:
        console.log("Unknown event:", event.event);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/payments/webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process webhook",
      },
      { status: 500 }
    );
  }
}
