"use client";
import DownloadTicketButton from "@/components/DownloadTicketButton";
import { events } from "../../../data/events";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import PrintButton from "../../../../components/PrintButton";
import TicketQRCode from "../../../../components/TicketQRCode";

type Ticket = {
  id: string;
  ticket_number: string;
  full_name: string;
  email: string;
  event_slug: string;
  quantity: number;
  seat_numbers?: string[];
  qr_code?: string;
};

type Event = {
  slug: string;
  title: string;
  location: string;
  date: string;
  image: string;
};

export default function TicketPage() {
  const params = useParams();
  const ticketNumber = params.slug as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user?.email) {
          setLoading(false);
          return;
        }

        const { data: ticketData, error: ticketError } =
          await supabaseClient
            .from("tickets")
            .select("*")
            .eq("ticket_number", ticketNumber)
            .eq("email", user.email)
            .single();

        if (ticketError || !ticketData) {
          console.error(
            "Ticket loading error:",
            ticketError
          );

          setLoading(false);
          return;
        }

        setTicket(ticketData);

        const eventData = events.find(
          (item) => item.slug === ticketData.event_slug
        );

        setEvent(eventData || null);
      } catch (error) {
        console.error("Ticket page error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [ticketNumber]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-xl">
          Loading your ticket...
        </p>
      </main>
    );
  }

  // ==================================================
  // TICKET NOT FOUND
  // ==================================================

  if (!ticket) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Ticket Not Found
          </h1>

          <p className="text-slate-400 mt-3">
            We couldn't find this ticket.
          </p>

          <Link
            href="/dashboard"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
          >
            Back to My Tickets
          </Link>
        </div>
      </main>
    );
  }

  const seats = ticket.seat_numbers || [];

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4">

      {/* ================================================== */}
      {/* TICKET */}
      {/* ================================================== */}

      <div
        id="ticket"
        className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl"
      >

        {/* ================================================== */}
        {/* TOP BRAND BAR */}
        {/* ================================================== */}

        <div className="bg-slate-950 px-8 py-5 flex items-center justify-between">

          <img
            src="/logo.png"
            alt="Ticatility"
            width={170}
            height={55}
            className="h-10 w-auto object-contain"
          />

          <span className="text-white text-sm font-semibold tracking-widest">
            DIGITAL TICKET
          </span>

        </div>

        {/* ================================================== */}
        {/* EVENT BANNER */}
        {/* ================================================== */}

        {event?.image && (
          <div
            className="w-full bg-slate-900 overflow-hidden"
            style={{
              height: "288px",
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >

            <img
              src={event.image}
              alt={event.title}
              loading="eager"
              draggable="false"
              className="block w-full h-full object-cover"
              style={{
                display: "block",
                width: "100%",
                height: "288px",
                objectFit: "cover",
                printColorAdjust: "exact",
                WebkitPrintColorAdjust: "exact",
              }}
            />

            {/* EVENT TITLE */}

            <div
              className="relative px-8 text-white"
              style={{
                marginTop: "-130px",
              }}
            >

              <p className="text-sm uppercase tracking-widest font-semibold text-blue-300">
                Your Event
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold mt-1">
                {event.title}
              </h1>

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* TICKET CONTENT */}
        {/* ================================================== */}

        <div className="p-8 md:p-10">

          {/* ================================================== */}
          {/* EVENT DETAILS */}
          {/* ================================================== */}

          {event && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-7">

              {/* LOCATION */}

              <div>
                <p className="text-slate-500 text-sm">
                  Location
                </p>

                <p className="text-lg font-bold text-slate-900">
                  📍 {event.location}
                </p>
              </div>

              {/* DATE */}

              <div>
                <p className="text-slate-500 text-sm">
                  Event Date
                </p>

                <p className="text-lg font-bold text-slate-900">
                  📅 {event.date}
                </p>
              </div>

              {/* STATUS */}

              <div>
                <span className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                  ✓ Confirmed
                </span>
              </div>

            </div>
          )}

          {/* ================================================== */}
          {/* MAIN INFORMATION */}
          {/* ================================================== */}

          <div className="grid md:grid-cols-2 gap-8 mt-8">

            {/* HOLDER */}

            <div>
              <p className="text-slate-500 text-sm">
                Ticket Holder
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {ticket.full_name}
              </p>
            </div>

            {/* TICKET NUMBER */}

            <div>
              <p className="text-slate-500 text-sm">
                Ticket Number
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {ticket.ticket_number}
              </p>
            </div>

            {/* QUANTITY */}

            <div>
              <p className="text-slate-500 text-sm">
                Quantity
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {ticket.quantity}
              </p>
            </div>

            {/* STATUS */}

            <div>
              <p className="text-slate-500 text-sm">
                Ticket Status
              </p>

              <p className="text-xl font-bold text-green-600 mt-1">
                Confirmed
              </p>
            </div>

          </div>

          {/* ================================================== */}
          {/* SELECTED SEATS */}
          {/* ================================================== */}

          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">

            <p className="text-slate-500 font-semibold">
              Selected Seats
            </p>

            {seats.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-4">

                {seats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl font-extrabold text-lg shadow"
                  >
                    {seat}
                  </span>
                ))}

              </div>
            ) : (
              <p className="text-slate-500 mt-2">
                Seat information unavailable.
              </p>
            )}

          </div>

          {/* ================================================== */}
          {/* PERFORATION */}
          {/* ================================================== */}

          <div className="my-10 border-t-2 border-dashed border-slate-300 relative">

            <div className="absolute -left-12 -top-5 w-10 h-10 bg-slate-950 rounded-full" />

            <div className="absolute -right-12 -top-5 w-10 h-10 bg-slate-950 rounded-full" />

          </div>

          {/* ================================================== */}
          {/* QR CODE */}
          {/* ================================================== */}

          <div className="text-center">

            <div className="inline-block bg-white p-5 rounded-2xl shadow-lg border border-slate-200">

              <TicketQRCode
                value={`Ticket:${ticket.ticket_number}`}
              />

            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-5">
              Scan at the venue
            </h3>

            <p className="text-slate-500 mt-1">
              Present this QR code at the entrance.
            </p>

          </div>

          {/* ================================================== */}
          {/* FOOTER */}
          {/* ================================================== */}

          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500">

            <p>
              Issued by{" "}
              <strong className="text-slate-900">
                Ticatility
              </strong>
            </p>

            <p>
              Please keep this ticket safe.
            </p>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* ACTION BUTTONS */}
      {/* ================================================== */}

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

  {/* DOWNLOAD PDF */}

<DownloadTicketButton
  ticketNumber={ticket.ticket_number}
/>

  {/* PRINT */}

  <div>
    <PrintButton />
  </div>

  {/* BACK TO TICKETS */}

  <Link
    href="/dashboard"
    className="bg-white text-slate-900 text-center py-3 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center"
  >
    ← My Tickets
  </Link>

</div>

      {/* ================================================== */}
      {/* PRINT STYLES */}
      {/* ================================================== */}

      <style jsx global>{`
  @media print {
    @page {
      size: A4 portrait;
      margin: 0;
    }

    html,
    body {
      background: white !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Hide navigation/action buttons when printing */
    body > * {
      background: white !important;
    }

    #ticket {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: visible !important;
    }

    /* Keep the event banner together */
    #ticket > div:first-child {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* EVENT IMAGE */
    #ticket img {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      print-color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
    }

    /* Allow ticket information to flow naturally */
    #ticket > div:not(:first-child) {
      break-inside: auto !important;
      page-break-inside: auto !important;
    }

    /* Don't split important individual sections */
    #ticket .grid {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    #ticket .text-center {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Hide buttons below ticket */
    #ticket + div {
      display: none !important;
    }
  }
`}</style>

    </main>
  );
}