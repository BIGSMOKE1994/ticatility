"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
    >
      Print Ticket
    </button>
  );
}