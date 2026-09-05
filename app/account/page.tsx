"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

type Order = {
  id: string;
  order_number: string;
  full_name: string;
  email: string;
  event_slug: string;
  quantity: number;
  total_price: number;
  payment_status: string;
  seat_numbers: string[] | null;
  created_at: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      // Get the customer's current session
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.access_token) {
        setOrdersError("Your session has expired. Please log in again.");
        setOrdersLoading(false);
        setLoading(false);
        return;
      }

      // Load ONLY this customer's orders
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Orders API error:", result);

        setOrdersError(
          result.error || "Unable to load your orders."
        );
      } else {
        setOrders(result.orders || []);
      }

      setOrdersLoading(false);
      setLoading(false);
    }

    loadAccount();
  }, [router]);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.push("/");
  }

  async function handleChangePassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError(
        "Your new password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setChangingPassword(true);

    const { error } =
      await supabaseClient.auth.updateUser({
        password: newPassword,
      });

    setChangingPassword(false);

    if (error) {
      setError(error.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);

    setMessage(
      "Your password has been successfully changed."
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading your account...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">
            Customer Account
          </p>

          <h1 className="text-4xl font-bold mt-2">
            My Account
          </h1>

          <p className="text-slate-400 mt-3">
            Manage your Ticatility account and tickets.
          </p>
        </div>

        {/* Account Information */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">
            Account Information
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-slate-400 mb-1">
                Email Address
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
                {email}
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">
                Account Status
              </p>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>

                <span className="text-green-400">
                  Active
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-2 gap-6">

          <Link
            href="/dashboard"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >
            <div className="text-3xl mb-3">
              🎟️
            </div>

            <h2 className="text-xl font-semibold">
              My Tickets
            </h2>

            <p className="text-slate-400 mt-2">
              View and download your purchased tickets.
            </p>
          </Link>

          <Link
            href="/events"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
          >
            <div className="text-3xl mb-3">
              🎫
            </div>

            <h2 className="text-xl font-semibold">
              Browse Events
            </h2>

            <p className="text-slate-400 mt-2">
              Discover upcoming concerts, sports and live events.
            </p>
          </Link>

        </section>

        {/* My Orders */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                My Orders
              </h2>

              <p className="text-slate-400 mt-1">
                View your Ticatility order history.
              </p>
            </div>

            <span className="text-2xl">
              📦
            </span>
          </div>

          {ordersLoading ? (
            <p className="text-slate-400">
              Loading your orders...
            </p>
          ) : ordersError ? (
            <div className="bg-red-950/30 border border-red-900 rounded-xl p-4">
              <p className="text-red-400">
                {ordersError}
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">
                🎟️
              </div>

              <h3 className="font-semibold text-lg">
                No orders yet
              </h3>

              <p className="text-slate-400 mt-2 mb-5">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/events"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                      <p className="text-sm text-slate-400">
                        Order Number
                      </p>

                      <p className="font-semibold text-lg">
                        {order.order_number}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-semibold ${
                        order.payment_status?.toLowerCase() ===
                        "confirmed"
                          ? "bg-green-900/40 text-green-400"
                          : "bg-yellow-900/40 text-yellow-400"
                      }`}
                    >
                      {order.payment_status}
                    </span>

                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-5">

                    <div>
                      <p className="text-xs text-slate-500 uppercase">
                        Event
                      </p>

                      <p className="text-slate-200 mt-1">
                        {order.event_slug}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase">
                        Quantity
                      </p>

                      <p className="text-slate-200 mt-1">
                        {order.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase">
                        Total
                      </p>

                      <p className="text-blue-400 font-semibold mt-1">
                        ${Number(order.total_price).toFixed(2)}
                      </p>
                    </div>

                  </div>

                  {order.seat_numbers &&
                    order.seat_numbers.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-slate-500 uppercase mb-2">
                          Selected Seats
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {order.seat_numbers.map(
                            (seat) => (
                              <span
                                key={seat}
                                className="bg-blue-600/20 border border-blue-500/40 text-blue-400 px-3 py-1 rounded-md text-sm"
                              >
                                {seat}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="mt-5">
                    <Link
                      href="/dashboard"
                      className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      View My Tickets
                    </Link>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Security */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

          <h2 className="text-xl font-semibold mb-3">
            Security
          </h2>

          <p className="text-slate-400 mb-5">
            Keep your Ticatility account secure.
          </p>

          {!showPasswordForm ? (
            <button
              onClick={() => {
                setShowPasswordForm(true);
                setMessage("");
                setError("");
              }}
              className="border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-lg transition"
            >
              Change Password
            </button>
          ) : (
            <form
              onSubmit={handleChangePassword}
              className="space-y-4 max-w-md"
            >

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">
                  {error}
                </p>
              )}

              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition"
                >
                  {changingPassword
                    ? "Updating..."
                    : "Update Password"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="border border-slate-700 hover:bg-slate-800 px-5 py-2 rounded-lg transition"
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

          {message && (
            <p className="text-green-400 mt-4">
              {message}
            </p>
          )}

        </section>

        {/* Logout */}
        <section className="mt-10 pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition"
          >
            ← Log out of Ticatility
          </button>
        </section>

      </div>
    </main>
  );
}