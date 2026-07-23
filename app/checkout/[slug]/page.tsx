import { events } from "../../data/events";
import CheckoutCard from "../../components/CheckoutCard";

export default async function CheckoutPage({
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
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-extrabold mb-8">
          🎟 Checkout
        </h1>

        <CheckoutCard
  title={event.title}
  location={event.location}
  date={event.date}
  price={Number(event.price.replace("$", ""))}
  slug={event.slug}
/>
      </div>
    </main>
  );
}