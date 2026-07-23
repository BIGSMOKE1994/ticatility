import Link from "next/link";
import { events } from "../../data/events";
import { wallet } from "../../config/wallet";
import PaymentQRCode from "../../components/PaymentQRCode";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = events.find((event) => event.slug === slug);

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Payment not found</h1>
      </main>
    );
  }

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
            <p className="text-slate-400">Amount Due</p>
            <h2 className="text-4xl text-green-400 font-bold">
              {event.price}
            </h2>
          </div>

          <div>
            <p className="text-slate-400 mb-3">
              Payment Method
            </p>

            <div className="rounded-xl bg-slate-800 p-5 border border-green-500">
              <h3 className="text-2xl font-bold text-green-400">
  {wallet.network}
</h3>

              <p className="text-slate-300 mt-2">
                Send the exact payment amount to the wallet address below.
              </p>
            </div>
          </div>

          <div>
            <p className="text-slate-400">
              Wallet Address
            </p>

            <div className="bg-slate-800 rounded-xl p-4 mt-2 break-all">
              {wallet.address}
            </div>
          </div>
          <div>
  <p className="text-slate-400 mb-4">
    Scan QR Code
  </p>

  <PaymentQRCode value={wallet.address} />
</div>
         

          <div className="rounded-xl bg-yellow-500/10 border border-yellow-500 p-5">
            <h3 className="font-bold text-yellow-400">
              ⚠ Important
            </h3>

            <p className="mt-2 text-slate-300">
              Only send <strong>USDT on the TRON (TRC20)</strong> network.
              Sending funds on another network may result in permanent loss.
            </p>
          </div>

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