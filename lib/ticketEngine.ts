import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateQRCode } from "./generateQRCode";
import { generateTicketPdf } from "./generateTicketPdf";
import { sendTicketEmail } from "./sendTicketEmail";

type TicketEngineProps = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  eventTitle: string;
  quantity: number;
  seatNumbers: string[];
  ticketType: "Premium" | "VIP";
};

export async function generateTicket({
  orderNumber,
  customerName,
  customerEmail,
  eventTitle,
  quantity,
  seatNumbers,
  ticketType,
}: TicketEngineProps) {
  // ==================================================
  // GET ORDER
  // ==================================================

  const { data: order, error: orderError } =
    await supabaseAdmin
      .from("orders")
      .select("id, order_number")
      .eq("order_number", orderNumber)
      .single();

  if (orderError || !order) {
    console.error(
      "Order loading error:",
      orderError
    );

    throw (
      orderError ||
      new Error("Order not found")
    );
  }

  // ==================================================
  // PREVENT DUPLICATE TICKETS
  // ==================================================

  const {
    data: existingTicket,
    error: existingTicketError,
  } = await supabaseAdmin
    .from("tickets")
    .select("ticket_number")
    .eq("order_id", order.id)
    .maybeSingle();

  if (existingTicketError) {
    console.error(
      "Existing ticket check error:",
      existingTicketError
    );

    throw existingTicketError;
  }

  if (existingTicket) {
    console.log(
      "Ticket already exists for order:",
      orderNumber,
      existingTicket.ticket_number
    );

    return existingTicket.ticket_number;
  }

  // ==================================================
  // GENERATE UNIQUE TICKET NUMBER
  // ==================================================

  const ticketNumber = `TIC-${crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;

  // ==================================================
  // GENERATE QR CODE
  // ==================================================

  const qrCode =
    await generateQRCode(ticketNumber);

  console.log(
    "QR Code starts with:",
    qrCode.substring(0, 50)
  );

  // ==================================================
  // GET EVENT INFORMATION
  // ==================================================

  const {
    data: event,
    error: eventError,
  } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("slug", eventTitle)
    .single();

  if (eventError || !event) {
    console.error(
      "Event loading error:",
      eventError
    );

    throw (
      eventError ||
      new Error("Event not found")
    );
  }

  // ==================================================
  // GENERATE PREMIUM PDF
  // ==================================================

  const pdfBuffer =
    await generateTicketPdf({
      fullName: customerName,
      eventTitle: event.title,
      eventLocation:
        event.location ||
        `${event.city || ""}, ${
          event.country || ""
        }`,
      eventDate: event.event_date,
      eventImage: event.image_url,
      ticketNumber,
      quantity,
      ticketType,
    });

  console.log(
    "Ticket PDF generated:",
    pdfBuffer.length,
    "bytes"
  );

  // ==================================================
  // UPLOAD PDF
  // ==================================================

  const pdfPath =
    `${ticketNumber}.pdf`;

  const {
    error: uploadError,
  } = await supabaseAdmin.storage
    .from("ticket-pdfs")
    .upload(
      pdfPath,
      pdfBuffer,
      {
        contentType:
          "application/pdf",
        upsert: false,
      }
    );

  if (uploadError) {
    console.error(
      "Ticket PDF upload error:",
      uploadError
    );

    throw uploadError;
  }

  console.log(
    "Ticket PDF uploaded:",
    pdfPath
  );

  // ==================================================
  // CREATE TICKET RECORD
  // ==================================================

  const {
    data: createdTicket,
    error: ticketError,
  } = await supabaseAdmin
    .from("tickets")
    .insert([
      {
        ticket_number:
          ticketNumber,

        order_id:
          order.id,

        full_name:
          customerName,

        email:
          customerEmail,

        event_slug:
          eventTitle,

        quantity,

        ticket_type:
          ticketType,

        seat_numbers:
          seatNumbers,

        qr_code:
          qrCode,

        pdf_path:
          pdfPath,
      },
    ])
    .select("ticket_number")
    .single();

  if (ticketError) {
    console.error(
      "Ticket creation error:",
      ticketError
    );

    // Remove uploaded PDF if ticket
    // creation fails
    await supabaseAdmin.storage
      .from("ticket-pdfs")
      .remove([pdfPath]);

    throw ticketError;
  }

  console.log(
    "Ticket created successfully:",
    createdTicket.ticket_number
  );

  // ==================================================
  // SEND PROFESSIONAL TICKET EMAIL
  // ==================================================

  await sendTicketEmail({
    email: customerEmail,
    fullName: customerName,
    ticketNumber,
    eventTitle: event.title,
    eventLocation:
      event.location ||
      `${event.city || ""}, ${
        event.country || ""
      }`,
    eventDate:
      event.event_date,
    eventImage:
      event.image_url,
    quantity,
    seatNumbers,
    ticketType,
  });

  console.log(
    "Ticket email sent to:",
    customerEmail
  );

  // ==================================================
  // RETURN TICKET NUMBER
  // ==================================================

  return ticketNumber;
}