import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Speaker, Talk } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getAllTalks(): Promise<Talk[]> {
  console.log(`Fetching talks from API at ${process.env.NEXT_TALK_API_HOST}`);
  try {
    const res = await fetch(`${process.env.NEXT_TALK_API_HOST}/api/talks`);
    if (!res.ok) {
      console.error("Failed to fetch talks:", res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching talks:", error);
    return [];
  }
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  console.log(`Fetching speakers from API at ${process.env.NEXT_SPEAKER_API_HOST}`);
  try {
    const res = await fetch(`${process.env.NEXT_SPEAKER_API_HOST}/api/speakers`);
    if (!res.ok) {
      console.error("Failed to fetch speakers:", res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return [];
  }
}
