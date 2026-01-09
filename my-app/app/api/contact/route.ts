import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Validate environment variables at module load
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL_RECIPIENT = process.env.EMAIL_TO || process.env.CONTACT_EMAIL_RECIPIENT || "graceogoing@gmail.com";
const CONTACT_EMAIL_FROM = process.env.EMAIL_FROM || process.env.CONTACT_EMAIL_FROM || "Grace Ongoing Contact Form <onboarding@resend.dev>";

if (!RESEND_API_KEY) {
  console.error("FATAL: RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(RESEND_API_KEY);

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitize HTML to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Validate and sanitize input
function validateInput(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { valid: boolean; error?: string } {
  // Name validation
  if (!data.name || typeof data.name !== "string") {
    return { valid: false, error: "Name is required" };
  }
  if (data.name.trim().length < 2 || data.name.trim().length > 100) {
    return { valid: false, error: "Name must be between 2 and 100 characters" };
  }

  // Email validation
  if (!data.email || typeof data.email !== "string") {
    return { valid: false, error: "Email is required" };
  }
  if (!EMAIL_REGEX.test(data.email.trim())) {
    return { valid: false, error: "Invalid email address" };
  }
  if (data.email.length > 254) {
    return { valid: false, error: "Email address too long" };
  }

  // Phone validation (optional)
  if (data.phone && typeof data.phone === "string" && data.phone.length > 50) {
    return { valid: false, error: "Phone number too long" };
  }

  // Subject validation
  if (!data.subject || typeof data.subject !== "string") {
    return { valid: false, error: "Subject is required" };
  }
  if (data.subject.trim().length < 3 || data.subject.trim().length > 200) {
    return { valid: false, error: "Subject must be between 3 and 200 characters" };
  }

  // Message validation
  if (!data.message || typeof data.message !== "string") {
    return { valid: false, error: "Message is required" };
  }
  if (data.message.trim().length < 10 || data.message.trim().length > 5000) {
    return { valid: false, error: "Message must be between 10 and 5000 characters" };
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  // Check API key exists
  if (!RESEND_API_KEY) {
    console.error("Contact form submission failed: RESEND_API_KEY not configured");
    return NextResponse.json(
      { error: "Email service not configured. Please contact support." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate input
    const validation = validateInput({ name, email, phone, subject, message });
    if (!validation.valid) {
      console.warn("Contact form validation failed:", validation.error);
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Sanitize all user inputs for HTML
    const sanitizedName = escapeHtml(name.trim());
    const sanitizedEmail = escapeHtml(email.trim().toLowerCase());
    const sanitizedPhone = phone ? escapeHtml(phone.trim()) : null;
    const sanitizedSubject = escapeHtml(subject.trim());
    const sanitizedMessage = escapeHtml(message.trim());

    // SECURITY: Never use user input as 'from' - always use our domain
    // replyTo is safe because it's just metadata, not the sender
    const emailData = {
      from: CONTACT_EMAIL_FROM,
      to: [CONTACT_EMAIL_RECIPIENT],
      replyTo: sanitizedEmail, // User's email for easy replies
      subject: `Contact Form: ${sanitizedSubject}`,
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
                      ${sanitizedName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #666;">Email:</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <a href="mailto:${sanitizedEmail}" style="color: #927194; text-decoration: none;">${sanitizedEmail}</a>
                    </td>
                  </tr>
                  ${sanitizedPhone ? `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      <strong style="color: #666;">Phone:</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                      ${sanitizedPhone}
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 10px 0;">
                      <strong style="color: #666;">Subject:</strong>
                    </td>
                    <td style="padding: 10px 0;">
                      ${sanitizedSubject}
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #927194; margin-top: 0; font-size: 18px;">Message</h2>
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #927194; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>💡 Tip:</strong> Click "Reply" to respond directly to ${sanitizedEmail}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>Sent from graceongoing.com contact form</p>
            </div>
          </body>
        </html>
      `,
    };

    // Log email attempt (production-safe - no secrets)
    console.log(`Sending contact form email to ${CONTACT_EMAIL_RECIPIENT} from ${sanitizedEmail}`);

    const data = await resend.emails.send(emailData);

    // Check for Resend API errors
    if (data.error) {
      console.error("Resend API error:", {
        name: data.error.name,
        message: data.error.message,
        // Don't log full error object to avoid leaking sensitive data
      });

      return NextResponse.json(
        { error: "Failed to send email. Please try again later or contact us directly." },
        { status: 500 }
      );
    }

    // Success logging
    console.log(`Contact form email sent successfully. ID: ${data.data?.id || 'unknown'}`);

    return NextResponse.json(
      {
        message: "Email sent successfully",
        // Don't send back the full Resend response to avoid leaking data
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    // Log the error safely
    if (error instanceof Error) {
      console.error("Contact form error:", {
        message: error.message,
        name: error.name,
        // Don't log stack trace in production to avoid info leakage
      });
    } else {
      console.error("Contact form unknown error:", String(error));
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
