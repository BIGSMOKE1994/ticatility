"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const categories = [
  {
    label: "Concerts",
    options: [
      ["concerts", "🎤 All Concerts"],
      ["pop", "🎵 Pop"],
      ["rock", "🎸 Rock"],
      ["hip-hop", "🎤 Hip-Hop & Rap"],
      ["rnb", "🎶 R&B"],
      ["afrobeats", "🌍 Afrobeats"],
      ["festivals", "🎪 Festivals"],
    ],
  },
  {
    label: "Sports",
    options: [
      ["sports", "🏆 All Sports"],
      ["premier-league", "⚽ Premier League"],
      ["mls", "⚽ MLS"],
      ["champions-league", "⚽ Champions League"],
      ["la-liga", "⚽ La Liga"],
      ["serie-a", "⚽ Serie A"],
      ["bundesliga", "⚽ Bundesliga"],
      ["f1", "🏎️ Formula 1"],
      ["nba", "🏀 NBA"],
      ["nfl", "🏈 NFL"],
      ["mlb", "⚾ MLB"],
      ["tennis", "🎾 Tennis"],
      ["boxing", "🥊 Boxing"],
      ["ufc", "🥋 UFC"],
    ],
  },
  {
    label: "Theatre",
    options: [
      ["theatre", "🎭 All Theatre"],
      ["broadway", "🎟️ Broadway"],
      ["west-end", "🎭 West End"],
      ["musicals", "🎶 Musicals"],
      ["comedy", "😂 Comedy"],
      ["family", "👨‍👩‍👧 Family Shows"],
    ],
  },
];

export default function NewEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [category, setCategory] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(createSlug(value));
    }
  }

  async function publishEvent(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!category) {
      setError("Please select an event category.");
      return;
    }

    if (!venue.trim() || !city.trim() || !country.trim()) {
      setError("Please complete the venue, city and country.");
      return;
    }

    if (!eventDate) {
  setError("Please select an event date.");
  return;
}

if (!eventTime || !eventTime.trim()) {
  setError("Please select an event time.");
  return;
}

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid ticket price.");
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      setError("Please enter a valid ticket quantity.");
      return;
    }

    if (!image) {
      setError("Please select an event image.");
      return;
    }

    setPublishing(true);

    try {
      // --------------------------------
      // UPLOAD EVENT IMAGE
      // --------------------------------

      const fileExtension = image.name.split(".").pop();

      const fileName = `${Date.now()}-${createSlug(title)}.${fileExtension}`;

      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          `Image upload failed: ${uploadError.message}`
        );
      }

      // --------------------------------
      // GET PUBLIC IMAGE URL
      // --------------------------------

      const { data: imageData } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      const imageUrl = imageData.publicUrl;

      // --------------------------------
      // CREATE EVENT
      // --------------------------------
console.log("EVENT DATE:", eventDate);
console.log("EVENT TIME:", eventTime);
      const { error: eventError } = await supabase
        .from("events")
        .insert([
          {
            title: title.trim(),
            slug: slug || createSlug(title),
            description: description.trim(),

            venue: venue.trim(),
            city: city.trim(),
            country: country.trim(),

            event_date: eventDate,
event_time: eventTime.trim(),

            price: Number(price),
            quantity: Number(quantity),

            category,

            image_url: imageUrl,

            published: true,
          },
        ]);

      if (eventError) {
        throw new Error(
          `Event creation failed: ${eventError.message}`
        );
      }

      setSuccess("Event published successfully!");

      setTimeout(() => {
        router.push("/admin/events");
      }, 1200);

    } catch (err: any) {
      console.error("Publish event error:", err);

      setError(
        err?.message ||
        "Something went wrong while publishing the event."
      );

      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-blue-400 uppercase tracking-wider text-sm font-semibold">
            Admin
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Create New Event
          </h1>

          <p className="text-slate-400 mt-3">
            Add a new event to the Ticatility marketplace.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={publishEvent}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8"
        >

          {/* BASIC INFORMATION */}

          <section>

            <h2 className="text-xl font-semibold mb-5">
              Event Information
            </h2>

            <div className="space-y-5">

              {/* TITLE */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Event Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    handleTitleChange(e.target.value)
                  }
                  placeholder="e.g. Arsenal vs Chelsea"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>


              {/* SLUG */}

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Event Slug
                </label>

                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="arsenal-vs-chelsea"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

                <p className="text-xs text-slate-500 mt-2">
                  Used for the event URL.
                </p>
              </div>


              {/* CATEGORY */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select a category
                  </option>

                  {categories.map((group) => (
                    <optgroup
                      key={group.label}
                      label={group.label}
                    >

                      {group.options.map(
                        ([value, label]) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        )
                      )}

                    </optgroup>
                  ))}

                </select>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Tell customers about this event..."
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
                />

              </div>

            </div>

          </section>


          {/* LOCATION */}

          <section>

            <h2 className="text-xl font-semibold mb-5">
              Location
            </h2>

            <div className="grid md:grid-cols-3 gap-5">

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Venue
                </label>

                <input
                  value={venue}
                  onChange={(e) =>
                    setVenue(e.target.value)
                  }
                  placeholder="Emirates Stadium"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  City
                </label>

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="London"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Country
                </label>

                <input
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                  placeholder="United Kingdom"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>

          </section>


          {/* DATE & TICKETS */}

          <section>

            <h2 className="text-xl font-semibold mb-5">
              Event & Ticket Details
            </h2>

            <div className="grid md:grid-cols-3 gap-5">

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Event Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) =>
                    setEventDate(e.target.value)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Event Time
                </label>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) =>
                    setEventTime(e.target.value)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Ticket Price ($)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="150"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>


            <div className="mt-5 max-w-sm">

              <label className="block text-sm text-slate-400 mb-2">
                Available Tickets
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="500"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

            </div>

          </section>


          {/* IMAGE */}

          <section>

            <h2 className="text-xl font-semibold mb-5">
              Event Image
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            {image && (
              <p className="text-sm text-slate-400 mt-3">
                Selected: {image.name}
              </p>
            )}

          </section>


          {/* ERROR */}

          {error && (
            <div className="bg-red-950/40 border border-red-800 text-red-400 rounded-lg p-4">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="bg-green-950/40 border border-green-800 text-green-400 rounded-lg p-4">
              {success}
            </div>
          )}


          {/* BUTTON */}

          <div className="pt-2">

            <button
              type="submit"
              disabled={publishing}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-3 rounded-lg font-semibold transition"
            >
              {publishing
                ? "Publishing Event..."
                : "Publish Event"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}