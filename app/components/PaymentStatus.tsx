export default function PaymentStatus() {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-6 mt-8">

      <h3 className="text-2xl font-bold text-yellow-400">
        🟡 Awaiting Verification
      </h3>

      <p className="mt-4 text-slate-300">
        We've received your payment submission.
      </p>

      <p className="mt-2 text-slate-400">
        Our team is verifying your USDT transaction.
        This usually takes between 5 and 15 minutes.
      </p>

    </div>
  );
}