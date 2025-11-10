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

// Fetch a single talk by its ID
export async function getTalkById(id: number): Promise<Talk | null> {
  try {
    const res = await fetch(`${process.env.NEXT_TALK_API_HOST}/api/talk/${id}`);
    if (!res.ok) {
      console.error(`Failed to fetch talk ${id}:`, res.statusText);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching talk ${id}:`, error);
    return null;
  }
}

// Fetch a single speaker by its ID
export async function getSpeakerById(id: number): Promise<Speaker | null> {
  try {
    const res = await fetch(`${process.env.NEXT_SPEAKER_API_HOST}/api/speaker/${id}`);
    if (!res.ok) {
      console.error(`Failed to fetch speaker ${id}:`, res.statusText);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching speaker ${id}:`, error);
    return null;
  }
}

// Toggle bookmark status for a talk (POST request)
export async function toggleTalkBookmark(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_TALK_API_HOST}/api/talk/${id}`, {
      method: "POST",
    });
    return res.ok;
  } catch (error) {
    console.error(`Error toggling bookmark for talk ${id}:`, error);
    return false;
  }
}
