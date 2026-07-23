export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-extrabold mb-8">
          🎟 Checkout
        </h1>

        <div className="bg-slate-900 rounded-2xl p-8 space-y-6">

          <div>
            <p className="text-slate-400">Event</p>
            <h2 className="text-2xl font-bold">
              FIFA World Cup 2026
            </h2>
          </div>

          <div>
            <p className="text-slate-400">Ticket Price</p>
            <h2 className="text-2xl font-bold text-yellow-400">
              $250
            </h2>
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-32 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg">
            Continue to Payment
          </button>

        </div>

      </div>
    </main>
  );
}