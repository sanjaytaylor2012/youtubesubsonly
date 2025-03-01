interface Video {
  videoId: string | null | undefined;
  title: string | null | undefined;
  url: string;
  publishedAt?: string | null | undefined;
}

interface Channel {
  videos?: Video[];
  title: string;
  channelId: string;
}
