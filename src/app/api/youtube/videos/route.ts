import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId");

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!channelId) return NextResponse.json({ error: "Missing channelId" }, { status: 400 });

  const youtube = google.youtube({
    version: "v3",
    auth: session.accessToken,
  });

  const today = new Date().toISOString().split("T")[0] + "T00:00:00Z";

  try {
    const response = await youtube.search.list({
      part: "snippet",
      channelId,
      publishedAfter: today,
      order: "date",
      type: "video",
      maxResults: 5,
    });

    const videos = response.data.items?.map((item) => ({
      title: item.snippet?.title ?? "Untitled",
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    })) || [];

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
