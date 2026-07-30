"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type PaymentProofUploadProps = {
  eventTitle: string;
  amount: number;
};

export default function PaymentProofUpload({
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

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("payment-proofs")
      .upload(fileName, file);

    setUploading(false);

   if (!error) {
  const screenshotUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${fileName}`;

  const { error: dbError } = await supabase
    .from("payments")
    .insert([
      {
        event_title: eventTitle,
amount: amount,
        screenshot_url: screenshotUrl,
        status: "Pending",
      },
    ]);

  if (dbError) {
    alert(dbError.message);
    return;
  }

  setSuccess(true);
} else {
  alert(error.message);
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
        className="mt-6"
      />

      {uploading && (
        <p className="text-yellow-400 mt-4">
          Uploading...
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