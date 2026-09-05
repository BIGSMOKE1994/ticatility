import { getEventById } from "@/lib/events";
import EditEventForm from "@/components/EditEventForm";
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEventPage({
  params,
}: PageProps) {
  const { id } = await params;

  const event = await getEventById(id);

  return (
    <main className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">
        Edit Event
      </h1>

      <EditEventForm event={event} />
    </main>
  );
}
            