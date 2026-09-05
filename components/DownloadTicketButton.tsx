"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

type DownloadTicketButtonProps = {
  ticketNumber: string;
};

export default function DownloadTicketButton({
  ticketNumber,
}: DownloadTicketButtonProps) {
  const [loading, setLoading] = useState(false);

  async function downloadTicket() {
    try {
      setLoading(true);

      // Get the current logged-in user's session
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.access_token) {
        alert("Please log in again before downloading your ticket.");
        return;
      }

      // Send the access token to our API
      const response = await fetch(
        `/api/download-ticket?ticket=${encodeURIComponent(ticketNumber)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        let message = "Unable to download ticket.";

        try {
          const data = await response.json();

          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Ignore JSON parsing errors
        }

        alert(message);
        return;
      }

      // Convert the PDF response into a downloadable file
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${ticketNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Something went wrong while downloading your ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={downloadTicket}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-center py-3 rounded-xl font-bold transition"
    >
      {loading ? "Preparing Download..." : "↓ Download Ticket"}
    </button>
  );
}