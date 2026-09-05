"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DeleteEventButtonProps = {
  id: string;
};

export default function DeleteEventButton({
  id,
}: DeleteEventButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
  console.error(error);
  alert(error.message);
  return;
}

alert("Deleted!");

router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Delete
    </button>
  );
}