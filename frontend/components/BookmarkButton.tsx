"use client";

import { useState } from "react";
import { toggleBookmark } from "@/lib/actions";
import { Button } from "./ui/button";
import { LoaderIcon, StarIcon } from "lucide-react";

type Props = {
  talkId: number;
  initialBookmarked: boolean;
};

export default function BookmarkButton({ talkId, initialBookmarked }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const newStatus = await toggleBookmark(talkId, bookmarked);
      setBookmarked(newStatus);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="hover:cursor-pointer"
      onClick={toggle}
      disabled={loading}
      variant={"outline"}
    >
      {loading
        ? <LoaderIcon className="min-w-6 min-h-6 stroke-1 animate-spin" />
        : bookmarked
        ? <StarIcon className="fill-amber-400 min-w-6 min-h-6 text-amber-400"/>
        : <StarIcon className="fill-transparent stroke-1 min-h-6 min-w-6"/>}
    </Button>
  );
}