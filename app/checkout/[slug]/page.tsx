import { getEventBySlug } from "@/lib/events";
import CheckoutCard from "@/components/CheckoutCard";

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

export default async function CheckoutPage({
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
      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* CHECKOUT TITLE */}
        <h1 className="text-5xl font-extrabold mb-8">
          🎟 Checkout
        </h1>

        {/* ACCOMMODATION ASSISTANCE */}
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/70 to-slate-900 p-6 shadow-lg">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 text-sm font-semibold text-yellow-400 mb-3">
                🏨 Travel Assistance
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Need Accommodation for This Event?
              </h2>

              <p className="text-slate-300 leading-relaxed">
                Traveling from out of town for{" "}
                <span className="font-semibold text-white">
                  {event.title}
                </span>
                ? Ticatility can help you find suitable hotels
                and short-stay accommodation close to the event venue.
              </p>

              <p className="mt-3 text-sm text-slate-400">
                Contact our support team and tell us which event
                you're attending. We'll help you find options based
                on your location, dates, and preferences.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300"
              >
                Contact Support
              </a>

              <p className="text-center text-xs text-slate-400 mt-2">
                We're here to help
              </p>
            </div>

          </div>
        </div>

        {/* TICKET CHECKOUT */}
        <CheckoutCard
          title={event.title}
          location={`${event.city}, ${event.country}`}
          date={formatEventDate(event.event_date)}
          price={Number(event.price)}
          slug={event.slug}
        />

      </div>
    </main>
  );
}