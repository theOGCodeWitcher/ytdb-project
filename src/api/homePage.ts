import axios, { AxiosResponse } from "axios";
import { ChannelCollectionResponse } from "../types/type";

export async function fetchTrending(): Promise<ChannelCollectionResponse> {
  try {
    const response: AxiosResponse<ChannelCollectionResponse> = await axios.get(
      "https://ytdb-backend.onrender.com/api/general/getTrendingChannels"
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
      `https://ytdb-backend.onrender.com/api/general/searchByCriteria?key=Category&value=${categoryValue}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
