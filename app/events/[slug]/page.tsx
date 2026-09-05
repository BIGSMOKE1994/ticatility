import Image from "next/image";
import Link from "next/link";
import { getEventBySlug } from "@/lib/events";

function formatEventDate(date: string | null | undefined) {
  if (!date) return "Date TBA";

  const parts = date.split("-");

  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  return date;
}

function formatEventTime(time: string | null | undefined) {
  if (!time) return "Time TBA";

  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Event not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Event Image */}
      <div className="relative h-[450px] w-full">

        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <span className="text-6xl">🎟️</span>
          </div>
        )}

      </div>

      {/* Event Information */}
      <section className="max-w-5xl mx-auto px-6 py-12">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold">
          {event.title}
        </h1>

        {/* Location */}
        <div className="mt-8 space-y-3 text-lg">

          <p className="text-slate-300">
            📍 {event.city}, {event.country}
          </p>

          {/* Venue */}
          {event.venue && (
            <p className="text-slate-300">
              🏟️ {event.venue}
            </p>
          )}

          {/* Date */}
          <p className="text-slate-300">
            📅 {formatEventDate(event.event_date)}
          </p>

          {/* Time */}
          <p className="text-slate-300">
            🕐 {formatEventTime(event.event_time)}
          </p>

        </div>

        {/* Description */}
        {event.description && (
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              About This Event
            </h2>

            <p className="text-lg leading-8 text-slate-300">
              {event.description}
            </p>

          </div>
        )}

        {/* Ticket Information */}
        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-sm text-slate-400">
                Starting price
              </p>

              <p className="text-3xl font-bold text-yellow-400 mt-1">
                ${Number(event.price).toFixed(2)}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-400">
                Tickets available
              </p>

              <p className="text-xl font-bold text-white mt-1">
                {event.quantity}
              </p>

            </div>

          </div>

          {/* Buy Button */}
          <Link
            href={`/checkout/${event.slug}`}
            className="block mt-8 w-full text-center bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold text-lg transition"
          >
            🎟️ Buy Tickets
          </Link>

        </div>

      </section>

    </main>
  );
}