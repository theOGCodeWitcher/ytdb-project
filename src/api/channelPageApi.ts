import axios, { AxiosResponse } from "axios";
import { ChannelItem, ReviewFormData } from "../types/type";

export async function fetchChannelById(
  ChannelId: string,
  id?: string
): Promise<ChannelItem> {
  try {
    const response: AxiosResponse<ChannelItem> = await axios.get(
      `${
        import.meta.env.VITE_APP_CHANNEL_ENDPOINT
      }getChannelById?channelId=${ChannelId}&userId=${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function postReview(
  reviewObj: ReviewFormData
): Promise<ReviewFormData> {
  try {
    const response: AxiosResponse<ReviewFormData> = await axios.post(
      `${import.meta.env.VITE_APP_USER_ENDPOINT}createReview`,
      reviewObj
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
