import Link from "next/link";
import { getEventBySlug } from "@/lib/events";
import { wallet } from "@/config/wallet";
import PaymentQRCode from "@/components/PaymentQRCode";
import PaymentProofUpload from "@/components/PaymentProofUpload";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { slug } = await params;
  const { order } = await searchParams;

  const event = await getEventBySlug(slug);

  if (!event || !order) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Payment not found
        </h1>
      </main>
    );
  }

  // Get the actual order
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("order_number, event_slug, quantity, total_price")
    .eq("order_number", order)
    .single();

  if (orderError || !orderData) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Order not found
        </h1>
      </main>
    );
  }

  // Make sure this order belongs to this event
  if (orderData.event_slug !== slug) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Invalid order
        </h1>
      </main>
    );
  }

  const quantity = Number(orderData.quantity);
  const total = Number(orderData.total_price);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-extrabold mb-10">
          💳 Crypto Payment
        </h1>

        <div className="bg-slate-900 rounded-2xl p-8 space-y-8">

          <div>
            <p className="text-slate-400">Event</p>

            <h2 className="text-3xl font-bold">
              {event.title}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Quantity</p>

            <h2 className="text-2xl font-bold">
              {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Amount Due</p>

            <h2 className="text-4xl text-green-400 font-bold">
              ${total.toFixed(2)}
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Order Number</p>

            <div className="bg-slate-800 rounded-xl p-4 mt-2">
              {orderData.order_number}
            </div>
          </div>

          <div>
            <p className="text-slate-400">Wallet Address</p>

            <div className="bg-slate-800 rounded-xl p-4 mt-2 break-all">
              {wallet.address}
            </div>
          </div>

          <PaymentQRCode value={wallet.address} />

          <PaymentProofUpload
            orderNumber={orderData.order_number}
            eventTitle={event.title}
            amount={total}
          />

          <Link
            href={`/confirmation/${slug}`}
            className="block w-full text-center bg-green-600 hover:bg-green-700 py-4 rounded-xl text-xl font-bold"
          >
            I've Sent Payment
          </Link>

        </div>
      </div>
    </main>
  );
}