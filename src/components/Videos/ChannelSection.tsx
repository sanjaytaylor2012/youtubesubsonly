import { Channel } from "@/interfaces/interfaces";
import VideoIcon from "./VideoIcon";

export const ChannelSection = ({
  channel,
  handleVideoClick,
  selectedVideo,
}: {
  channel: Channel;
  handleVideoClick: (input: string) => void;
  selectedVideo: string | null;
}) => {
  return (
    <div className="w-full flex flex-col bg-neutral-800 w-full rounded-lg p-4">
      <div className="text-lg font-semibold underline">{channel.title}</div>
      <div className="flex flex-col gap-2 md:flex-row md:overflow-x-auto md:whitespace-nowrap">
        {channel.videos?.map((video) => {
          return (
            <VideoIcon
              key={video.videoId}
              handleVideoClick={handleVideoClick}
              selectedVideo={selectedVideo}
              video={video}
            />
          );
        })}
      </div>
    </div>
  );
};
