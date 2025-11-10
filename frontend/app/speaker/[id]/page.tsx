import { notFound } from "next/navigation";
import { Speaker, Talk } from "@/lib/types";
import { getSpeakerById, getAllTalks } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SpeakerPage({
  params,
}: {
  params: { id: string };
}) {
  const speakerId = Number(params.id);
  if (Number.isNaN(speakerId)) notFound();

  const speaker: Speaker | null = await getSpeakerById(speakerId);
  if (!speaker) notFound();

  // Load all talks to find those belonging to this speaker
  const talks: Talk[] = await getAllTalks();
  const speakerTalks = talks.filter((t) => t.speaker_id === speaker.id);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between w-full mb-6">
        <Button>
          <Link href="/">← Back to Schedule</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">{speaker.name}</h1>
      <p className="text-gray-600 mb-2">{speaker.company}</p>
      <p className="text-gray-700 mb-6">{speaker.bio}</p>

      <h2 className="text-2xl font-semibold mb-3">Talks</h2>
      {speakerTalks.length === 0 ? (
        <p className="text-gray-500">No talks assigned.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {speakerTalks.map((talk) => (
            <li key={talk.id}>
              <a
                href={`/talk/${talk.id}`}
                className="text-blue-600 hover:underline"
              >
                {talk.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}