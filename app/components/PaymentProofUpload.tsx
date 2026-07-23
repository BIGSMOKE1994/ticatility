"use client";

import { useState } from "react";

export default function PaymentProofUpload() {
  const [fileName, setFileName] = useState("");

  return (
    <div className="bg-slate-800 rounded-xl p-6 mt-8">

      <h3 className="text-2xl font-bold">
        Upload Payment Proof
      </h3>

      <p className="text-slate-400 mt-2">
        Upload a screenshot of your USDT transaction.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFileName(e.target.files?.[0]?.name || "")
        }
        className="mt-6 block w-full text-sm"
      />

      {fileName && (
        <p className="mt-4 text-green-400">
          ✅ {fileName}
        </p>
      )}

      <button
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold"
      >
        Upload Screenshot
      </button>

    </div>
  );
}