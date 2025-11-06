import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Speaker, Talk, TalkWithSpeaker } from "@/lib/types";
import { getAllSpeakers, getAllTalks } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {

  const talks: Talk[] = await getAllTalks();
  const speakers: Speaker[] = await getAllSpeakers();

  const wednesdayTalks: TalkWithSpeaker[] = [];
  const thursdayTalks: TalkWithSpeaker[] = [];
  
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
  })

  wednesdayTalks.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  thursdayTalks.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  
  return (
    <div className="font-sans flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Tabs defaultValue="wednesday" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
          <TabsTrigger value="thursday">Thursday</TabsTrigger>
        </TabsList>
        <TabsContent value="wednesday">
          {wednesdayTalks.map(talk => (
            <div key={talk.id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">{talk.title}</h2>
              <p className="text-gray-700 mb-2">{talk.abstract}</p>
              {talk.speaker && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold">{talk.speaker.name}</h3>
                  <p className="text-gray-600">{talk.speaker.company}</p>
                  <p className="text-gray-500 mt-2">{talk.speaker.bio}</p>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {new Date(talk.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'
  })} - {new Date(talk.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="thursday">
          {thursdayTalks.map(talk => (
            <div key={talk.id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">{talk.title}</h2>
              <p className="text-gray-700 mb-2">{talk.abstract}</p>
              {talk.speaker && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold">{talk.speaker.name}</h3>
                  <p className="text-gray-600">{talk.speaker.company}</p>
                  <p className="text-gray-500 mt-2">{talk.speaker.bio}</p>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {new Date(talk.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'
})} - {new Date(talk.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
