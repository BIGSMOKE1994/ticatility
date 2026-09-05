import { supabaseAdmin } from "./supabaseAdmin";

export async function getOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateOrderStatus(
  id: string,
  status: string
) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: status,
    })
    .eq("id", id);

  if (error) throw error;
}