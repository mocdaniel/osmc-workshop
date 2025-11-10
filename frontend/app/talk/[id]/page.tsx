import { notFound } from "next/navigation";
import { Talk, Speaker } from "@/lib/types";
import { getTalkById, getSpeakerById } from "@/lib/utils";
import BookmarkButton from "@/components/BookmarkButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function TalkPage({
  params,
}: {
  params: { id: string };
}) {
  const talkId = Number(params.id);
  if (Number.isNaN(talkId)) notFound();

  const talk: Talk | null = await getTalkById(talkId);
  if (!talk) notFound();

  const speaker: Speaker | null = await getSpeakerById(talk.speaker_id);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between w-full mb-6">
        <Button>
          <Link href="/">← Back to Schedule</Link>
        </Button>
        <BookmarkButton talkId={talk.id} initialBookmarked={talk.is_bookmarked} />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">{talk.title}</h1>
      <p className="text-gray-700 mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{__html: talk.abstract.replaceAll("\\n", "<br/>")}}/>

      <div className="text-sm text-gray-600 mb-4">
        {new Date(talk.start_time).toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}{" "}
        –{" "}
        {new Date(talk.end_time).toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {speaker && (
        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-semibold">Speaker</h2>
          <p className="font-medium hover:underline">
            <Link href={`/speaker/${speaker.id}`}>{speaker.name}</Link></p>
          <p className="text-gray-600">{speaker.company}</p>
        </div>
      )}
    </div>
  );
}