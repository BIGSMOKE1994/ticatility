"use client";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400 mb-5">
            Ticatility Support
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            How Can We Help?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Our support team is here to help with tickets, payments,
            event information, accommodation assistance, and other
            questions about your Ticatility experience.
          </p>
        </div>

        {/* Support Cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Live Chat */}
          <div className="rounded-2xl border border-blue-500/20 bg-slate-900 p-8 shadow-xl">
            <div className="mb-5 text-4xl">💬</div>

            <h2 className="text-2xl font-bold mb-3">
              Live Chat
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
              Need help quickly? Start a conversation with our
              support team using the live chat button on this page.
            </p>

            <button
              type="button"
              onClick={() => {
                const smartsupp = (window as any).smartsupp;

                if (typeof smartsupp === "function") {
                  smartsupp("chat:open");
                }
              }}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Start Live Chat
            </button>
          </div>

          {/* Accommodation */}
          <div className="rounded-2xl border border-yellow-400/20 bg-slate-900 p-8 shadow-xl">
            <div className="mb-5 text-4xl">🏨</div>

            <h2 className="text-2xl font-bold mb-3">
              Accommodation Assistance
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
              Traveling for an event? Contact us for help finding
              suitable hotels and short-stay accommodation near
              your event venue.
            </p>

            <button
              type="button"
              onClick={() => {
                const smartsupp = (window as any).smartsupp;

                if (typeof smartsupp === "function") {
                  smartsupp("chat:open");
                }
              }}
              className="w-full rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
            >
              Ask About Accommodation
            </button>
          </div>

          {/* Ticket Support */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-8 shadow-xl">
            <div className="mb-5 text-4xl">🎟️</div>

            <h2 className="text-2xl font-bold mb-3">
              Ticket Support
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
              Questions about your order, payment confirmation,
              digital ticket, QR code, or ticket delivery?
              Our team can help.
            </p>

            <button
              type="button"
              onClick={() => {
                const smartsupp = (window as any).smartsupp;

                if (typeof smartsupp === "function") {
                  smartsupp("chat:open");
                }
              }}
              className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Get Ticket Help
            </button>
          </div>

          {/* Event Questions */}
          <div className="rounded-2xl border border-purple-500/20 bg-slate-900 p-8 shadow-xl">
            <div className="mb-5 text-4xl">📅</div>

            <h2 className="text-2xl font-bold mb-3">
              Event Questions
            </h2>

            <p className="text-slate-300 leading-relaxed mb-6">
              Need more information about an event, venue,
              date, location, or ticket availability?
              Talk to our support team.
            </p>

            <button
              type="button"
              onClick={() => {
                const smartsupp = (window as any).smartsupp;

                if (typeof smartsupp === "function") {
                  smartsupp("chat:open");
                }
              }}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700"
            >
              Ask About an Event
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 text-center">
          <p className="text-slate-400 mb-5">
            Prefer to continue browsing?
          </p>

          <Link
            href="/"
            className="inline-block rounded-xl bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}