"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { events } from "../data/events";

type Ticket = {
  id: string;
  ticket_number: string;
  full_name: string;
  email: string;
  event_slug: string;
  quantity: number;
  seat_numbers?: string[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user?.email) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabaseClient
        .from("tickets")
        .select("*")
        .eq("email", user.email)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Error loading tickets:", error);
        setLoading(false);
        return;
      }

      setTickets(data || []);
      setLoading(false);
    }

    loadTickets();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  // -----------------------------
  // DASHBOARD ANALYTICS
  // -----------------------------

  const ticketOrders = tickets.length;

  const totalTickets = tickets.reduce(
    (total, ticket) => total + Number(ticket.quantity || 0),
    0
  );

  const uniqueEvents = new Set(
    tickets.map((ticket) => ticket.event_slug)
  ).size;

  return (
    <main className="min-h-screen bg-gray-100">

      {/* ========================================= */}
      {/* TOP NAVIGATION */}
      {/* ========================================= */}

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-600"
            >
              Ticatility
            </Link>

            {/* DESKTOP NAV */}

            <div className="hidden md:flex items-center gap-7">

              <Link
                href="/dashboard"
                className="font-semibold text-blue-600"
              >
                My Tickets
              </Link>

              <Link
                href="/"
                className="font-semibold text-gray-700 hover:text-blue-600 transition"
              >
                Browse Events
              </Link>

              <Link
                href="/account"
                className="font-semibold text-gray-700 hover:text-blue-600 transition"
              >
                Account
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="font-semibold text-red-600 hover:text-red-700 transition disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">

          <div>

            <p className="text-blue-600 font-bold uppercase tracking-wide text-sm">
              Customer Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">
              My Tickets 🎟️
            </h1>

            <p className="text-gray-600 mt-2">
              Welcome back. Your tickets are ready whenever you need them.
            </p>

          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Browse Events
          </Link>

        </div>


        {/* ========================================= */}
        {/* ANALYTICS CARDS */}
        {/* ========================================= */}

        {!loading && (
          <div className="grid md:grid-cols-3 gap-5 mb-8">

            {/* TICKET ORDERS */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Ticket Orders
              </p>

              <p className="text-4xl font-extrabold text-gray-900 mt-2">
                {ticketOrders}
              </p>

            </div>


            {/* TOTAL TICKETS */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Total Tickets
              </p>

              <p className="text-4xl font-extrabold text-gray-900 mt-2">
                {totalTickets}
              </p>

            </div>


            {/* EVENTS */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Events
              </p>

              <p className="text-4xl font-extrabold text-gray-900 mt-2">
                {uniqueEvents}
              </p>

            </div>

          </div>
        )}


        {/* ========================================= */}
        {/* LOADING */}
        {/* ========================================= */}

        {loading ? (

          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="animate-pulse">

              <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />

              <div className="h-4 bg-gray-200 rounded w-64 mx-auto mt-4" />

            </div>

            <p className="text-gray-500 mt-6">
              Loading your tickets...
            </p>

          </div>

        ) : tickets.length === 0 ? (

          /* ========================================= */
          /* NO TICKETS */
          /* ========================================= */

          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="text-6xl mb-5">
              🎟️
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No tickets yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't purchased any Ticatility tickets yet.
            </p>

            <Link
              href="/"
              className="inline-block mt-7 bg-blue-600 text-white px-7 py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Explore Events
            </Link>

          </div>

        ) : (

          /* ========================================= */
          /* TICKETS */
          /* ========================================= */

          <>

            {/* TICKET COUNT */}

            <div className="mb-6">

              <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">

                <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />

                <span className="font-semibold text-gray-700">
                  {ticketOrders}{" "}
                  {ticketOrders === 1
                    ? "Ticket Order"
                    : "Ticket Orders"}
                </span>

              </div>

            </div>


            {/* TICKET GRID */}

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {tickets.map((ticket) => {

                const event = events.find(
                  (event) =>
                    event.slug === ticket.event_slug
                );

                const seats =
                  ticket.seat_numbers || [];

                return (

                  <div
                    key={ticket.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
                  >

                    {/* EVENT IMAGE */}

                    {event && (
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={600}
                        height={350}
                        className="w-full h-52 object-cover"
                      />
                    )}


                    <div className="p-6">

                      {/* EVENT TITLE + STATUS */}

                      <div className="flex items-start justify-between gap-4">

                        <h2 className="text-2xl font-bold text-gray-900">
                          {event?.title ||
                            ticket.event_slug}
                        </h2>

                        <span className="shrink-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          Confirmed
                        </span>

                      </div>


                      {/* EVENT DETAILS */}

                      {event && (
                        <div className="mt-4 space-y-1">

                          <p className="text-gray-500">
                            📍 {event.location}
                          </p>

                          <p className="text-gray-500">
                            📅 {event.date}
                          </p>

                        </div>
                      )}


                      {/* DIVIDER */}

                      <div className="border-t border-gray-200 my-5" />


                      {/* TICKET NUMBER */}

                      <div>

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Ticket Number
                        </p>

                        <p className="font-bold text-gray-900 mt-1">
                          {ticket.ticket_number}
                        </p>

                      </div>


                      {/* HOLDER */}

                      <div className="mt-4">

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Ticket Holder
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                          {ticket.full_name}
                        </p>

                      </div>


                      {/* QUANTITY */}

                      <div className="mt-4">

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Quantity
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                          {ticket.quantity}
                        </p>

                      </div>


                      {/* SEATS */}

                      <div className="mt-4">

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Selected Seats
                        </p>

                        {seats.length > 0 ? (

                          <div className="flex flex-wrap gap-2 mt-2">

                            {seats.map((seat) => (

                              <span
                                key={seat}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm"
                              >
                                {seat}
                              </span>

                            ))}

                          </div>

                        ) : (

                          <p className="text-gray-400 mt-1 text-sm">
                            Seat information unavailable.
                          </p>

                        )}

                      </div>


                      {/* ================================= */}
                      {/* ACTION BUTTONS */}
                      {/* ================================= */}

                      <div className="mt-6 grid grid-cols-2 gap-3">

                        {/* VIEW TICKET */}

                        <Link
                          href={`/dashboard/tickets/${ticket.ticket_number}`}
                          className="w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                          View Ticket
                        </Link>


                        {/* DOWNLOAD PDF */}

                        <a
                          href={`/api/download-ticket?ticket=${encodeURIComponent(
                            ticket.ticket_number
                          )}`}
                          className="w-full bg-gray-900 text-white text-center py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                        >
                          ↓ Download PDF
                        </a>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </>

        )}

      </div>

    </main>
  );
}