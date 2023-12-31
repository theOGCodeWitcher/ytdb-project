import axios, { AxiosResponse } from "axios";
import { VideoItemResponse } from "../types/type";

export async function fetchRecentVideos(
  ChannelId: string
): Promise<VideoItemResponse> {
  try {
    const response: AxiosResponse<VideoItemResponse> = await axios.get(
      `${
        import.meta.env.VITE_APP_CHANNEL_ENDPOINT
      }getRecentVideosByChannelId?channelId=${ChannelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchPopularVideos(
  ChannelId: string
): Promise<VideoItemResponse> {
  try {
    const response: AxiosResponse<VideoItemResponse> = await axios.get(
      `${
        import.meta.env.VITE_APP_CHANNEL_ENDPOINT
      }getPopularVideosByChannelId?channelId=${ChannelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
