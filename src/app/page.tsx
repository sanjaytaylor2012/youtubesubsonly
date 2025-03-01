"use client";

import { Button } from "@/components/ui/button";
import { SignIn } from "@/components/SignIn/SignIn";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Videos } from "@/components/Videos/Videos";

export default function Home() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [numDays, setNumDays] = useState(7);

  const fetchVideos = async (numDays: number) => {
    const res = await fetch(`/api/youtube/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numDays }),
    });

    const data = await res.json();

    setVideos(data);
    console.log(videos);
  };

  useEffect(() => {
    fetchVideos(numDays);
  }, []);

  return (
    <div className="flex w-full h-full p-4">
      {session && <Videos />}
      {!session && <SignIn />}
    </div>
  );
}

{
  /* <div className="p-4">
<h1 className="text-2xl font-bold">YouTube Subscription Videos</h1>

{session ? (
  <>
    <button
      className="bg-red-500 text-white p-2 rounded"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
    <button
      className="bg-blue-500 text-white p-2 rounded ml-4"
      onClick={fetchSubscriptions}
    >
      Fetch Subscriptions
    </button>

    <h2 className="text-xl mt-4">Subscribed Channels</h2>
    <ul>
      {subscriptions.map((sub) => (
        <li key={sub.channelId} className="mt-2">
          {sub.title}{" "}
          <button
            className="bg-green-500 text-white p-1 rounded ml-2"
            onClick={() => fetchVideos(sub.channelId)}
          >
            Get Videos
          </button>
          {videos[sub.channelId] && (
            <ul className="ml-4 mt-2">
              {videos[sub.channelId].map((video) => (
                <li key={video.url}>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </>
) : (
  <button
    className="bg-blue-500 text-white p-2 rounded"
    onClick={() => signIn("google")}
  >
    Sign in with Google
  </button>
)}
</div> */
}
