"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateQRCode } from "@/lib/generateQRCode";

type OrderActionsProps = {
  orderId: string;
  fullName: string;
  email: string;
  eventSlug: string;
  quantity: number;
};

export default function OrderActions({
  orderId,
  fullName,
  email,
  eventSlug,
  quantity,
}: OrderActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function updateStatus(status: "Approved" | "Rejected") {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: status,
      })
      .eq("id", orderId);

    if (error) {
      alert(error.message);
      return;
    }

    if (status === "Approved") {
      const ticketNumber =
        "TIC-" +
        Math.random().toString(36).substring(2, 10).toUpperCase();

      const qrDataUrl = await generateQRCode(ticketNumber);

      const qrBlob = await (await fetch(qrDataUrl)).blob();

      const qrFileName = `${ticketNumber}.png`;

      const { error: uploadError } = await supabase.storage
        .from("ticket-qrcodes")
        .upload(qrFileName, qrBlob, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const qrCodeUrl =
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-qrcodes/${qrFileName}`;

      const { error: ticketError } = await supabase
        .from("tickets")
        .insert({
          ticket_number: ticketNumber,
          order_id: orderId,
          full_name: fullName,
          email,
          event_slug: eventSlug,
          quantity,
          qr_code: qrCodeUrl,
        });

      if (ticketError) {
        alert(ticketError.message);
        return;
      }
      const response = await fetch("/api/send-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName,
          ticketNumber,
          eventSlug,
          quantity,
          qrCodeUrl,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert("Ticket created, but email could not be sent.");
      }
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => updateStatus("Approved")}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Approve
      </button>

      <button
        disabled={isPending}
        onClick={() => updateStatus("Rejected")}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}