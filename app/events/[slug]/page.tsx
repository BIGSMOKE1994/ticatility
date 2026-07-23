import Image from "next/image";
import Link from "next/link";
import { events } from "../../data/events";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = events.find((event) => event.slug === slug);

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">Event not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-[450px] w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-extrabold">
          {event.title}
        </h1>

        <p className="mt-6 text-slate-300 text-xl">
          📍 {event.location}
        </p>

        <p className="mt-2 text-slate-400">
          📅 {event.date}
        </p>

        <p className="mt-8 text-lg leading-8 text-slate-300">
          {event.description}
        </p>

        <p className="mt-10 text-3xl font-bold text-yellow-400">
          From {event.price}
        </p>

        <Link
  href={`/checkout/${event.slug}`}
  className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold text-lg"
>
  Buy Tickets
</Link>
      </section>
    </main>
  );
}