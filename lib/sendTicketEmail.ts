import { supabaseAdmin } from "@/lib/supabaseAdmin";

type SendTicketEmailProps = {
  email: string;
  fullName: string;
  ticketNumber: string;
  eventTitle: string;
  eventLocation: string;
  eventDate: string;
  eventImage: string;
  quantity: number;
  seatNumbers: string[];
  ticketType: string;
};

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendTicketEmail({
  email,
  fullName,
  ticketNumber,
  eventTitle,
  eventLocation,
  eventDate,
  eventImage,
  quantity,
  seatNumbers,
  ticketType,
}: SendTicketEmailProps) {
  // ==================================================
  // GET TICKET PDF
  // ==================================================

  const { data: pdfFile, error: pdfError } =
    await supabaseAdmin.storage
      .from("ticket-pdfs")
      .download(`${ticketNumber}.pdf`);

  if (pdfError || !pdfFile) {
    console.error(
      "Could not download ticket PDF:",
      pdfError
    );

    throw (
      pdfError ||
      new Error("Ticket PDF not found.")
    );
  }

  // ==================================================
  // CONVERT PDF TO BASE64
  // ==================================================

  const pdfArrayBuffer =
    await pdfFile.arrayBuffer();

  const pdfBase64 =
    Buffer.from(pdfArrayBuffer).toString(
      "base64"
    );

  // ==================================================
  // PREPARE DISPLAY DATA
  // ==================================================

  const displayTicketType =
    ticketType?.trim() || "General Admission";

  const displaySeats =
    seatNumbers && seatNumbers.length > 0
      ? seatNumbers.join(", ")
      : "Not assigned";

  const safeName =
    escapeHtml(fullName);

  const safeEventTitle =
    escapeHtml(eventTitle);

  const safeLocation =
    escapeHtml(eventLocation);

  const safeEventDate =
    escapeHtml(eventDate);

  const safeTicketNumber =
    escapeHtml(ticketNumber);

  const safeTicketType =
    escapeHtml(displayTicketType);

  const safeSeats =
    escapeHtml(displaySeats);

  const safeEventImage =
    eventImage
      ? escapeHtml(eventImage)
      : "";

  // ==================================================
  // EVENT IMAGE
  // ==================================================

  const eventImageHtml =
    safeEventImage
      ? `
        <div style="
          width: 100%;
          background: #071126;
        ">
          <img
            src="${safeEventImage}"
            alt="${safeEventTitle}"
            style="
              width: 100%;
              height: 240px;
              object-fit: cover;
              display: block;
            "
          />
        </div>
      `
      : "";

  // ==================================================
  // SEAT INFORMATION
  // ==================================================

  const seatHtml =
    seatNumbers && seatNumbers.length > 0
      ? `
        <div style="
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid #e5e7eb;
        ">
          <div style="
            color: #6b7280;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 5px;
          ">
            SEAT
          </div>

          <div style="
            color: #111827;
            font-size: 15px;
            font-weight: bold;
          ">
            ${safeSeats}
          </div>
        </div>
      `
      : "";

  // ==================================================
  // EMAIL HTML
  // ==================================================

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Your Ticatility Ticket</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: #eef1f6;
  font-family: Arial, Helvetica, sans-serif;
  color: #111827;
">

  <div style="
    width: 100%;
    padding: 30px 0;
    background: #eef1f6;
  ">

    <div style="
      max-width: 650px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(7, 17, 38, 0.08);
    ">

      <!-- HEADER -->

      <div style="
        background: #071126;
        padding: 30px 28px;
        text-align: center;
        border-bottom: 4px solid #2d6cdf;
      ">

        <div style="
          color: #ffffff;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: 1.5px;
        ">
          TICATILITY
        </div>

        <div style="
          color: #9db9ff;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1.8px;
          margin-top: 8px;
        ">
          YOUR WORLD OF LIVE EVENTS
        </div>

      </div>

      <!-- EVENT IMAGE -->

      ${eventImageHtml}

      <!-- MAIN CONTENT -->

      <div style="
        padding: 34px 30px 30px 30px;
      ">

        <!-- CONFIRMATION -->

        <div style="
          display: inline-block;
          background: #ecfdf3;
          border: 1px solid #b7ebc9;
          border-radius: 999px;
          padding: 7px 13px;
          color: #166534;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        ">
          PAYMENT CONFIRMED
        </div>

        <h1 style="
          margin: 0;
          color: #071126;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 800;
        ">
          Your ticket is confirmed!
        </h1>

        <p style="
          margin: 14px 0 0 0;
          color: #4b5563;
          font-size: 15px;
          line-height: 1.7;
        ">
          Hello ${safeName},
        </p>

        <p style="
          margin: 8px 0 0 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.7;
        ">
          Your payment has been approved and your
          Ticatility ticket has been successfully issued.
          Your official digital ticket is attached to this
          email as a PDF.
        </p>

        <!-- EVENT SECTION -->

        <div style="
          margin-top: 28px;
          border: 1px solid #e3e7ef;
          border-radius: 12px;
          overflow: hidden;
        ">

          <div style="
            background: #071126;
            padding: 13px 18px;
          ">
            <div style="
              color: #9db9ff;
              font-size: 10px;
              font-weight: bold;
              letter-spacing: 1px;
            ">
              EVENT DETAILS
            </div>
          </div>

          <div style="
            padding: 20px;
          ">

            <div style="
              color: #111827;
              font-size: 21px;
              font-weight: 800;
              line-height: 1.3;
              margin-bottom: 20px;
            ">
              ${safeEventTitle}
            </div>

            <!-- LOCATION -->

            <div style="
              padding-bottom: 14px;
              border-bottom: 1px solid #e5e7eb;
            ">

              <div style="
                color: #6b7280;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                margin-bottom: 5px;
              ">
                LOCATION
              </div>

              <div style="
                color: #111827;
                font-size: 15px;
                font-weight: bold;
              ">
                ${safeLocation}
              </div>

            </div>

            <!-- DATE -->

            <div style="
              padding-top: 14px;
            ">

              <div style="
                color: #6b7280;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                margin-bottom: 5px;
              ">
                DATE
              </div>

              <div style="
                color: #111827;
                font-size: 15px;
                font-weight: bold;
              ">
                ${safeEventDate}
              </div>

            </div>

            ${seatHtml}

            <!-- PURCHASE DETAILS -->

            <div style="
              margin-top: 18px;
              padding-top: 18px;
              border-top: 1px solid #e5e7eb;
            ">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <td style="
                    width: 50%;
                    vertical-align: top;
                  ">

                    <div style="
                      color: #6b7280;
                      font-size: 10px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                      margin-bottom: 5px;
                    ">
                      QUANTITY
                    </div>

                    <div style="
                      color: #111827;
                      font-size: 16px;
                      font-weight: 800;
                    ">
                      ${quantity}
                    </div>

                  </td>

                  <td style="
                    width: 50%;
                    vertical-align: top;
                  ">

                    <div style="
                      color: #6b7280;
                      font-size: 10px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                      margin-bottom: 5px;
                    ">
                      TICKET TYPE
                    </div>

                    <div style="
                      display: inline-block;
                      background: #eef4ff;
                      border: 1px solid #b9cdf8;
                      border-radius: 6px;
                      padding: 5px 9px;
                      color: #1649a5;
                      font-size: 13px;
                      font-weight: 800;
                    ">
                      ${safeTicketType}
                    </div>

                  </td>

                </tr>
              </table>

            </div>

          </div>

        </div>

        <!-- TICKET NUMBER -->

        <div style="
          margin-top: 25px;
          text-align: center;
        ">

          <div style="
            color: #6b7280;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 9px;
          ">
            YOUR TICKET NUMBER
          </div>

          <div style="
            display: inline-block;
            background: #071126;
            border-radius: 9px;
            padding: 13px 24px;
            color: #ffffff;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 1.5px;
          ">
            ${safeTicketNumber}
          </div>

        </div>

        <!-- ATTACHMENT -->

        <div style="
          margin-top: 28px;
          padding: 18px;
          background: #ecfdf3;
          border: 1px solid #b7ebc9;
          border-radius: 10px;
        ">

          <div style="
            color: #166534;
            font-size: 14px;
            font-weight: 800;
          ">
            Your official ticket is attached
          </div>

          <div style="
            margin-top: 5px;
            color: #166534;
            font-size: 13px;
            line-height: 1.5;
          ">
            Keep the PDF safe and have it available
            when you arrive at the venue.
          </div>

        </div>

        <!-- CLOSING -->

        <p style="
          margin: 28px 0 0 0;
          color: #6b7280;
          font-size: 13px;
          line-height: 1.7;
          text-align: center;
        ">
          Thank you for choosing Ticatility.
          <br />
          We look forward to helping you enjoy your event.
        </p>

      </div>

      <!-- FOOTER -->

      <div style="
        background: #f8fafc;
        border-top: 1px solid #e5e7eb;
        padding: 22px 20px;
        text-align: center;
      ">

        <div style="
          color: #071126;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.7px;
        ">
          TICATILITY
        </div>

        <div style="
          color: #9ca3af;
          font-size: 11px;
          margin-top: 6px;
        ">
          Issued by Ticatility
        </div>

        <div style="
          color: #9ca3af;
          font-size: 10px;
          margin-top: 4px;
        ">
          Please keep your ticket safe.
        </div>

      </div>

    </div>

  </div>

</body>
</html>
`;

  // ==================================================
  // SEND EMAIL THROUGH RESEND
  // ==================================================

  const resendApiKey =
    process.env.RESEND_API_KEY;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  if (!fromEmail) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured."
    );
  }

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${resendApiKey}`,
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        from: fromEmail,
        to: [email],

        subject:
          `Your Ticatility Ticket - ${eventTitle}`,

        html,

        attachments: [
          {
            filename:
              `${ticketNumber}.pdf`,
            content:
              pdfBase64,
          },
        ],
      }),
    }
  );

  // ==================================================
  // CHECK EMAIL RESULT
  // ==================================================

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "Email sending failed:",
      errorText
    );

    throw new Error(
      `Ticket email failed: ${errorText}`
    );
  }

  const result =
    await response.json();

  console.log(
    "Ticket email sent successfully:",
    result
  );

  return result;
}