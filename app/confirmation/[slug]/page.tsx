import Link from "next/link";
import { getEventBySlug } from "@/lib/events";
import PaymentStatus from "@/components/PaymentStatus";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order_number?: string }>;
}) {
  const { slug } = await params;
  const { order_number } = await searchParams;

  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Confirmation not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="bg-slate-900 rounded-2xl p-10 text-center shadow-xl">

          <div className="text-7xl mb-5">
            🎟️
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Order Received!
          </h1>

          <p className="text-lg text-slate-300 mb-8">
            Thank you for choosing Ticatility.
          </p>

          {/* Order Number */}
          {order_number && (
            <div className="mb-8 rounded-xl border border-blue-500/30 bg-blue-950/40 p-5">
              <p className="text-sm text-slate-400 mb-1">
                Your Order Number
              </p>

              <p className="text-2xl font-bold text-blue-400 break-all">
                {order_number}
              </p>
            </div>
          )}

          {!order_number && (
            <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <p className="text-red-400 font-semibold">
                Order number is missing.
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Please return to your order and try again.
              </p>
            </div>
          )}

          {/* Event Information */}
          <div className="rounded-2xl bg-slate-800/70 p-6 text-left mb-8">

            <h2 className="text-2xl font-bold mb-5">
              {event.title}
            </h2>

            <div className="space-y-3 text-slate-300">

              <p>
                📍{" "}
                <span className="text-white font-medium">
                  {event.city}, {event.country}
                </span>
              </p>

              <p>
                🏟️{" "}
                <span className="text-white font-medium">
                  {event.venue || "Venue TBA"}
                </span>
              </p>

              <p>
                💰{" "}
                <span className="text-white font-medium">
                  ${Number(event.price).toFixed(2)}
                </span>
              </p>

            </div>
          </div>

          {/* Important Information */}
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-left mb-8">

            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              📌 What happens next?
            </h2>

            <ul className="space-y-3 text-slate-300">

              <li>
                ✅ Your payment proof has been submitted.
              </li>

              <li>
                ✅ Our team will review and verify your payment.
              </li>

              <li>
                ✅ Once your payment is approved, your ticket will be generated.
              </li>

              <li>
                ✅ Your digital ticket will become available once verification is complete.
              </li>

            </ul>
          </div>

          {/* Payment Status */}
          <PaymentStatus />

          {/* Back Home */}
          <Link
            href="/"
            className="inline-block mt-10 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 font-bold transition"
          >
            Back to Home
          </Link>

        </div>
      </div>
    </main>
  );
}