"use server";

import { revalidatePath } from "next/cache";

/**
 * Toggles the bookmark status of a talk by sending a POST request to the Talk API.
 * This function runs on the server (React Server Action) and can be called from
 * client components.
 *
 * @param talkId - The ID of the talk to toggle.
 * @param currentStatus - The current bookmark status (true if bookmarked).
 * @returns The new bookmark status after the toggle.
 */
export async function toggleBookmark(talkId: number, currentStatus: boolean): Promise<boolean> {
  // Perform the POST request on the server side
  const res = await fetch(`${process.env.NEXT_TALK_API_HOST}/api/talk/${talkId}`, {
    method: "POST",
  });

  // Optionally revalidate the page that shows the talk details
  // This ensures the UI reflects the latest state if the page is server‑rendered.
  revalidatePath(`/talk/${talkId}`);

  // If the request succeeded, flip the status; otherwise keep the old one.
  return res.ok ? !currentStatus : currentStatus;
}