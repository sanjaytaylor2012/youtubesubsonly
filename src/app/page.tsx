"use client";

import { Button } from "@/components/ui/button";
import { SignIn } from "@/components/SignIn/SignIn";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Videos } from "@/components/Videos/Videos";
import { Channel, Video } from "@/interfaces/interfaces";
import dummy_data from "@/components/dummy_data.json";
import { Loading } from "@/components/Loading/Loading";

export default function Home() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<Channel[]>([]);
  const [numDays, setNumDays] = useState(7);

  const fetchVideos = async (numDays: number) => {
    const storedData = localStorage.getItem("channelData");
    const storedTimestamp = localStorage.getItem("lastFetchTime");
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    //check cache before making api call
    if (
      storedData &&
      storedTimestamp &&
      now - parseInt(storedTimestamp) < threeHours
    ) {
      console.log("Using cached data from local storage");
      setVideos(JSON.parse(storedData));
      return;
    }

    //if not cached then make api call
    const res = await fetch(`/api/youtube/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numDays }),
    });
    const data = await res.json();
    setVideos(data);

    // const data = dummy_data;
    // setVideos(data);

    console.log("caching data in local storage");
    localStorage.setItem("channelData", JSON.stringify(data));
    localStorage.setItem("lastFetchTime", now.toString());
    // console.log(data);
  };

  useEffect(() => {
    fetchVideos(numDays);
  }, []);

  return (
    <div className="flex w-full h-full p-4">
      {status == "loading" && <Loading />}
      {status != "loading" && session && <Videos channels={videos} />}
      {status != "loading" && !session && <SignIn />}
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
