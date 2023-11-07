import { useState, useEffect, useContext } from "react";
import { ProfileProps, ReviewCardProps } from "../types/type";
import {
  fetchUserProfile,
  getReviewsByUserId,
  updateUserProfile,
} from "../api/UserApi";

import { BiSolidEditAlt, BiSolidSave } from "react-icons/bi";
import ReviewContainer from "./ReviewContainer";
import HorizontalDivider from "./HorizontalDivider";
import { AiOutlineClose } from "react-icons/ai";
import UserContext from "../context/userContext";

export function Profile() {
  const [userInfo, setUserInfo] = useState<ProfileProps | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<Error | null>(null);
  const [editOpen, seteditOpen] = useState<boolean>(false);
  const [reviewsData, setreviewsData] = useState<ReviewCardProps[]>();
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);

  const { userData } = useContext(UserContext);
  let userId: string | undefined;
  if (userData) {
    userId = userData._id;
  }
  const fetchProfileData = async () => {
    try {
      if (userId) {
        const response = await fetchUserProfile(userId);
        setFormValues({
          ytdbUsername: userInfo?.ytdbUsername || "",
          bio: userInfo?.bio || "",
          age: userInfo?.age || 0,
          country: userInfo?.country || "",
        });
        setUserInfo(response);
      }
    } catch (error) {
      console.log("Error fetching profile data:", error);
    }
  };

  async function fetchReviews() {
    if (userId) {
      try {
        setIsLoadingReview(true);
        const data = await getReviewsByUserId(userId);
        setreviewsData(data);
        setIsLoadingReview(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setIsLoadingReview(false);
      }
    }
  }

  useEffect(() => {
    fetchProfileData();
    fetchReviews();
  }, [userId, editOpen]);

  // if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error loading user data: {error.message}</p>;

  const [formValues, setFormValues] = useState({
    ytdbUsername: "",
    bio: "",
    age: 0,
    country: "",
  });

  const handleSave = async (formValues: ProfileProps) => {
    try {
      if (userId) {
        await updateUserProfile(userId, formValues);
        seteditOpen(false);
      }
    } catch (error) {
      console.log("Error Updating profile data:", error);
    }
  };

  return (
    userData && (
      <>
        <div className=" mt-8 p-8 dark:bg-gray-800 bg-gray-100 rounded-lg flex flex-col gap-4 w-full max-w-xl mx-auto relative">
          {editOpen && (
            <button
              className="btn absolute top-4 left-2 "
              onClick={() => seteditOpen(false)}
            >
              <AiOutlineClose size={20} />
            </button>
          )}
          <button
            className="btn absolute top-4 right-2 "
            onClick={() => seteditOpen(true)}
          >
            <BiSolidEditAlt size={20} />
            Edit
          </button>
          {userData?.picture && (
            <div className="flex justify-center mb-4">
              <img
                src={userData.picture}
                alt="User Profile"
                className="w-32 h-32 rounded-full  object-cover"
              />
            </div>
          )}
          <div className="flex justify-between">
            <h2 className=" text-xl md:text-2xl font-semibold ">
              {userData.name}
            </h2>
            <p className="text font-semibold pt-1 ">Email: {userData.email}</p>
          </div>

          {editOpen ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="ytdbUsername" className="font-medium">
                  YTDB Username
                </label>
                <input
                  type="text"
                  id="ytdbUsername"
                  value={formValues.ytdbUsername}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      ytdbUsername: e.target.value,
                    }))
                  }
                  className="border rounded p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="bio" className="font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formValues.bio}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="border rounded p-2"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="age" className="font-medium">
                  Age
                </label>
                <input
                  type="input"
                  id="age"
                  value={formValues.age}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      age: Number(e.target.value),
                    }))
                  }
                  className="border rounded p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="font-medium">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={formValues.country}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="border rounded p-2"
                />
              </div>
              <button
                className="btn "
                onClick={() => {
                  handleSave(formValues);
                }}
              >
                <BiSolidSave size={20} />
                Save
              </button>
            </div>
          ) : (
            userInfo && (
              <div className="flex flex-col gap-4">
                <h2 className=" font-semibold ">
                  YTDB Username :{userInfo.ytdbUsername}
                </h2>
                <p className="text-gray-500 italic ">Bio: {userInfo.bio}</p>
                <p className="text-gray-600 ">Age: {userInfo.age}</p>
                <p className="text-gray-600 ">Country: {userInfo.country}</p>
              </div>
            )
          )}
        </div>
        <HorizontalDivider />
        {reviewsData && (
          <ReviewContainer
            reviewsData={reviewsData}
            isLoadingReview={isLoadingReview}
          />
        )}
      </>
    )
  );
}

export default Profile;
