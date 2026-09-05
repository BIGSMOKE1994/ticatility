import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const { data, error } =
      await resend.emails.send({
        from:
          "Ticatility <welcome@ticatility.com>",
        to: [email],
        subject:
          "Welcome to Ticatility 🎟️",
        html: `
          <div style="margin:0; padding:0; background:#f3f4f6; font-family:Arial,Helvetica,sans-serif;">
            
            <div style="max-width:620px; margin:0 auto; padding:40px 20px;">

              <div style="background:#ffffff; border-radius:18px; overflow:hidden;">

                <!-- HEADER -->
                <div style="background:#020617; padding:30px 25px; text-align:center;">

                  <div style="font-size:30px; font-weight:800; color:#ffffff;">
                    Ticatility 🎟️
                  </div>

                  <div style="color:#94a3b8; font-size:14px; margin-top:8px;">
                    The World's Marketplace for Live Event Tickets
                  </div>

                </div>

                <!-- CONTENT -->
                <div style="padding:40px 30px;">

                  <h1 style="margin:0 0 20px; color:#111827; font-size:32px;">
                    Welcome to Ticatility! 🎉
                  </h1>

                  <p style="font-size:17px; line-height:1.7; color:#374151;">
                    Your Ticatility account has been successfully created.
                  </p>

                  <p style="font-size:16px; line-height:1.7; color:#4b5563;">
                    You're now ready to explore live events, purchase tickets,
                    and manage your orders from your Ticatility account.
                  </p>

                  <!-- BUTTON -->
                  <div style="text-align:center; margin:35px 0;">

                    <a
                      href="https://ticatility.com"
                      style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; font-size:16px; font-weight:700; padding:15px 30px; border-radius:10px;"
                    >
                      Go to Ticatility 🎟️
                    </a>

                  </div>

                  <!-- FEATURES -->
                  <div style="background:#f8fafc; border-radius:12px; padding:22px;">

                    <p style="margin:0 0 12px; font-weight:700; color:#111827;">
                      What you can do on Ticatility:
                    </p>

                    <p style="margin:8px 0; color:#4b5563;">
                      🎫 Browse live events and tickets
                    </p>

                    <p style="margin:8px 0; color:#4b5563;">
                      🛒 Purchase and manage your orders
                    </p>

                    <p style="margin:8px 0; color:#4b5563;">
                      📱 Access your tickets from your dashboard
                    </p>

                    <p style="margin:8px 0; color:#4b5563;">
                      🔐 Manage your Ticatility account
                    </p>

                  </div>

                  <p style="font-size:16px; line-height:1.7; color:#4b5563; margin-top:30px;">
                    Thanks for joining Ticatility. We look forward to helping
                    you experience the world's biggest live events.
                  </p>

                  <p style="font-size:16px; color:#111827; margin-top:25px;">
                    <strong>The Ticatility Team</strong>
                  </p>

                </div>

                <!-- FOOTER -->
                <div style="background:#f8fafc; padding:25px 30px; text-align:center;">

                  <p style="margin:0; font-size:13px; color:#6b7280;">
                    © 2026 Ticatility. All rights reserved.
                  </p>

                  <p style="margin:8px 0 0; font-size:13px; color:#6b7280;">
                    The World's Marketplace for Live Event Tickets
                  </p>

                  <p style="margin:12px 0 0; font-size:13px;">
                    <a
                      href="https://ticatility.com"
                      style="color:#2563eb; text-decoration:none;"
                    >
                      ticatility.com
                    </a>
                  </p>

                </div>

              </div>

            </div>
          </div>
        `,
      });

    if (error) {
      console.error(
        "RESEND FULL ERROR:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message ||
            "Resend email failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(
      "Welcome email error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong sending the email.",
      },
      { status: 500 }
    );
  }
}