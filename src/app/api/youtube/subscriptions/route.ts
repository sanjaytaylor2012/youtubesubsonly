import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { Channel, Video } from "@/interfaces/interfaces";

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
      maxResults: 5,
    });
    if (!response.data.items) {
      return NextResponse.json([]);
    }

    //create initial channel list
    const channels: Channel[] = response.data.items.map((item) => ({
      channelId: item.snippet?.resourceId?.channelId ?? "",
      title: item.snippet?.title ?? "Unknown",
      thumbnail: item.snippet?.thumbnails?.medium?.url,
    }));

    //calculate what days to get videos from
    const videosFromNumDays = new Date();
    videosFromNumDays.setDate(videosFromNumDays.getDate() - numDays);
    const publishedAfter = videosFromNumDays.toISOString();

    let channelData: Channel[] = [];

    for (const channel of channels) {
      const channelId = channel.channelId;

      //get videos from channel
      const videosResponse = await youtube.search.list({
        part: ["snippet"],
        channelId,
        publishedAfter,
        order: "date",
        maxResults: 2,
      });

      //maps the response to a list of videos
      const videos: Video[] =
        videosResponse.data.items?.map((video) => ({
          videoId: video.id?.videoId,
          title: video.snippet?.title,
          url: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
          publishedAt: video.snippet?.publishedAt,
          thumbnail: video.snippet?.thumbnails?.medium?.url,
          description: video.snippet?.description,
        })) || [];

      //add the channel with videos to channel list
      if (videos && videos.length > 0) {
        channelData.push({
          channelId: channel.channelId,
          title: channel.title,
          videos: videos,
          thumbnail: channel.thumbnail,
        });
      }
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
