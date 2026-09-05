"use client";

import { useState } from "react";
import SeatMap from "@/components/SeatMap";

export default function CheckoutPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const ticketPrice = 250;
  const total = ticketPrice * quantity;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-extrabold mb-8">
          🎟 Checkout
        </h1>

        <div className="bg-slate-900 rounded-2xl p-8 space-y-8">

          {/* EVENT */}
          <div>
            <p className="text-slate-400">Event</p>

            <h2 className="text-2xl font-bold">
              FIFA World Cup 2026
            </h2>
          </div>

          {/* PRICE */}
          <div>
            <p className="text-slate-400">Ticket Price</p>

            <h2 className="text-2xl font-bold text-yellow-400">
              ${ticketPrice}
            </h2>
          </div>

          {/* QUANTITY */}
          <div>
            <label className="block mb-2 font-semibold">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const value = Math.max(1, Number(e.target.value));

                setQuantity(value);

                // Clear seats when quantity changes
                setSelectedSeats([]);
              }}
              className="w-32 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
            />
          </div>

          {/* SEAT MAP */}
          <SeatMap
            quantity={quantity}
            onSeatsSelected={setSelectedSeats}
          />

          {/* ORDER SUMMARY */}
          <div className="border-t border-slate-700 pt-6 space-y-4">

            <h2 className="text-2xl font-bold">
              Order Summary
            </h2>

            <div className="flex justify-between text-slate-300">
              <span>
                {quantity} ticket{quantity > 1 ? "s" : ""}
              </span>

              <span>
                ${total}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">
                Selected Seats
              </span>

              <span className="text-yellow-400 font-bold">
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "None"}
              </span>
            </div>

            <div className="flex justify-between text-xl font-bold pt-4">
              <span>Total</span>

              <span className="text-yellow-400">
                ${total}
              </span>
            </div>

          </div>

          {/* PAYMENT BUTTON */}
          <button
            disabled={selectedSeats.length !== quantity}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 py-4 rounded-xl font-bold text-lg"
          >
            Continue to Payment
          </button>

        </div>

      </div>
    </main>
  );
}