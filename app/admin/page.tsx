export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-extrabold">
          🎟 Ticatility Admin Dashboard
        </h1>

        <p className="mt-4 text-slate-400">
          Manage ticket orders and crypto payments.
        </p>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-6 mt-12">

          <div className="bg-slate-900 rounded-2xl p-6">
            <p className="text-slate-400">Orders</p>
            <h2 className="text-4xl font-bold mt-3">12</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <p className="text-slate-400">Awaiting</p>
            <h2 className="text-4xl font-bold text-yellow-400 mt-3">4</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <p className="text-slate-400">Approved</p>
            <h2 className="text-4xl font-bold text-green-400 mt-3">7</h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <p className="text-slate-400">Rejected</p>
            <h2 className="text-4xl font-bold text-red-400 mt-3">1</h2>
          </div>

        </div>

        {/* Orders */}

        <div className="bg-slate-900 rounded-2xl mt-12 overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="text-left p-5">Customer</th>

                <th className="text-left p-5">Event</th>

                <th className="text-left p-5">Amount</th>

                <th className="text-left p-5">Status</th>

                <th className="text-left p-5">Actions</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t border-slate-800">

                <td className="p-5">Alex</td>

                <td className="p-5">FIFA World Cup 2026</td>

                <td className="p-5">$250</td>

                <td className="p-5">

                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                    Awaiting
                  </span>

                </td>

                <td className="p-5 space-x-3">

                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
                    Approve
                  </button>

                  <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
                    Reject
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}