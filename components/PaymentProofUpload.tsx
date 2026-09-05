"use client";

import { useState } from "react";

type PaymentProofUploadProps = {
  orderNumber: string;
  eventTitle: string;
  amount: number;
};

export default function PaymentProofUpload({
  orderNumber,
  eventTitle,
  amount,
}: PaymentProofUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function uploadFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSuccess(false);
    setUploading(true);

    try {
      // -----------------------------------------
      // CREATE FORM DATA
      // -----------------------------------------

      const formData = new FormData();

      formData.append("file", file);
      formData.append("orderNumber", orderNumber);

      // -----------------------------------------
      // SEND TO SECURE SERVER API
      // -----------------------------------------

      const response = await fetch(
        "/api/upload-payment-proof",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Unable to upload payment proof."
        );

        setUploading(false);
        return;
      }

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      setSuccess(true);
    } catch (error) {
      console.error(
        "Payment proof upload error:",
        error
      );

      alert(
        "Something went wrong while uploading your payment proof."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 mt-8">

      <h3 className="text-2xl font-bold">
        Upload Payment Proof
      </h3>

      <p className="text-slate-400 mt-2">
        Upload your payment screenshot.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={uploadFile}
        disabled={uploading}
        className="mt-6 disabled:opacity-50"
      />

      {uploading && (
        <p className="text-yellow-400 mt-4">
          Uploading payment proof...
        </p>
      )}

      {success && (
        <p className="text-green-400 mt-4">
          ✅ Screenshot uploaded successfully!
        </p>
      )}

    </div>
  );
}