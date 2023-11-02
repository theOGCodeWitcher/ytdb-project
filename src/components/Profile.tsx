import { useState, useEffect } from "react";
import { ProfileProps } from "../types/type";
import { userDataObj } from "../lib/data";

export function Profile() {
  const [userData, setUserData] = useState<ProfileProps | null>(null);
  const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserData(userDataObj);
      } catch (err) {
        // setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error loading user data: {error.message}</p>;

  return (
    <div className=" p-8 rounded-lg flex flex-col gap-4 w-full max-w-xl mx-auto">
      {userData?.picture && (
        <div className="flex justify-center mb-4">
          <img
            src={userData.picture}
            alt="User Profile"
            className="w-32 h-32 rounded-full  object-cover"
          />
        </div>
      )}
      {userData?.name && (
        <h2 className="text-2xl font-semibold ">{userData.name}</h2>
      )}
      {userData?.email && (
        <p className="text-gray-600 ">Email: {userData.email}</p>
      )}
      {userData?.bio && (
        <p className="text-gray-500 italic ">"Bio: {userData.bio}"</p>
      )}
      {userData?.age && <p className="text-gray-600 ">Age: {userData.age}</p>}
      {userData?.country && (
        <p className="text-gray-600 ">Country: {userData.country}</p>
      )}
    </div>
  );
}

export default Profile;
