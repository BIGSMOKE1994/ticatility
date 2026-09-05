"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

type Props = {
  id: string;
  published: boolean;
};

export default function TogglePublishButton({
  id,
  published,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePublish() {
    setLoading(true);

    const { error } = await supabase
      .from("events")
      .update({
        published: !published,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={togglePublish}
      disabled={loading}
      className={`px-4 py-2 rounded text-white font-semibold ${
        published
          ? "bg-gray-600 hover:bg-gray-700"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading
        ? "Updating..."
        : published
        ? "Unpublish"
        : "Publish"}
    </button>
  );
}