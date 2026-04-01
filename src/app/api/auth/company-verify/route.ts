import { NextResponse } from "next/server";
import { Resend } from "resend";

// If Resend is configured, initialize it. Otherwise, it will fallback to console.log in development.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "dinesh@industudent.com"; // Fallback placeholder

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { companyName, email, linkedinUrl, websiteUrl } = data;

    // Validate the incoming JSON structure
    if (!companyName || !email || !linkedinUrl || !websiteUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailHtml = `
      <h2>New Company Verification Request</h2>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Official Email:</strong> ${email}</p>
      <p><strong>LinkedIn:</strong> <a href="${linkedinUrl}">${linkedinUrl}</a></p>
      <p><strong>Website:</strong> <a href="${websiteUrl}">${websiteUrl}</a></p>
      <hr />
      <p><em>Please call them within 24-48 hours to complete verification.</em></p>
    `;

    if (resend) {
      await resend.emails.send({
        from: "Industudent Verification <onboarding@industudent.com>",
        to: [ADMIN_EMAIL],
        subject: `[Industudent] Action Required: New Company Onboarding - ${companyName}`,
        html: emailHtml,
        replyTo: email,
      });
    } else {
      // Graceful fallback for local development if Resend API key isn't provided yet
      console.log("=====================================");
      console.log("Mock Email Dispatch (Resend Key Missing)");
      console.log(`To: ${ADMIN_EMAIL}`);
      console.log(`Subject: New Company Verification: ${companyName}`);
      console.log(`Payload:`, data);
      console.log("=====================================");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Error processing company verification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
