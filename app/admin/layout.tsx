import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;

  const isAdmin =
    user?.email &&
    adminEmail &&
    user.email.toLowerCase() ===
      adminEmail.toLowerCase();

  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6">

        <h1 className="text-3xl font-bold text-blue-500 mb-10">
          Ticatility
        </h1>

        <nav className="space-y-3">

          <Link
            href="/admin"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-white"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/admin/events"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-white"
          >
            🎟 Events
          </Link>

          <Link
            href="/admin/orders"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-white"
          >
            🛒 Orders
          </Link>

          <Link
            href="/admin/payments"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-white"
          >
            💳 Payments
          </Link>

          <Link
            href="/admin/users"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-white"
          >
            👥 Users
          </Link>

          <Link
            href="/admin/analytics"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-white"
          >
            📊 Analytics
          </Link>

          <Link
            href="/"
            className="block px-4 py-3 rounded-lg hover:bg-slate-800 text-red-400"
          >
            ← Back to Website
          </Link>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="flex-1 p-10 bg-slate-950 text-white">
        {children}
      </main>

    </div>
  );
}