import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    //get auth token from next auth
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //need num days to get the right amount of videos
    const { numDays } = await req.json();
    if (!numDays || typeof numDays !== "number") {
      return NextResponse.json(
        { error: "Invalid numDays value" },
        { status: 400 }
      );
    }

    //use auth token to set creds for google oauth2 token
    const oauth2Client = new google.auth.OAuth2();
    if (!oauth2Client) {
      return NextResponse.json({ error: "oauth client" }, { status: 400 });
    }
    oauth2Client.setCredentials({ access_token: session.accessToken });

    //use oauth client to get subscriptions
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.subscriptions.list({
      part: ["snippet"], // ✅ Ensure it's an array
      mine: true,
      maxResults: 50,
    });
    if (!response.data.items) {
      return NextResponse.json([]);
    }

    const channels: Channel[] = response.data.items.map((item) => ({
      channelId: item.snippet?.resourceId?.channelId ?? "",
      title: item.snippet?.title ?? "Unknown",
    }));

    const videosFromNumDays = new Date();
    videosFromNumDays.setDate(videosFromNumDays.getDate() - numDays);
    const publishedAfter = videosFromNumDays.toISOString();

    let channelData: Channel[] = [];

    for (const channel of channels) {
      const channelId = channel.channelId;

      const videosResponse = await youtube.search.list({
        part: ["snippet"],
        channelId,
        publishedAfter,
        order: "date",
        maxResults: 5,
      });

      const videos =
        videosResponse.data.items?.map((video) => ({
          videoId: video.id?.videoId,
          title: video.snippet?.title,
          url: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
          publishedAt: video.snippet?.publishedAt,
        })) || [];

      channelData.push({
        channelId: channel.channelId,
        title: channel.title,
        videos: videos,
      });
    }

    return NextResponse.json(channels);
  } catch (error) {
    console.error("❌ Error fetching YouTube subscriptions:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
