import { supabase } from "./supabase";

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data ?? [];
}

export async function getPublishedEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published events:", error);
    return [];
  }

  return data ?? [];
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching event by slug:", error);
    return null;
  }

  return data;
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }

  return data;
}