import axios, { AxiosResponse } from "axios";
import { ChannelCollectionResponse } from "../types/type";

export async function fetchTrending(): Promise<ChannelCollectionResponse> {
  try {
    const response: AxiosResponse<ChannelCollectionResponse> = await axios.get(
      `${import.meta.env.VITE_APP_CHANNEL_ENDPOINT}getTrendingChannels`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchAccToCategory(
  categoryValue: string
): Promise<ChannelCollectionResponse> {
  try {
    const response: AxiosResponse<ChannelCollectionResponse> = await axios.get(
      `${
        import.meta.env.VITE_APP_CHANNEL_ENDPOINT
      }searchByCriteria?key=Category&value=${categoryValue}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function search(
  input: string
): Promise<ChannelCollectionResponse> {
  try {
    const response: AxiosResponse<ChannelCollectionResponse> = await axios.get(
      `${import.meta.env.VITE_APP_CHANNEL_ENDPOINT}search?keyword=${input}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
