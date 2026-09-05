"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  const [loading, setLoading] = useState(false);

  async function publishEvent() {
    if (!image) {
      alert("Please choose an event image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Image upload failed.");
      }

      const imageUrl = uploadResult.imageUrl;

      const newEvent = {
        title,
        slug,
        description,
        venue,
        city,
        country,
        location: `${city}, ${country}`,
        event_date: eventDate,
        event_time: eventTime,
        price: Number(price),
        quantity: Number(quantity),
        category,
        image_url: imageUrl,
        published: true,
      };

      const response = await fetch("/api/admin/events", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newEvent),
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error || "Failed to create event.");
}

alert("🎉 Event published successfully!");

router.push("/admin/events");
router.refresh();
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto py-12 px-6">

        <h1 className="text-4xl font-bold mb-8">
          ➕ Add New Event
        </h1>

        <div className="space-y-5">
          <input
            className="w-full p-3 rounded-lg bg-slate-900"
            placeholder="Event Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);

              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
            }}
          />

          <input
            className="w-full p-3 rounded-lg bg-slate-900"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <textarea
            rows={5}
            className="w-full p-3 rounded-lg bg-slate-900"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-slate-900"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="p-3 rounded-lg bg-slate-900"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              className="p-3 rounded-lg bg-slate-900"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="date"
              className="p-3 rounded-lg bg-slate-900"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <input
              type="time"
              className="p-3 rounded-lg bg-slate-900"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />

          </div>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="number"
              className="p-3 rounded-lg bg-slate-900"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              className="p-3 rounded-lg bg-slate-900"
              placeholder="Tickets Available"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              className="p-3 rounded-lg bg-slate-900"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

          </div>
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 rounded-lg bg-slate-900"
            onChange={(e) => {
              if (e.target.files?.length) {
                setImage(e.target.files[0]);
              }
            }}
          />

          {image && (
            <div className="rounded-xl border border-slate-700 p-4">
              <p className="text-green-400 font-semibold">
                ✓ Selected Image
              </p>

              <p className="text-sm text-slate-300 mt-2">
                {image.name}
              </p>

              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-4 rounded-lg max-h-72 object-cover"
              />
            </div>
          )}

          <button
            onClick={publishEvent}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-4 rounded-xl font-bold text-lg"
          >
            {loading ? "Publishing..." : "🚀 Publish Event"}
          </button>

        </div>

      </div>

    </main>
    );
}
        