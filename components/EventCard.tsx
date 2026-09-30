import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  title: string;
  location: string;
  venue: string;
  price: number | string;
  date: string;
  time: string;
  image: string;
  slug: string;
};

function formatDate(dateString: string) {
  if (!dateString) return "Date TBA";

  const parts = dateString.split("-");

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

    if (
      !isNaN(year) &&
      !isNaN(month) &&
      !isNaN(day) &&
      month >= 1 &&
      month <= 12
    ) {
      return `${months[month - 1]} ${day}, ${year}`;
    }
  }

  return dateString;
}

function formatPrice(price: number | string) {
  if (price === null || price === undefined || price === "") {
    return "Price TBA";
  }

  const cleanedPrice = String(price).replace(/[$,]/g, "").trim();
  const numericPrice = Number(cleanedPrice);

  if (isNaN(numericPrice)) {
    return "Price TBA";
  }

  return `$${numericPrice.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatTime(time: string) {
  if (!time) return "Time TBA";

  const parts = time.split(":");

  if (parts.length >= 2) {
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    if (!isNaN(hour) && !isNaN(minute)) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
    }
  }

  return time;
}

export default function EventCard({
  title,
  location,
  venue,
  price,
  date,
  time,
  image,
  slug,
}: EventCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-800 shadow-lg">
      {/* Event Image */}
      <div className="relative h-56 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Event Information */}
      <div className="p-6">
        <h3 className="mb-3 text-2xl font-bold text-white">
          {title}
        </h3>

        <div className="space-y-2 text-gray-200">
          {/* Location */}
          <p>
            📍 {location}
          </p>

          {/* Venue */}
          <p>
            🏟️ {venue || "Venue TBA"}
          </p>

          {/* Date */}
          <p>
            📅 {formatDate(date)}
          </p>

          {/* Time */}
          <p>
            🕐 {formatTime(time)}
          </p>
        </div>

        {/* Price */}
        <div className="mt-5">
          <p className="text-sm text-gray-300">From</p>

          <p className="text-xl font-bold text-yellow-400">
            {formatPrice(price)}
          </p>
        </div>

        {/* View Tickets */}
        <Link
          href={`/events/${slug}`}
          className="mt-5 block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-bold text-white transition hover:bg-blue-700"
        >
          View Tickets
        </Link>
      </div>
    </div>
  );
}