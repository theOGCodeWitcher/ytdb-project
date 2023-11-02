import axios, { AxiosResponse } from "axios";
import { ChannelItem } from "../types/type";

export async function fetchChannelById(
  ChannelId: string
): Promise<ChannelItem> {
  try {
    const response: AxiosResponse<ChannelItem> = await axios.get(
      `${
        import.meta.env.VITE_APP_CHANNEL_ENDPOINT
      }getChannelById?channelId=${ChannelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
