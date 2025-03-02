import { Video } from "@/interfaces/interfaces";
import { useState } from "react";

export default function VideoIcon({
  selectedVideo,
  handleVideoClick,
  video,
}: {
  selectedVideo: string | null;
  handleVideoClick: (input: string) => void;
  video: Video;
}) {
  return (
    <div
      onClick={() => {
        if (video.videoId) handleVideoClick(video.videoId);
      }}
    >
      {selectedVideo === video.videoId ? (
        <iframe
          id={`iframe-${video.videoId}`}
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
          className="w-full aspect-video"
          allow="autoplay; fullscreen"
        ></iframe>
      ) : (
        <div className="flex flex-col">
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.url}
            className="w-full rounded-lg transition hover:opacity-75"
          />
          <div>{video.title}</div>
          <div>{video.publishedAt}</div>
        </div>
      )}
    </div>
  );
}
