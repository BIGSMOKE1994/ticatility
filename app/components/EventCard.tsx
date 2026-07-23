
import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  title: string;
  location: string;
  price: string;
  date: string;
  image: string;
  slug: string;
};

export default function EventCard({
  title,
  location,
  price,
  date,
  image,
  slug,
}: EventCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">
      <div className="relative h-56">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold">{title}</h3>

        <p className="text-slate-400 mt-2">
          📍 {location}
        </p>

        <p className="text-slate-500 mt-1">
          📅 {date}
        </p>

        <p className="text-yellow-400 font-bold mt-4">
          From {price}
        </p>

        <Link
  href={`/events/${slug}`}
  className="mt-6 block text-center bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
>
  View Tickets
</Link>
      </div>
    </div>
  );
}