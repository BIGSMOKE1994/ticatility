export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold text-center mb-14">
        Why Choose Ticatility?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div className="bg-slate-900 p-8 rounded-2xl">
          <div className="text-5xl mb-5">🎟️</div>
          <h3 className="text-2xl font-bold mb-3">
            Verified Tickets
          </h3>

          <p className="text-slate-400">
            Every ticket listing is reviewed before reaching buyers.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">
          <div className="text-5xl mb-5">🔒</div>

          <h3 className="text-2xl font-bold mb-3">
            Secure Payments
          </h3>

          <p className="text-slate-400">
            Safe checkout with trusted payment processing.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">
          <div className="text-5xl mb-5">⚡</div>

          <h3 className="text-2xl font-bold mb-3">
            Fast Delivery
          </h3>

          <p className="text-slate-400">
            Receive your digital tickets quickly after purchase.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">
          <div className="text-5xl mb-5">🌍</div>

          <h3 className="text-2xl font-bold mb-3">
            Global Events
          </h3>

          <p className="text-slate-400">
            Discover concerts, sports, festivals and live experiences worldwide.
          </p>
        </div>

      </div>
    </section>
  );
}