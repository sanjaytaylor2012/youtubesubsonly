"use client";

import { Channel, Video } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { ChannelSection } from "./ChannelSection";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

interface VideosProps {
  channels: Channel[];
}
export const Videos = ({ channels }: VideosProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
    setTimeout(() => {
      const iframe = document.getElementById(
        `iframe-${videoId}`
      ) as HTMLIFrameElement;
      if (iframe && iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }, 500); // Delay to ensure iframe is rendered before requesting fullscreen
  };

  useEffect(() => {
    const exitFullscreenHandler = () => {
      if (!document.fullscreenElement) {
        setSelectedVideo(null);
      }
    };

    document.addEventListener("fullscreenchange", exitFullscreenHandler);
    console.log("selected Video: ", selectedVideo);

    return () => {
      document.removeEventListener("fullscreenchange", exitFullscreenHandler);
    };
  }, [selectedVideo]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full items-center mb-4 justify-between">
        <div className="text-4xl font-extrabold">Your Videos</div>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
      <div className="flex flex-col w-full h-full gap-4">
        {channels.map((channel: Channel) => {
          return (
            <ChannelSection
              key={channel.channelId}
              selectedVideo={selectedVideo}
              handleVideoClick={handleVideoClick}
              channel={channel}
            />
          );
        })}
      </div>
    </div>
  );
};

{
  /* <div
  key={video.videoId}
  className="relative cursor-pointer"
  onClick={() => handleVideoClick(video.videoId)}
></div>; */
}
