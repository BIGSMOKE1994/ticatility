"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutCardProps = {
  title: string;
  location: string;
  date: string;
  price: number;
  slug: string;
};

export default function CheckoutCard({
  title,
  location,
  date,
  price,
  slug,
}: CheckoutCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState<"Premium" | "VIP">(
    "Premium"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // -----------------------------------------
  // TICKET PRICES
  // -----------------------------------------

  const premiumPrice = price;
  const vipPrice = price * 2;

  const selectedTicketPrice =
    ticketType === "VIP" ? vipPrice : premiumPrice;

  const total = quantity * selectedTicketPrice;

  // -----------------------------------------
  // CREATE ORDER
  // -----------------------------------------

  async function handleCheckout() {
    if (loading) return;

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------
      // CREATE UNIQUE ORDER NUMBER
      // -----------------------------------------

      const orderNumber = `TIC-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase()}`;

      // -----------------------------------------
      // CREATE ORDER THROUGH SECURE API
      // -----------------------------------------

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber,
          fullName: fullName.trim(),
          email: email.trim(),
          eventSlug: slug,
          quantity,
          ticketType,
          seatNumbers: [],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Unable to create your order."
        );

        setLoading(false);
        return;
      }

      // -----------------------------------------
      // GO TO PAYMENT
      // -----------------------------------------

      router.push(
        `/payment/${slug}?order=${encodeURIComponent(
          result.orderNumber
        )}`
      );
    } catch (error) {
      console.error("Checkout error:", error);

      alert(
        "Something went wrong while creating your order. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-8 space-y-6">

      {/* -----------------------------------------
          EVENT
      ----------------------------------------- */}

      <div>
        <p className="text-slate-400">
          Event
        </p>

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
      </div>

      {/* -----------------------------------------
          LOCATION
      ----------------------------------------- */}

      <div>
        <p className="text-slate-400">
          Location
        </p>

        <h2 className="text-white">
          📍 {location}
        </h2>
      </div>

      {/* -----------------------------------------
          DATE
      ----------------------------------------- */}

      <div>
        <p className="text-slate-400">
          Date
        </p>

        <h2 className="text-white">
          📅 {date}
        </h2>
      </div>

      {/* -----------------------------------------
          TICKET TYPE
      ----------------------------------------- */}

      <div>
        <p className="mb-4 font-semibold text-white">
          🎟 Choose Your Ticket
        </p>

        <div className="grid gap-4">

          {/* PREMIUM */}

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              setTicketType("Premium")
            }
            className={`w-full rounded-xl border p-5 text-left transition ${
              ticketType === "Premium"
                ? "border-yellow-400 bg-slate-800 ring-2 ring-yellow-400"
                : "border-slate-700 bg-slate-800 hover:border-slate-500"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-white">
                  ⭐ Premium
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Excellent seating and premium
                  event access.
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400">
                  From
                </p>

                <p className="text-xl font-bold text-yellow-400">
                  ${premiumPrice.toLocaleString()}
                </p>
              </div>

            </div>
          </button>

          {/* VIP */}

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              setTicketType("VIP")
            }
            className={`w-full rounded-xl border p-5 text-left transition ${
              ticketType === "VIP"
                ? "border-yellow-400 bg-slate-800 ring-2 ring-yellow-400"
                : "border-slate-700 bg-slate-800 hover:border-slate-500"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-white">
                  👑 VIP
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Premium location and VIP
                  event benefits.
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400">
                  From
                </p>

                <p className="text-xl font-bold text-yellow-400">
                  ${vipPrice.toLocaleString()}
                </p>
              </div>

            </div>
          </button>

        </div>
      </div>

      {/* -----------------------------------------
          SELECTED TICKET
      ----------------------------------------- */}

      <div className="rounded-xl bg-slate-800 p-5">

        <p className="text-sm text-slate-400">
          Selected Ticket
        </p>

        <h3 className="mt-1 text-xl font-bold text-white">
          {ticketType === "VIP"
            ? "👑 VIP"
            : "⭐ Premium"}
        </h3>

        <p className="mt-1 text-yellow-400 font-semibold">
          ${selectedTicketPrice.toLocaleString()} per ticket
        </p>

      </div>

      {/* -----------------------------------------
          FULL NAME
      ----------------------------------------- */}

      <div>
        <label className="block mb-2 font-semibold text-white">
          Full Name
        </label>

        <input
          type="text"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
          placeholder="Enter your full name"
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* -----------------------------------------
          EMAIL
      ----------------------------------------- */}

      <div>
        <label className="block mb-2 font-semibold text-white">
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Enter your email"
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* -----------------------------------------
          QUANTITY
      ----------------------------------------- */}

      <div>
        <p className="mb-3 font-semibold text-white">
          Quantity
        </p>

        <div className="flex items-center gap-4">

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              setQuantity((q) =>
                Math.max(1, q - 1)
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-xl font-bold text-white hover:bg-slate-600 disabled:opacity-50"
          >
            −
          </button>

          <span className="text-2xl font-bold text-white">
            {quantity}
          </span>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              setQuantity((q) => q + 1)
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-xl font-bold text-white hover:bg-slate-600 disabled:opacity-50"
          >
            +
          </button>

        </div>
      </div>

      {/* -----------------------------------------
          ORDER SUMMARY
      ----------------------------------------- */}

      <div className="border-t border-slate-700 pt-6">

        <p className="mb-4 text-lg font-bold text-white">
          Order Summary
        </p>

        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="text-slate-400">
              Ticket Type
            </span>

            <span className="font-semibold text-white">
              {ticketType}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">
              Price per ticket
            </span>

            <span className="font-semibold text-white">
              ${selectedTicketPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">
              Quantity
            </span>

            <span className="font-semibold text-white">
              {quantity}
            </span>
          </div>

        </div>

      </div>

      {/* -----------------------------------------
          TOTAL
      ----------------------------------------- */}

      <div className="border-t border-slate-700 pt-6">

        <p className="text-slate-400">
          Total
        </p>

        <h2 className="text-4xl font-extrabold text-green-400">
          ${total.toLocaleString()}
        </h2>

      </div>

      {/* -----------------------------------------
          CONTINUE TO PAYMENT
      ----------------------------------------- */}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500"
      >
        {loading
          ? "Creating Order..."
          : "Continue to Payment"}
      </button>

    </div>
  );
}