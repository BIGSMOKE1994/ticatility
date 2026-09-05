import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    {
      title: "Events",
      description: "Manage all events",
      href: "/admin/events",
      icon: "🎟️",
      color: "bg-blue-600",
    },
    {
      title: "Orders",
      description: "View customer orders",
      href: "/admin/orders",
      icon: "🛒",
      color: "bg-green-600",
    },
    {
      title: "Payments",
      description: "Approve payments",
      href: "/admin/payments",
      icon: "💳",
      color: "bg-yellow-500",
    },
    {
      title: "Users",
      description: "Manage registered users",
      href: "/admin/users",
      icon: "👥",
      color: "bg-purple-600",
    },
    {
      title: "Analytics",
      description: "Revenue & statistics",
      href: "/admin/analytics",
      icon: "📊",
      color: "bg-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Ticatility Admin Dashboard
        </h1>

        <p className="text-slate-400 mb-10">
          Welcome back. Manage your platform from one place.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-slate-900 rounded-2xl p-8 hover:scale-105 transition shadow-lg border border-slate-800"
            >
              <div
                className={`${card.color} w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-6`}
              >
                {card.icon}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {card.title}
              </h2>

              <p className="text-slate-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}