"use client";

import { useState } from "react";
import Link from "next/link";

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
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");

  const total = quantity * price;

  return (
    <div className="bg-slate-900 rounded-2xl p-8 space-y-6">

      <div>
        <p className="text-slate-400">Event</p>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div>
        <p className="text-slate-400">Location</p>
        <h2>📍 {location}</h2>
      </div>

      <div>
        <p className="text-slate-400">Date</p>
        <h2>📅 {date}</h2>
      </div>

      <div>
        <p className="text-slate-400">Price</p>
        <h2 className="text-yellow-400 text-2xl font-bold">
          ${price}
        </h2>
      </div>
<div>
  <label className="block mb-2 font-semibold">
    Full Name
  </label>

  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    placeholder="Enter your full name"
    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
  />
</div>

<div>
  <label className="block mb-2 font-semibold">
    Email Address
  </label>

  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3"
  />
</div>
      <div>
        <p className="mb-3 font-semibold">Quantity</p>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setQuantity((q) => Math.max(1, q - 1))
            }
            className="bg-slate-700 w-10 h-10 rounded-lg"
          >
            −
          </button>

          <span className="text-2xl font-bold">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="bg-slate-700 w-10 h-10 rounded-lg"
          >
            +
          </button>

        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <p className="text-slate-400">
          Total
        </p>

        <h2 className="text-4xl font-extrabold text-green-400">
          ${total}
        </h2>
      </div>

      <Link
  href={`/payment/${slug}`}
  className="block w-full text-center bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold"
>
  Continue to Payment
</Link>

    </div>
  );
}