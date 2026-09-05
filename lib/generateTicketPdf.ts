import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";
import { Buffer } from "buffer";
import { readFile } from "fs/promises";
import path from "path";
import { generateQRCode } from "./generateQRCode";

type GenerateTicketPdfProps = {
  fullName: string;
  eventTitle: string;
  eventLocation: string;
  eventDate: string;
  eventImage: string;
  ticketNumber: string;
  quantity: number;
  ticketType: "Premium" | "VIP";
};

function safeText(text: string) {
  return String(text)
    .replace(/📍/g, "Location:")
    .replace(/📅/g, "Date:")
    .replace(/🎟️/g, "Ticket")
    .replace(/⭐/g, "")
    .replace(/👑/g, "")
    .replace(/✓/g, "OK")
    .replace(/✔/g, "OK")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/[^\x00-\xFF]/g, "");
}

export async function generateTicketPdf({
  fullName,
  eventTitle,
  eventLocation,
  eventDate,
  eventImage,
  ticketNumber,
  quantity,
  ticketType,
}: GenerateTicketPdfProps) {
  const pdfDoc =
    await PDFDocument.create();

  const page =
    pdfDoc.addPage([900, 560]);

  const { width, height } =
    page.getSize();

  // ==================================================
  // FONTS
  // ==================================================

  const font =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

  const boldFont =
    await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

  // ==================================================
  // COLORS
  // ==================================================

  const navy = rgb(
    0.025,
    0.045,
    0.11
  );

  const blue = rgb(
    0.08,
    0.35,
    0.95
  );

  const blueDark = rgb(
    0.04,
    0.22,
    0.72
  );

  const white = rgb(
    1,
    1,
    1
  );

  const darkText = rgb(
    0.07,
    0.09,
    0.15
  );

  const grayText = rgb(
    0.42,
    0.45,
    0.52
  );

  const lightGray = rgb(
    0.94,
    0.95,
    0.97
  );

  const borderGray = rgb(
    0.84,
    0.86,
    0.90
  );

  const green = rgb(
    0.05,
    0.55,
    0.25
  );

  const greenLight = rgb(
    0.88,
    0.97,
    0.91
  );

  const gold = rgb(
    0.78,
    0.60,
    0.08
  );

  const goldLight = rgb(
    0.97,
    0.93,
    0.76
  );

  // ==================================================
  // BACKGROUND
  // ==================================================

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: lightGray,
  });

  // ==================================================
  // TOP HEADER
  // ==================================================

  page.drawRectangle({
    x: 0,
    y: 475,
    width,
    height: 85,
    color: navy,
  });

  page.drawRectangle({
    x: 0,
    y: 475,
    width,
    height: 4,
    color: blue,
  });

  // ==================================================
  // TICATILITY LOGO
  // ==================================================

  try {
    const logoPath =
      path.join(
        process.cwd(),
        "public",
        "logo.png"
      );

    const logoBytes =
      await readFile(logoPath);

    const logoImage =
      await pdfDoc.embedPng(
        logoBytes
      );

    page.drawImage(
      logoImage,
      {
        x: 35,
        y: 493,
        width: 170,
        height: 45,
      }
    );
  } catch (error) {
    console.error(
      "Could not load Ticatility logo:",
      error
    );

    page.drawText(
      "TICATILITY",
      {
        x: 35,
        y: 505,
        size: 25,
        font: boldFont,
        color: white,
      }
    );
  }

  // ==================================================
  // DYNAMIC TICKET TYPE HEADER
  // ==================================================

  const isVip =
    ticketType === "VIP";

  const headerTicketLabel =
    isVip
      ? "VIP DIGITAL TICKET"
      : "PREMIUM DIGITAL TICKET";

  page.drawText(
    headerTicketLabel,
    {
      x: 650,
      y: 508,
      size: 12,
      font: boldFont,
      color: isVip
        ? goldLight
        : white,
    }
  );

  page.drawText(
    "OFFICIAL ENTRY PASS",
    {
      x: 665,
      y: 490,
      size: 8,
      font,
      color: rgb(
        0.65,
        0.72,
        0.85
      ),
    }
  );

  // ==================================================
  // EVENT IMAGE
  // ==================================================

  try {
    const cleanImagePath =
      eventImage.startsWith("/")
        ? eventImage.substring(1)
        : eventImage;

    const imagePath =
      path.join(
        process.cwd(),
        "public",
        cleanImagePath
      );

    const imageBytes =
      await readFile(imagePath);

    let eventImageEmbed;

    if (
      eventImage
        .toLowerCase()
        .endsWith(".jpg") ||
      eventImage
        .toLowerCase()
        .endsWith(".jpeg")
    ) {
      eventImageEmbed =
        await pdfDoc.embedJpg(
          imageBytes
        );
    } else {
      eventImageEmbed =
        await pdfDoc.embedPng(
          imageBytes
        );
    }

    page.drawImage(
      eventImageEmbed,
      {
        x: 30,
        y: 285,
        width: 840,
        height: 175,
      }
    );
  } catch (error) {
    console.error(
      "Could not load event banner:",
      error
    );

    page.drawRectangle({
      x: 30,
      y: 285,
      width: 840,
      height: 175,
      color: navy,
    });
  }

  // ==================================================
  // IMAGE OVERLAY
  // ==================================================

  page.drawRectangle({
    x: 30,
    y: 285,
    width: 840,
    height: 175,
    color: rgb(
      0,
      0,
      0
    ),
    opacity: 0.50,
  });

  // ==================================================
  // EVENT LABEL
  // ==================================================

  page.drawText(
    "YOUR EVENT",
    {
      x: 58,
      y: 405,
      size: 10,
      font: boldFont,
      color: rgb(
        0.75,
        0.85,
        1
      ),
    }
  );

  // ==================================================
  // EVENT TITLE
  // ==================================================

  page.drawText(
    safeText(eventTitle),
    {
      x: 55,
      y: 355,
      size: 34,
      font: boldFont,
      color: white,
      maxWidth: 760,
    }
  );

  // ==================================================
  // EVENT DETAILS BAR
  // ==================================================

  page.drawRectangle({
    x: 30,
    y: 245,
    width: 840,
    height: 40,
    color: white,
    borderColor: borderGray,
    borderWidth: 1,
  });

  page.drawText(
    safeText(
      `Location: ${eventLocation}`
    ),
    {
      x: 55,
      y: 259,
      size: 11,
      font: boldFont,
      color: darkText,
      maxWidth: 340,
    }
  );

  page.drawText(
    safeText(
      `Date: ${eventDate}`
    ),
    {
      x: 450,
      y: 259,
      size: 11,
      font: boldFont,
      color: darkText,
      maxWidth: 360,
    }
  );

  // ==================================================
  // MAIN TICKET CARD
  // ==================================================

  page.drawRectangle({
    x: 30,
    y: 65,
    width: 840,
    height: 170,
    color: white,
    borderColor: borderGray,
    borderWidth: 1,
  });

  // ==================================================
  // TICKET HOLDER
  // ==================================================

  page.drawText(
    "TICKET HOLDER",
    {
      x: 55,
      y: 205,
      size: 9,
      font: boldFont,
      color: grayText,
    }
  );

  page.drawText(
    safeText(fullName),
    {
      x: 55,
      y: 183,
      size: 18,
      font: boldFont,
      color: darkText,
      maxWidth: 190,
    }
  );

  // ==================================================
  // TICKET NUMBER
  // ==================================================

  page.drawText(
    "TICKET NUMBER",
    {
      x: 280,
      y: 205,
      size: 9,
      font: boldFont,
      color: grayText,
    }
  );

  page.drawRectangle({
    x: 275,
    y: 168,
    width: 195,
    height: 36,
    color: rgb(
      0.92,
      0.95,
      1
    ),
    borderColor: blue,
    borderWidth: 1.2,
  });

  page.drawText(
    safeText(ticketNumber),
    {
      x: 288,
      y: 180,
      size: 15,
      font: boldFont,
      color: blueDark,
    }
  );

  // ==================================================
  // QUANTITY
  // ==================================================

  page.drawText(
    "QUANTITY",
    {
      x: 505,
      y: 205,
      size: 9,
      font: boldFont,
      color: grayText,
    }
  );

  page.drawText(
    String(quantity),
    {
      x: 505,
      y: 183,
      size: 18,
      font: boldFont,
      color: darkText,
    }
  );

  // ==================================================
  // TICKET TYPE
  // ==================================================

  page.drawText(
    "TICKET TYPE",
    {
      x: 55,
      y: 145,
      size: 9,
      font: boldFont,
      color: grayText,
    }
  );

  page.drawRectangle({
    x: 55,
    y: 101,
    width: 170,
    height: 36,
    color: isVip
      ? goldLight
      : rgb(
          0.92,
          0.95,
          1
        ),
    borderColor: isVip
      ? gold
      : blue,
    borderWidth: 1.2,
  });

  page.drawText(
    isVip
      ? "VIP"
      : "PREMIUM",
    {
      x: isVip
        ? 112
        : 94,
      y: 113,
      size: 14,
      font: boldFont,
      color: isVip
        ? rgb(
            0.55,
            0.38,
            0.02
          )
        : blueDark,
    }
  );

  // ==================================================
  // ACCESS STATUS
  // ==================================================

  page.drawText(
    "ACCESS STATUS",
    {
      x: 280,
      y: 145,
      size: 9,
      font: boldFont,
      color: grayText,
    }
  );

  page.drawRectangle({
    x: 275,
    y: 101,
    width: 125,
    height: 36,
    color: greenLight,
    borderColor: rgb(
      0.55,
      0.85,
      0.65
    ),
    borderWidth: 1,
  });

  page.drawText(
    "CONFIRMED",
    {
      x: 289,
      y: 113,
      size: 10,
      font: boldFont,
      color: green,
    }
  );

  // ==================================================
  // QR SECTION
  // ==================================================

  page.drawRectangle({
    x: 635,
    y: 76,
    width: 215,
    height: 150,
    color: rgb(
      0.97,
      0.98,
      1
    ),
    borderColor: borderGray,
    borderWidth: 1,
  });

  // ==================================================
  // QR CODE
  // ==================================================

  const qrCodeDataUrl =
    await generateQRCode(
      ticketNumber
    );

  const qrCodeBytes =
    Buffer.from(
      qrCodeDataUrl.replace(
        /^data:image\/png;base64,/,
        ""
      ),
      "base64"
    );

  const qrImage =
    await pdfDoc.embedPng(
      qrCodeBytes
    );

  page.drawImage(
    qrImage,
    {
      x: 650,
      y: 91,
      width: 112,
      height: 112,
    }
  );

  // ==================================================
  // QR LABEL
  // ==================================================

  page.drawText(
    "SCAN AT VENUE",
    {
      x: 774,
      y: 177,
      size: 9,
      font: boldFont,
      color: darkText,
    }
  );

  page.drawText(
    "Ticket verification",
    {
      x: 774,
      y: 162,
      size: 8,
      font,
      color: grayText,
    }
  );

  page.drawText(
    "Required for entry",
    {
      x: 774,
      y: 149,
      size: 8,
      font,
      color: grayText,
    }
  );

  // ==================================================
  // PERFORATION
  // ==================================================

  for (
    let x = 625;
    x < 850;
    x += 12
  ) {
    page.drawLine({
      start: {
        x,
        y: 70,
      },
      end: {
        x: x + 6,
        y: 70,
      },
      thickness: 1,
      color: borderGray,
    });
  }

  // ==================================================
  // VERIFIED LABEL
  // ==================================================

  page.drawText(
    "TICATILITY VERIFIED",
    {
      x: 650,
      y: 52,
      size: 8,
      font: boldFont,
      color: rgb(
        0.65,
        0.67,
        0.72
      ),
    }
  );

  // ==================================================
  // FOOTER
  // ==================================================

  page.drawLine({
    start: {
      x: 30,
      y: 42,
    },
    end: {
      x: 870,
      y: 42,
    },
    thickness: 1,
    color: borderGray,
  });

  page.drawText(
    "Issued by Ticatility",
    {
      x: 35,
      y: 22,
      size: 8,
      font,
      color: grayText,
    }
  );

  page.drawText(
    "Official digital event ticket",
    {
      x: 375,
      y: 22,
      size: 8,
      font,
      color: grayText,
    }
  );

  page.drawText(
    "Please keep this ticket safe.",
    {
      x: 710,
      y: 22,
      size: 8,
      font,
      color: grayText,
    }
  );

  // ==================================================
  // SAVE PDF
  // ==================================================

  const pdfBytes =
    await pdfDoc.save();

  return Buffer.from(
    pdfBytes
  );
}