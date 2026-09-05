"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    venue: string | null;
    city: string | null;
    country: string | null;
    event_date: string | null;
    event_time: string | null;
    price: number;
    quantity: number | null;
    category: string | null;
    image_url: string | null;
  };
};

/*
  Convert whatever is stored in Supabase into a valid
  HTML <input type="time"> value.

  Examples:

  "08:00"       -> "08:00"
  "08:00:00"    -> "08:00"
  "08:00 --"    -> "08:00"
  "08:00 AM"    -> "08:00"
  null          -> ""
*/
function normalizeTime(value: string | null) {
  if (!value) return "";

  const match = value.match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return "";
  }

  const hours = match[1].padStart(2, "0");
  const minutes = match[2];

  const hourNumber = Number(hours);
  const minuteNumber = Number(minutes);

  if (
    hourNumber < 0 ||
    hourNumber > 23 ||
    minuteNumber < 0 ||
    minuteNumber > 59
  ) {
    return "";
  }

  return `${hours}:${minutes}`;
}

/*
  Make sure the date is also in the format expected
  by <input type="date">.
*/
function normalizeDate(value: string | null) {
  if (!value) return "";

  // Already YYYY-MM-DD
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);

  if (match) {
    return match[1];
  }

  return "";
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditEventForm({ event }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(event.title || "");

  const [slug, setSlug] = useState(event.slug || "");

  const [description, setDescription] = useState(
    event.description || ""
  );

  const [venue, setVenue] = useState(event.venue || "");

  const [city, setCity] = useState(event.city || "");

  const [country, setCountry] = useState(event.country || "");

  /*
    IMPORTANT:
    Normalize the values coming from Supabase.
  */
  const [eventDate, setEventDate] = useState(
    normalizeDate(event.event_date)
  );

  const [eventTime, setEventTime] = useState(
    normalizeTime(event.event_time)
  );

  const [price, setPrice] = useState(
    event.price != null ? String(event.price) : ""
  );

  const [quantity, setQuantity] = useState(
    event.quantity != null ? String(event.quantity) : ""
  );

  const [category, setCategory] = useState(
    event.category || ""
  );

  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      /*
        --------------------------------
        VALIDATE BASIC FIELDS
        --------------------------------
      */

      if (!title.trim()) {
        throw new Error("Please enter an event title.");
      }

      if (!city.trim()) {
        throw new Error("Please enter the event city.");
      }

      if (!country.trim()) {
        throw new Error("Please enter the event country.");
      }

      if (!eventDate) {
        throw new Error("Please enter a valid event date.");
      }

      if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(eventTime)) {
  throw new Error(
    "Please enter a valid time in HH:MM format, for example 20:00."
  );
}

      if (!price || Number(price) < 0) {
        throw new Error("Please enter a valid ticket price.");
      }

      if (!quantity || Number(quantity) < 1) {
        throw new Error("Please enter a valid ticket quantity.");
      }

      /*
        --------------------------------
        IMAGE
        --------------------------------
      */

      let imageUrl = event.image_url;

      if (image) {
        const fileExtension =
          image.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${Date.now()}-${createSlug(
          title
        )}.${fileExtension}`;

        const filePath = `events/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
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

        const { data: imageData } =
          supabase.storage
            .from("event-images")
            .getPublicUrl(filePath);

        imageUrl = imageData.publicUrl;
      }

      /*
        --------------------------------
        PREPARE TIME FOR DATABASE
        --------------------------------

        HTML gives us HH:MM.

        We save HH:MM:00 so Supabase/Postgres
        can safely store it as a TIME value.
      */

      const databaseTime = `${eventTime}:00`;

      /*
        --------------------------------
        UPDATE EVENT
        --------------------------------
      */

      const { error } = await supabase
        .from("events")
        .update({
          title: title.trim(),

          slug:
            slug.trim() || createSlug(title),

          description:
            description.trim() || null,

          location:
            `${city.trim()}, ${country.trim()}`,

          venue:
            venue.trim() || null,

          city:
            city.trim(),

          country:
            country.trim(),

          event_date:
            eventDate,

          event_time:
            databaseTime,

          price:
            Number(price),

          quantity:
            Number(quantity),

          category:
            category || null,

          image_url:
            imageUrl,
        })
        .eq("id", event.id);

      if (error) {
        throw new Error(error.message);
      }

      alert("Event updated successfully! 🎟️");

      router.push("/admin/events");

      router.refresh();

    } catch (error) {
      console.error("Update event error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while updating the event.";

      alert(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >

      {/* TITLE */}

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Event Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);

            if (!event.slug) {
              setSlug(createSlug(e.target.value));
            }
          }}
          required
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
        />
      </div>


      {/* SLUG */}

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Event Slug
        </label>

        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
        />
      </div>


      {/* CATEGORY */}

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="">Select category</option>

          <option value="concerts">🎤 All Concerts</option>
          <option value="pop">🎵 Pop</option>
          <option value="rock">🎸 Rock</option>
          <option value="hip-hop">🎤 Hip-Hop & Rap</option>
          <option value="rnb">🎶 R&B</option>
          <option value="afrobeats">🌍 Afrobeats</option>
          <option value="festivals">🎪 Festivals</option>

          <option value="sports">🏆 All Sports</option>
          <option value="premier-league">⚽ Premier League</option>
          <option value="mls">⚽ MLS</option>
          <option value="champions-league">
            ⚽ Champions League
          </option>
          <option value="la-liga">⚽ La Liga</option>
          <option value="serie-a">⚽ Serie A</option>
          <option value="bundesliga">⚽ Bundesliga</option>
          <option value="f1">🏎️ Formula 1</option>
          <option value="nba">🏀 NBA</option>
          <option value="nfl">🏈 NFL</option>
          <option value="mlb">⚾ MLB</option>
          <option value="tennis">🎾 Tennis</option>
          <option value="boxing">🥊 Boxing</option>
          <option value="ufc">🥋 UFC</option>

          <option value="theatre">🎭 All Theatre</option>
          <option value="broadway">🎟️ Broadway</option>
          <option value="west-end">🎭 West End</option>
          <option value="musicals">🎶 Musicals</option>
          <option value="comedy">😂 Comedy</option>
          <option value="family">
            👨‍👩‍👧 Family Shows
          </option>
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
          rows={5}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white resize-none"
        />
      </div>


      {/* LOCATION */}

      <div className="grid md:grid-cols-3 gap-4">

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Venue
          </label>

          <input
            type="text"
            value={venue}
            onChange={(e) =>
              setVenue(e.target.value)
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            City
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Country
          </label>

          <input
            type="text"
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

      </div>


      {/* DATE / TIME / PRICE */}

      <div className="grid md:grid-cols-3 gap-4">

        {/* DATE */}

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
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>


        {/* TIME */}

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Event Time
          </label>

          <input
  type="text"
  inputMode="numeric"
  placeholder="HH:MM"
  value={eventTime}
  onChange={(e) => {
    const value = e.target.value;

    // Allow only numbers and colon
    if (!/^[0-9:]*$/.test(value)) {
      return;
    }

    // Maximum length: HH:MM
    if (value.length <= 5) {
      setEventTime(value);
    }
  }}
  required
  maxLength={5}
  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
/>

<p className="text-xs text-slate-500 mt-1">
  Enter time in 24-hour format, e.g. 20:00
</p>

          <p className="text-xs text-slate-500 mt-1">
            Select the event start time.
          </p>
        </div>


        {/* PRICE */}

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
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

      </div>


      {/* QUANTITY */}

      <div>
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
          required
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
        />
      </div>


      {/* IMAGE */}

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Replace Event Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files?.[0] || null)
          }
          className="block w-full text-sm text-slate-400"
        />

        {image && (
          <p className="text-sm text-slate-500 mt-2">
            New image: {image.name}
          </p>
        )}
      </div>


      {/* BUTTON */}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition"
      >
        {loading
          ? "Saving Changes..."
          : "Save Changes"}
      </button>

    </form>
  );
}