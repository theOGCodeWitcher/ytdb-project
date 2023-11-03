import axios, { AxiosResponse } from "axios";
import {
  ChannelItem,
  OwnReviewCardProps,
  ReviewCardProps,
  ReviewFormData,
} from "../types/type";

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

export async function getReviewsByChannelId(
  ChannelId: string
): Promise<ReviewCardProps[]> {
  try {
    const response: AxiosResponse<ReviewCardProps[]> = await axios.get(
      `${
        import.meta.env.VITE_APP_CHANNEL_ENDPOINT
      }getReviewsByChannelId?channelId=${ChannelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getReviewsByChannelIdAnduserId(
  ChannelId: string,
  userId: string
): Promise<OwnReviewCardProps> {
  try {
    const response: AxiosResponse<OwnReviewCardProps> = await axios.get(
      `${
        import.meta.env.VITE_APP_USER_ENDPOINT
      }getReviewsByChannelAndUser?userId=${userId}&channelId=${ChannelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
