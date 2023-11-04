import axios, { AxiosResponse } from "axios";
import {
  ChannelCollectionResponse,
  ProfileProps,
  ReviewCardProps,
  User,
} from "../types/type";

export async function fetchUserWithId(userAuthObj: User): Promise<User> {
  try {
    const response: AxiosResponse<User> = await axios.post(
      `${import.meta.env.VITE_APP_USER_ENDPOINT}login`,
      userAuthObj
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUserProfile(userId_db: string): Promise<User> {
  try {
    const response: AxiosResponse<User> = await axios.get(
      `${
        import.meta.env.VITE_APP_USER_ENDPOINT
      }getUserProfile?userId=${userId_db}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(
  userId_db: string,
  formValues: ProfileProps
): Promise<User> {
  try {
    const response: AxiosResponse<User> = await axios.put(
      `${
        import.meta.env.VITE_APP_USER_ENDPOINT
      }updateUserProfile?userId=${userId_db}`,
      formValues
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getReviewsByUserId(
  userId: string
): Promise<ReviewCardProps[]> {
  try {
    const response: AxiosResponse<ReviewCardProps[]> = await axios.get(
      `${
        import.meta.env.VITE_APP_USER_ENDPOINT
      }getReviewsByUserId?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addToFavourite(
  channelId: string,
  userId: String
): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await axios.post(
      `${
        import.meta.env.VITE_APP_USER_ENDPOINT
      }addToFavourites?channelId=${channelId}&userId=${userId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addToWishlist(
  channelId: string,
  userId: String
): Promise<{ message: string }> {
  try {
    const response: AxiosResponse<{ message: string }> = await axios.post(
      `${
        import.meta.env.VITE_APP_USER_ENDPOINT
      }addToWishlist?channelId=${channelId}&userId=${userId}`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getFavorites(
  userId: string
): Promise<ChannelCollectionResponse> {
  try {
    const response: AxiosResponse<ChannelCollectionResponse> = await axios.get(
      `${import.meta.env.VITE_APP_USER_ENDPOINT}getFavourites?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getWishlist(
  userId: string
): Promise<ChannelCollectionResponse> {
  try {
    const response: AxiosResponse<ChannelCollectionResponse> = await axios.get(
      `${import.meta.env.VITE_APP_USER_ENDPOINT}getWishlist?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
