import axios, { AxiosResponse } from "axios";
import { TrendingResponse } from "../types/type";

export default async function fetchTrending(): Promise<TrendingResponse> {
  try {
    const response: AxiosResponse<TrendingResponse> = await axios.get(
      "https://ytdb-backend.onrender.com/api/general/getTrendingChannels"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
