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
};

type Event = {
  id?: string;
  title: string;
  slug: string;
  published?: boolean;
};

type EventPerformance = {
  slug: string;
  title: string;
  orders: number;
  tickets: number;
  revenue: number;
};

type DateRange = "all" | "today" | "7days" | "30days";
type StatusFilter = "all" | "approved" | "pending";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [dateRange, setDateRange] =
    useState<DateRange>("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  /*
 * LOAD ANALYTICS
 */
async function fetchAnalyticsData() {
  const {
    data: sessionData,
    error: sessionError,
  } = await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("You must be logged in.");
  }

  const response = await fetch(
    "/api/admin/analytics",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Failed to load analytics."
    );
  }

  setOrders(result.orders || []);
  setEvents(result.events || []);
}

/*
 * INITIAL LOAD
 */
async function loadAnalytics() {
  setLoading(true);

  try {
    await fetchAnalyticsData();
  } catch (error) {
    console.error(
      "Analytics loading error:",
      error
    );
  } finally {
    setLoading(false);
  }
}

/*
 * INITIAL LOAD
 */
useEffect(() => {
  loadAnalytics();
}, []);

/*
 * MANUAL REFRESH
 */
async function refreshAnalytics() {
  setRefreshing(true);

  try {
    await fetchAnalyticsData();
  } catch (error) {
    console.error(
      "Refresh analytics error:",
      error
    );
  } finally {
    setRefreshing(false);
  }
}

  /*
   * DATE FILTER
   */
  const filteredByDate = useMemo(() => {
    if (dateRange === "all") {
      return orders;
    }

    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    if (dateRange === "7days") {
      start.setDate(start.getDate() - 6);
    }

    if (dateRange === "30days") {
      start.setDate(start.getDate() - 29);
    }

    return orders.filter((order) => {
      if (!order.created_at) return false;

      const createdAt = new Date(order.created_at);

      return createdAt >= start && createdAt <= now;
    });
  }, [orders, dateRange]);

  /*
   * STATUS FILTER
   */
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return filteredByDate;
    }

    return filteredByDate.filter(
      (order) =>
        String(order.payment_status || "")
          .toLowerCase() === statusFilter
    );
  }, [filteredByDate, statusFilter]);

  /*
   * APPROVED ORDERS
   *
   * Revenue and tickets sold always come
   * from approved orders.
   */
  const approvedOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) =>
        String(order.payment_status || "")
          .toLowerCase() === "approved"
    );
  }, [filteredOrders]);

  /*
   * PENDING ORDERS
   */
  const pendingOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) =>
        String(order.payment_status || "")
          .toLowerCase() === "pending"
    );
  }, [filteredOrders]);

  /*
   * TOTAL REVENUE
   */
  const totalRevenue = useMemo(() => {
    return approvedOrders.reduce(
      (total, order) =>
        total + Number(order.total_price || 0),
      0
    );
  }, [approvedOrders]);

  /*
   * TOTAL TICKETS SOLD
   */
  const totalTicketsSold = useMemo(() => {
    return approvedOrders.reduce(
      (total, order) =>
        total + Number(order.quantity || 0),
      0
    );
  }, [approvedOrders]);

  /*
   * TOTAL ORDERS
   */
  const totalOrders = filteredOrders.length;

  /*
   * APPROVED COUNT
   */
  const approvedCount = approvedOrders.length;

  /*
   * PENDING COUNT
   */
  const pendingCount = pendingOrders.length;

  /*
   * UNIQUE CUSTOMERS
   */
  const uniqueCustomers = useMemo(() => {
    const emails = new Set<string>();

    filteredOrders.forEach((order) => {
      if (order.email) {
        emails.add(
          order.email.toLowerCase().trim()
        );
      }
    });

    return emails.size;
  }, [filteredOrders]);

  /*
   * EVENTS
   */
  const eventList = useMemo(() => {
    const map = new Map<string, Event>();

    events.forEach((event) => {
      if (!event.slug) return;

      map.set(event.slug, {
        id: event.id,
        title: event.title || event.slug,
        slug: event.slug,
        published: event.published,
      });
    });

    filteredOrders.forEach((order) => {
      if (!order.event_slug) return;

      if (!map.has(order.event_slug)) {
        map.set(order.event_slug, {
          title: formatEventName(
            order.event_slug
          ),
          slug: order.event_slug,
        });
      }
    });

    return Array.from(map.values());
  }, [events, filteredOrders]);

  /*
   * EVENT PERFORMANCE
   */
  const eventPerformance =
    useMemo<EventPerformance[]>(() => {
      return eventList
        .map((event) => {
          const eventOrders =
            approvedOrders.filter(
              (order) =>
                order.event_slug ===
                event.slug
            );

          const tickets =
            eventOrders.reduce(
              (total, order) =>
                total +
                Number(order.quantity || 0),
              0
            );

          const revenue =
            eventOrders.reduce(
              (total, order) =>
                total +
                Number(
                  order.total_price || 0
                ),
              0
            );

          return {
            slug: event.slug,
            title: event.title,
            orders: eventOrders.length,
            tickets,
            revenue,
          };
        })
        .sort(
          (a, b) =>
            b.revenue - a.revenue
        );
    }, [eventList, approvedOrders]);

  /*
   * TOP EVENT
   */
  const topEvent =
    eventPerformance.length > 0
      ? eventPerformance[0]
      : null;

  /*
   * AVERAGE ORDER
   */
  const averageOrder =
    approvedCount > 0
      ? totalRevenue / approvedCount
      : 0;

  /*
   * AVERAGE TICKET PRICE
   */
  const averageTicketPrice =
    totalTicketsSold > 0
      ? totalRevenue /
        totalTicketsSold
      : 0;

  /*
   * SALES LAST 7 DAYS
   */
  const salesLast7Days = useMemo(() => {
    const days: {
      label: string;
      tickets: number;
      revenue: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(
        date.getDate() - i
      );

      const nextDate = new Date(date);

      nextDate.setDate(
        nextDate.getDate() + 1
      );

      const dayOrders =
        approvedOrders.filter(
          (order) => {
            if (!order.created_at) {
              return false;
            }

            const createdAt =
              new Date(
                order.created_at
              );

            return (
              createdAt >= date &&
              createdAt < nextDate
            );
          }
        );

      const tickets =
        dayOrders.reduce(
          (total, order) =>
            total +
            Number(order.quantity || 0),
          0
        );

      const revenue =
        dayOrders.reduce(
          (total, order) =>
            total +
            Number(
              order.total_price || 0
            ),
          0
        );

      days.push({
        label: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),
        tickets,
        revenue,
      });
    }

    return days;
  }, [approvedOrders]);

  /*
   * MAX REVENUE FOR CHART
   */
  const maxDailyRevenue = Math.max(
    ...salesLast7Days.map(
      (day) => day.revenue
    ),
    1
  );

  /*
   * CURRENCY FORMATTER
   */
  const formatMoney = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  };

  /*
   * LOGOUT
   */
  async function handleLogout() {
    await supabaseClient.auth.signOut();

    window.location.href =
      "/login";
  }

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="animate-pulse">

              <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />

              <div className="h-4 bg-gray-200 rounded w-80 mx-auto mt-4" />

            </div>

            <p className="text-gray-500 mt-6">
              Loading analytics...
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 font-bold"
            >
              📊
              <span>Analytics</span>
            </Link>

          </nav>

          <div className="mt-auto space-y-3">

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-white/10 transition"
            >
              ←
              <span>Back to Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition text-left"
            >
              🚪
              <span>Logout</span>
            </button>

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
                  Analytics 📊
                </h1>

                <p className="text-gray-600 mt-2">
                  Monitor sales, revenue, tickets and customer activity.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={refreshAnalytics}
                  disabled={refreshing}
                  className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {refreshing
                    ? "Refreshing..."
                    : "↻ Refresh"}
                </button>

                <Link
                  href="/admin"
                  className="bg-white px-5 py-3 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow transition"
                >
                  Admin Home
                </Link>

                <Link
                  href="/admin/orders"
                  className="bg-white px-5 py-3 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow transition"
                >
                  Orders
                </Link>

                <Link
                  href="/admin/events"
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Events
                </Link>

              </div>

            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                    Analytics Filters
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Change the reporting period and order status.
                  </p>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* DATE */}
                  <select
                    value={dateRange}
                    onChange={(e) =>
                      setDateRange(
                        e.target
                          .value as DateRange
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">
                      All Time
                    </option>

                    <option value="today">
                      Today
                    </option>

                    <option value="7days">
                      Last 7 Days
                    </option>

                    <option value="30days">
                      Last 30 Days
                    </option>
                  </select>

                  {/* STATUS */}
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target
                          .value as StatusFilter
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">
                      All Orders
                    </option>

                    <option value="approved">
                      Approved Only
                    </option>

                    <option value="pending">
                      Pending Only
                    </option>
                  </select>

                </div>

              </div>

            </div>

            {/* STAT CARDS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* REVENUE */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {formatMoney(
                    totalRevenue
                  )}
                </h2>

                <p className="text-green-600 text-sm font-semibold mt-2">
                  Approved orders only
                </p>

              </div>

              {/* TICKETS */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Tickets Sold
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {totalTicketsSold}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  From approved orders
                </p>

              </div>

              {/* ORDERS */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Total Orders
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {totalOrders}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  {approvedCount} approved ·{" "}
                  {pendingCount} pending
                </p>

              </div>

              {/* CUSTOMERS */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Customers
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {uniqueCustomers}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Unique customer emails
                </p>

              </div>

            </div>

            {/* SECONDARY STATS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

              {/* EVENTS */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Events
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {eventList.length}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Events represented in analytics
                </p>

              </div>

              {/* AVERAGE ORDER */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Average Order
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {formatMoney(
                    averageOrder
                  )}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Average approved order
                </p>

              </div>

              {/* AVERAGE TICKET */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Average Ticket Price
                </p>

                <h2 className="text-3xl font-extrabold text-gray-900 mt-3">
                  {formatMoney(
                    averageTicketPrice
                  )}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  Average revenue per ticket
                </p>

              </div>

              {/* TOP EVENT */}
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  Top Event
                </p>

                <h2 className="text-xl font-extrabold text-gray-900 mt-3 truncate">
                  {topEvent
                    ? topEvent.title
                    : "No sales yet"}
                </h2>

                <p className="text-green-600 text-sm font-semibold mt-2">
                  {topEvent
                    ? formatMoney(
                        topEvent.revenue
                      )
                    : "$0.00"}{" "}
                  revenue
                </p>

              </div>

            </div>

            {/* SALES ACTIVITY */}
            <div className="bg-white rounded-2xl shadow-sm mt-8 p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                <div>

                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Sales Activity
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Approved ticket revenue over the last 7 days.
                  </p>

                </div>

                <div className="text-sm font-semibold text-gray-500">
                  {totalTicketsSold} tickets in selected period
                </div>

              </div>

              <div className="flex items-end gap-3 h-56">

                {salesLast7Days.map(
                  (day) => {

                    const height =
                      day.revenue > 0
                        ? Math.max(
                            8,
                            (day.revenue /
                              maxDailyRevenue) *
                              100
                          )
                        : 4;

                    return (
                      <div
                        key={day.label}
                        className="flex-1 h-full flex flex-col justify-end"
                      >

                        <div className="text-center text-xs font-bold text-gray-500 mb-2">

                          {day.revenue > 0
                            ? formatMoney(
                                day.revenue
                              )
                            : "$0"}

                        </div>

                        <div
                          className="bg-blue-600 rounded-t-xl hover:bg-blue-700 transition"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${day.label}: ${formatMoney(
                            day.revenue
                          )}`}
                        />

                        <div className="text-center text-xs font-bold text-gray-400 mt-3">
                          {day.label}
                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* EVENT PERFORMANCE */}
            <div className="bg-white rounded-2xl shadow-sm mt-8 overflow-hidden">

              <div className="p-6 border-b border-gray-100">

                <h2 className="text-2xl font-extrabold text-gray-900">
                  Event Performance
                </h2>

                <p className="text-gray-500 mt-1">
                  Approved sales performance for each event.
                </p>

              </div>

              {eventPerformance.length ===
              0 ? (

                <div className="p-10 text-center">

                  <div className="text-5xl mb-4">
                    🎟️
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    No event sales yet
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Event performance will appear here once approved orders are recorded.
                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="text-left bg-gray-50">

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Event
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Orders
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Tickets
                        </th>

                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                          Revenue
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {eventPerformance.map(
                        (event) => (

                          <tr
                            key={
                              event.slug
                            }
                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                          >

                            <td className="px-6 py-5">

                              <p className="font-bold text-gray-900">
                                {event.title}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                {event.slug}
                              </p>

                            </td>

                            <td className="px-6 py-5 font-semibold text-gray-700">
                              {event.orders}
                            </td>

                            <td className="px-6 py-5 font-semibold text-gray-700">
                              {event.tickets}
                            </td>

                            <td className="px-6 py-5 font-extrabold text-gray-900">
                              {formatMoney(
                                event.revenue
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* STATUS SUMMARY */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <div className="bg-white rounded-2xl shadow-sm p-6">

                <div className="flex items-center gap-3">

                  <span className="w-3 h-3 bg-green-500 rounded-full" />

                  <h2 className="text-xl font-extrabold text-gray-900">
                    Approved Orders
                  </h2>

                </div>

                <p className="text-4xl font-extrabold text-gray-900 mt-4">
                  {approvedCount}
                </p>

                <p className="text-gray-500 mt-2">
                  {formatMoney(
                    totalRevenue
                  )}{" "}
                  confirmed revenue
                </p>

              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">

                <div className="flex items-center gap-3">

                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />

                  <h2 className="text-xl font-extrabold text-gray-900">
                    Pending Orders
                  </h2>

                </div>

                <p className="text-4xl font-extrabold text-gray-900 mt-4">
                  {pendingCount}
                </p>

                <p className="text-gray-500 mt-2">
                  Awaiting payment approval
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/*
 * CONVERT SLUG TO READABLE EVENT NAME
 *
 * taylor-swift-london
 *
 * becomes:
 *
 * Taylor Swift London
 */
function formatEventName(
  slug: string
) {
  return slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}