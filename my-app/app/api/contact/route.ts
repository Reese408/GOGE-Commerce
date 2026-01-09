import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: "Grace Ongoing Contact Form <onboarding@resend.dev>", // Will use Resend's test domain until you verify your domain
      to: ["reeseredman099@gmail.com"], // IMPORTANT: On free tier, must match your Resend signup email. Change to graceogoing@gmail.com after domain verification.
      replyTo: email, // User's email so you can reply directly
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #927194 0%, #D08F90 50%, #A0B094 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #927194; margin-top: 0; font-size: 18px;">Contact Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #666;">Name:</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      ${name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #666;">Email:</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <a href="mailto:${email}" style="color: #927194; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #666;">Phone:</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      ${phone}
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 10px 0;">
                      <strong style="color: #666;">Subject:</strong>
                    </td>
                    <td style="padding: 10px 0;">
                      ${subject}
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #927194; margin-top: 0; font-size: 18px;">Message</h2>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #927194; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>💡 Tip:</strong> Click "Reply" to respond directly to ${email}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Sent from graceongoing.com contact form</p>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
