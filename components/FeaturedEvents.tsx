import EventCard from "./EventCard";
import { getPublishedEvents } from "@/lib/events";

export default async function FeaturedEvents() {
  const events = await getPublishedEvents();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-10">
        🔥 Featured Events
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard
  key={event.id}
  title={event.title}
  location={event.location}
  venue={event.venue}
  date={event.event_date}
time={event.event_time}
  price={`$${event.price}`}
  image={event.image_url}
  slug={event.slug}
/>
        ))}
      </div>
    </section>
  );
}