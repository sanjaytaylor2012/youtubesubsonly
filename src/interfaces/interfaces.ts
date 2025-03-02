export interface Video {
  videoId: string | null | undefined;
  title: string | null | undefined;
  url: string;
  publishedAt?: string | null | undefined;
  description: string | null | undefined;
}

export interface Channel {
  videos?: Video[];
  title: string;
  channelId: string;
  thumbnail: string | null | undefined;
}
