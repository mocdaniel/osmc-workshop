import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Speaker, Talk, TalkWithSpeaker } from "@/lib/types";
import { getAllSpeakers, getAllTalks } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {

  const talks: Talk[] = await getAllTalks();
  const speakers: Speaker[] = await getAllSpeakers();

  const wednesdayTalks: TalkWithSpeaker[] = [];
  const thursdayTalks: TalkWithSpeaker[] = [];
  const bookmarkedTalks: TalkWithSpeaker[] = [];
  
  const talksWithSpeakers: TalkWithSpeaker[] = talks.map(talk => {
    const speaker = speakers.find(s => s.id === talk.speaker_id);
    return {
      ...talk,
      speaker: speaker ? speaker : null,
    };
  });

  talksWithSpeakers.forEach(talk => {
    const talkDate = new Date(talk.start_time);
    if (talkDate.getDay() === 3) {
      wednesdayTalks.push(talk);
    } else if (talkDate.getDay() === 4) {
      thursdayTalks.push(talk);
    }

    if(talk.is_bookmarked) {
      bookmarkedTalks.push(talk);
    }
  })

  wednesdayTalks.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  thursdayTalks.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  bookmarkedTalks.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  
  return (
    <div className="w-full h-full">
      <Tabs defaultValue="wednesday" className="w-[800px] mx-auto">
        <TabsList className="mx-auto mb-4">
          <TabsTrigger className="text-xl" value="wednesday">Wednesday</TabsTrigger>
          <TabsTrigger className="text-xl" value="thursday">Thursday</TabsTrigger>
          <TabsTrigger className="text-xl" value="bookmarks">Bookmarked</TabsTrigger>
        </TabsList>
        <TabsContent value="wednesday">
          {wednesdayTalks.map(talk => (
            <div key={talk.id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-2 hover:underline">
                <Link href={`/talk/${talk.id}`}>{talk.title}</Link></h2>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(talk.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'
  })} - {new Date(talk.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {talk.speaker && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold hover:underline">
                    <Link href={`/speaker/${talk.speaker.id}`}>{talk.speaker.name}</Link></h3>
                  <p className="text-gray-600">{talk.speaker.company}</p>
                </div>
              )}
              
            </div>
          ))}
        </TabsContent>
        <TabsContent value="thursday">
          {thursdayTalks.map(talk => (
            <div key={talk.id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-2 hover:underline">
                <Link href={`/talk/${talk.id}`}>{talk.title}</Link></h2>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(talk.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'
  })} - {new Date(talk.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {talk.speaker && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold hover:underline">
                    <Link href={`/speaker/${talk.speaker.id}`}>{talk.speaker.name}</Link></h3>
                  <p className="text-gray-600">{talk.speaker.company}</p>
                </div>
              )}
              
            </div>
          ))}
        </TabsContent>
        <TabsContent value="bookmarks">
          {bookmarkedTalks.map(talk => (
            <div key={talk.id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-2 hover:underline">
                <Link href={`/talk/${talk.id}`}>{talk.title}</Link></h2>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(talk.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'
  })} - {new Date(talk.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {talk.speaker && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold hover:underline">
                    <Link href={`/speaker/${talk.speaker.id}`}>{talk.speaker.name}</Link></h3>
                  <p className="text-gray-600">{talk.speaker.company}</p>
                </div>
              )}
              
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
