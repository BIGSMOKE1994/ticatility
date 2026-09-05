"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

type Order = {
  id: string;
  full_name: string | null;
  email: string | null;
  event_slug: string | null;
  quantity: number | null;
  total_price: number | string | null;
  payment_status: string | null;
  order_number: string | null;
  created_at: string | null;
  seat_numbers?: string[] | null;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");

  async function loadOrders(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Orders loading error:", error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error("Orders error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  /*
   * EVENT LIST
   */
  const eventList = useMemo(() => {
    const events = new Set<string>();

    orders.forEach((order) => {
      if (order.event_slug) {
        events.add(order.event_slug);
      }
    });

    return Array.from(events).sort();
  }, [orders]);

  /*
   * FILTERED ORDERS
   */
  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return orders.filter((order) => {
      /*
       * SEARCH
       */
      const matchesSearch =
        !searchValue ||
        String(order.order_number || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(order.full_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(order.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(order.event_slug || "")
          .toLowerCase()
          .includes(searchValue);

      /*
       * STATUS
       */
      const normalizedStatus = String(
        order.payment_status || ""
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter.toLowerCase();

      /*
       * EVENT
       */
      const matchesEvent =
        eventFilter === "All" ||
        order.event_slug === eventFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEvent
      );
    });
  }, [orders, search, statusFilter, eventFilter]);

  /*
   * STATISTICS
   */
  const totalOrders = orders.length;

  const approvedOrders = orders.filter(
    (order) =>
      String(order.payment_status || "").toLowerCase() ===
      "approved"
  );

  const pendingOrders = orders.filter(
    (order) =>
      String(order.payment_status || "").toLowerCase() ===
      "pending"
  );

  const rejectedOrders = orders.filter(
    (order) =>
      String(order.payment_status || "").toLowerCase() ===
      "rejected"
  );

  const totalRevenue = approvedOrders.reduce(
    (total, order) =>
      total + Number(order.total_price || 0),
    0
  );

  /*
   * MONEY FORMAT
   */
  function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /*
   * DATE FORMAT
   */
  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  /*
   * STATUS BADGE
   */
  function getStatusClasses(status: string | null) {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (normalized === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  /*
   * EVENT NAME
   */
  function formatEventName(slug: string | null) {
    if (!slug) return "Unknown Event";

    return slug
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  }

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-80 mx-auto mt-4" />
            </div>

            <p className="text-gray-500 mt-6">
              Loading orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden md:flex w-64 bg-gray-950 text-white flex-col p-6">

          <div className="mb-10">
            <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">
              Ticatility
            </p>

            <h2 className="text-2xl font-extrabold mt-1">
              Admin
            </h2>
          </div>

          <nav className="space-y-3">

            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              🏠
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/events"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              🎟️
              <span>Events</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 font-bold"
            >
              🛒
              <span>Orders</span>
            </Link>

            <Link
              href="/admin/payments"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              💳
              <span>Payments</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              👥
              <span>Users</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              📊
              <span>Analytics</span>
            </Link>

          </nav>

          <div className="mt-auto">

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-white/10 transition"
            >
              ←
              <span>Back to Website</span>
            </Link>

          </div>

        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 p-6 md:p-10">

          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

              <div>
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                  Ticatility Admin
                </p>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">
                  Orders 🛒
                </h1>

                <p className="text-gray-600 mt-2">
                  Manage customer orders and monitor ticket purchases.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => loadOrders(true)}
                  disabled={refreshing}
                  className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-60"
                >
                  {refreshing ? "Refreshing..." : "↻ Refresh"}
                </button>

                <Link
                  href="/admin"
                  className="bg-white px-5 py-3 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow transition"
                >
                  Admin Home
                </Link>

                <Link
                  href="/admin/analytics"
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Analytics
                </Link>

              </div>

            </div>

            {/* SUMMARY CARDS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              {/* TOTAL */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Total Orders
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {totalOrders}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  All orders
                </p>

              </div>

              {/* APPROVED */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Approved
                </p>

                <h2 className="text-3xl font-extrabold text-green-600 mt-3">
                  {approvedOrders.length}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Confirmed orders
                </p>

              </div>

              {/* PENDING */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Pending
                </p>

                <h2 className="text-3xl font-extrabold text-yellow-600 mt-3">
                  {pendingOrders.length}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Awaiting approval
                </p>

              </div>

              {/* REVENUE */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Approved Revenue
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {formatMoney(totalRevenue)}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Approved orders only
                </p>

              </div>

            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">

              <div className="flex flex-col lg:flex-row gap-4">

                {/* SEARCH */}
                <div className="flex-1">

                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    Search Orders
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search order number, customer, email or event..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* STATUS */}
                <div className="lg:w-52">

                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    Payment Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">
                      All Statuses
                    </option>

                    <option value="Approved">
                      Approved
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>

                </div>

                {/* EVENT */}
                <div className="lg:w-64">

                  <label className="block text-sm font-bold text-gray-500 mb-2">
                    Event
                  </label>

                  <select
                    value={eventFilter}
                    onChange={(e) =>
                      setEventFilter(e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >

                    <option value="All">
                      All Events
                    </option>

                    {eventList.map((event) => (
                      <option
                        key={event}
                        value={event}
                      >
                        {formatEventName(event)}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              {/* FILTER RESULT */}
              <div className="mt-5 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700">

                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />

                  Showing {filteredOrders.length} of {orders.length} orders

                </span>

                {(search ||
                  statusFilter !== "All" ||
                  eventFilter !== "All") && (

                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("All");
                      setEventFilter("All");
                    }}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800"
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            </div>

            {/* ORDERS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

              <div className="p-6 border-b border-gray-100">

                <h2 className="text-2xl font-extrabold text-gray-900">
                  Customer Orders
                </h2>

                <p className="text-gray-500 mt-1">
                  Latest orders appear first.
                </p>

              </div>

              {filteredOrders.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="text-5xl mb-4">
                    🛒
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    No orders found
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Try changing your search or filters.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>
                      <tr className="bg-gray-50 text-left">

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Order
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Event
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Quantity
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Total
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Status
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Date
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {filteredOrders.map((order) => (

                        <tr
                          key={order.id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >

                          {/* ORDER */}
                          <td className="px-6 py-5">

                            <p className="font-bold text-gray-900 whitespace-nowrap">
                              {order.order_number || "—"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {order.id.slice(0, 8)}...
                            </p>

                          </td>

                          {/* CUSTOMER */}
                          <td className="px-6 py-5">

                            <p className="font-semibold text-gray-900">
                              {order.full_name || "Unknown"}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {order.email || "No email"}
                            </p>

                          </td>

                          {/* EVENT */}
                          <td className="px-6 py-5">

                            <p className="font-semibold text-gray-900">
                              {formatEventName(
                                order.event_slug
                              )}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {order.event_slug || "—"}
                            </p>

                          </td>

                          {/* QUANTITY */}
                          <td className="px-6 py-5">

                            <span className="font-bold text-gray-700">
                              {order.quantity || 0}
                            </span>

                          </td>

                          {/* TOTAL */}
                          <td className="px-6 py-5">

                            <p className="font-extrabold text-gray-900 whitespace-nowrap">
                              {formatMoney(
                                Number(
                                  order.total_price || 0
                                )
                              )}
                            </p>

                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getStatusClasses(
                                order.payment_status
                              )}`}
                            >
                              {order.payment_status ||
                                "Pending"}
                            </span>

                          </td>

                          {/* DATE */}
                          <td className="px-6 py-5">

                            <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                              {formatDate(
                                order.created_at
                              )}
                            </p>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* FOOTER */}
            <div className="mt-6 text-sm text-gray-500">

              Showing{" "}
              <span className="font-bold text-gray-700">
                {filteredOrders.length}
              </span>{" "}
              order
              {filteredOrders.length === 1
                ? ""
                : "s"}

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}