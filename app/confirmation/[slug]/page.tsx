import Link from "next/link";
import { getEventBySlug } from "@/lib/events";
import PaymentProofUpload from "@/components/PaymentProofUpload";
import PaymentStatus from "@/components/PaymentStatus";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

        <div className="bg-slate-900 rounded-2xl p-10 text-center">

          <div className="text-7xl mb-6">
            ✅
          </div>

          <h1 className="text-5xl font-extrabold">
            Payment Submitted
          </h1>

          <p className="mt-6 text-slate-300 text-lg">
            Thank you for submitting your payment for
          </p>

          <h2 className="text-3xl font-bold text-blue-400 mt-3">
            {event.title}
          </h2>

          <div className="mt-10 rounded-xl bg-slate-800 p-6 text-left">

            <p className="text-slate-400">
              What happens next?
            </p>

            <ul className="mt-4 space-y-3 text-slate-300">
              <li>✅ We will verify your USDT payment.</li>
              <li>✅ Once confirmed, your ticket will be generated.</li>
              <li>✅ Your digital ticket will become available instantly.</li>
            </ul>

          </div>

          <PaymentStatus />

          <PaymentProofUpload
            eventTitle={event.title}
            amount={Number(event.price)}
          />

          <Link
            href="/"
            className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold"
          >
            Back to Home
          </Link>

        </div>

      </div>
    </main>
  );
}