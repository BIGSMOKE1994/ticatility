import { supabaseAdmin } from "./supabaseAdmin";

export async function getPayments() {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}