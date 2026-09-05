import Link from "next/link";
import { getEvents } from "@/lib/events";
import DeleteEventButton from "@/components/DeleteEventButton";
import TogglePublishButton from "@/components/TogglePublishButton";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Event Manager
        </h1>

        <Link
          href="/admin/events/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + New Event
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Location</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t"
              >
                <td className="p-4 font-semibold">
                  {event.title}
                </td>

                <td className="p-4">
                  {event.location}
                </td>

                <td className="p-4">
                  {event.event_date}
                </td>

                <td className="p-4">
                  ${event.price}
                </td>

                <td className="p-4">
                  {event.published ? (
                    <span className="text-green-600 font-semibold">
                      🟢 Published
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      🔴 Hidden
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </Link>

                    <DeleteEventButton id={event.id} />

                    <TogglePublishButton
                      id={event.id}
                      published={event.published}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}