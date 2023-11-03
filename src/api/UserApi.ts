import axios, { AxiosResponse } from "axios";
import { ProfileProps, ReviewCardProps, User } from "../types/type";

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
