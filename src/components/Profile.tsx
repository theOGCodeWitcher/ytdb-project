import { useState, useEffect } from "react";
import { ProfileProps } from "../types/type";
import { fetchUserProfile, updateUserProfile } from "../api/UserApi";
import { getUserID_db } from "../context/customHooks";
import { BiSolidEditAlt, BiSolidSave } from "react-icons/bi";

export function Profile() {
  const [userData, setUserData] = useState<ProfileProps | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<Error | null>(null);
  const [editOpen, seteditOpen] = useState<boolean>(false);

  const id = getUserID_db();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (id) {
          const response = await fetchUserProfile(id);
          console.log(response);
          setFormValues({
            ytdbUsername: userData?.ytdbUsername || "",
            bio: userData?.bio || "",
            age: userData?.age || 0,
            country: userData?.country || "",
          });
          setUserData(response);
        }
      } catch (error) {
        console.log("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [id, editOpen]);

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
      if (id) {
        await updateUserProfile(id, formValues);
        seteditOpen(false);
      }
    } catch (error) {
      console.log("Error Updating profile data:", error);
    }
  };

  return (
    userData && (
      <div className=" p-8 rounded-lg flex flex-col gap-4 w-full max-w-xl mx-auto relative">
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
          <h2 className="text-2xl font-semibold ">{userData.name}</h2>
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
          <div className="flex flex-col gap-4">
            <h2 className=" font-semibold ">
              YTDB Username :{userData.ytdbUsername}
            </h2>
            <p className="text-gray-500 italic ">"Bio: {userData.bio}"</p>
            <p className="text-gray-600 ">Age: {userData.age}</p>
            <p className="text-gray-600 ">Country: {userData.country}</p>
          </div>
        )}
      </div>
    )
  );
}

export default Profile;
