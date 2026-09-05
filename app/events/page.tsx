import Link from "next/link";
import Image from "next/image";
import { getPublishedEvents } from "@/lib/events";

type EventsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

// Convert category names into URL-friendly values
function normalizeCategory(value: string | null | undefined) {
  if (!value) return "";

  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Format event dates nicely
function formatEventDate(date: string | null | undefined) {
  if (!date) return "Date TBA";

  const parts = date.split("-");

  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${months[month - 1]} ${day}, ${year}`;
  }

  return date;
}

// Format event time
function formatEventTime(time: string | null | undefined) {
  if (!time) return "";

  try {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return time;
  }
}

export default async function EventsPage({
  searchParams,
}: EventsPageProps) {
  const params = await searchParams;

  const category =
    normalizeCategory(params.category) || "all";

  const events = await getPublishedEvents();

  // Filter events
  const filteredEvents =
    category === "all"
      ? events
      : events.filter(
          (event) =>
            normalizeCategory(event.category) === category
        );

  const categoryNames: Record<string, string> = {
    concerts: "All Concerts",
    pop: "Pop Concerts",
    rock: "Rock Concerts",
    "hip-hop": "Hip-Hop & Rap",
    rnb: "R&B",
    afrobeats: "Afrobeats",
    festivals: "Music Festivals",

    sports: "All Sports",
    "premier-league": "Premier League",
    mls: "MLS",
    "champions-league": "Champions League",
    "la-liga": "La Liga",
    "serie-a": "Serie A",
    bundesliga: "Bundesliga",
    f1: "Formula 1",
    nba: "NBA",
    nfl: "NFL",
    mlb: "MLB",
    tennis: "Tennis",
    boxing: "Boxing",
    ufc: "UFC",

    theatre: "All Theatre",
    broadway: "Broadway",
    "west-end": "West End",
    musicals: "Musicals",
    comedy: "Comedy",
    family: "Family Shows",
  };

  const heading =
    categoryNames[category] || "Live Events";

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">

          <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm">
            Ticatility Events
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            {heading}
          </h1>

          <p className="text-slate-400 mt-3">
            Discover verified tickets for the world's biggest live events.
          </p>

        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-3 mb-10">

          <Link
            href="/events"
            className={`px-4 py-2 rounded-lg border transition ${
              category === "all"
                ? "bg-blue-600 border-blue-600"
                : "border-slate-700 hover:border-blue-500"
            }`}
          >
            All Events
          </Link>

          <Link
            href="/events?category=concerts"
            className={`px-4 py-2 rounded-lg border transition ${
              category === "concerts"
                ? "bg-blue-600 border-blue-600"
                : "border-slate-700 hover:border-blue-500"
            }`}
          >
            🎤 Concerts
          </Link>

          <Link
            href="/events?category=sports"
            className={`px-4 py-2 rounded-lg border transition ${
              category === "sports"
                ? "bg-blue-600 border-blue-600"
                : "border-slate-700 hover:border-blue-500"
            }`}
          >
            🏆 Sports
          </Link>

          <Link
            href="/events?category=theatre"
            className={`px-4 py-2 rounded-lg border transition ${
              category === "theatre"
                ? "bg-blue-600 border-blue-600"
                : "border-slate-700 hover:border-blue-500"
            }`}
          >
            🎭 Theatre
          </Link>

        </div>

        {/* Events */}
        {filteredEvents.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-4">
              🎟️
            </div>

            <h2 className="text-2xl font-semibold">
              No events found
            </h2>

            <p className="text-slate-400 mt-2">
              There are currently no events available in this category.
            </p>

            <Link
              href="/events"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              View All Events
            </Link>

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredEvents.map((event) => (

              <div
                key={event.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500 transition"
              >

                {/* Event Image */}
                <div className="relative h-56 w-full">

                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <span className="text-5xl">
                        🎟️
                      </span>
                    </div>
                  )}

                </div>

                {/* Event Information */}
                <div className="p-5">

                  <h2 className="text-xl font-bold">
                    {event.title}
                  </h2>

                  {/* Location */}
                  <p className="text-slate-400 mt-2">
                    📍 {event.city}, {event.country}
                  </p>

                  {/* Date */}
                  <p className="text-slate-300 mt-2">
                    📅 {formatEventDate(event.event_date)}
                  </p>

                  {/* Time */}
                  {event.event_time && (
                    <p className="text-slate-400 mt-1">
                      🕐 {formatEventTime(event.event_time)}
                    </p>
                  )}

                  {/* Venue */}
                  {event.venue && (
                    <p className="text-slate-400 mt-1">
                      🏟️ {event.venue}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-5">

                    <div>
                      <p className="text-xs text-slate-500">
                        From
                      </p>

                      <p className="text-xl font-bold text-blue-400">
                        ${Number(event.price).toFixed(2)}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event.slug}`}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
                    >
                      View Event
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}