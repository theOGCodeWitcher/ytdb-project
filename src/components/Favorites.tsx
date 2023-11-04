import { getUserID_db } from "../context/customHooks";
import { useContext, useEffect, useState } from "react";
import { ChannelCollectionResponse } from "../types/type";
import { getFavorites } from "../api/UserApi";
import Loading from "./Loading";
import SectionHeading from "./SectionHeading";
import CardCollection from "./CardCollection";
import { BsBalloonHeartFill } from "react-icons/bs";
import UserContext from "../context/userContext";

export default function Favorites() {
  const { changeObserved, setChangeObserved } = useContext(UserContext);
  const userId = getUserID_db();
  const [favChannels, setfavChannels] =
    useState<ChannelCollectionResponse | null>(null);
  const [isLoadingFav, setisLoadingFav] = useState<boolean>(true);

  async function fetchFavorites() {
    if (userId) {
      try {
        setisLoadingFav(true);
        const data = await getFavorites(userId);
        setfavChannels(data);
        setisLoadingFav(false);
        setChangeObserved(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setisLoadingFav(false);
        setChangeObserved(false);
      }
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, [userId, changeObserved]);

  return (
    <>
      {isLoadingFav ? (
        <Loading />
      ) : (
        <div className="mb-4  ">
          <div className="flex mx-2 px-2 py-2 my-2 md:mx-8 md:px-8 items-center">
            <SectionHeading>Favorites</SectionHeading>
            <div className="md:pt-3">
              <BsBalloonHeartFill size={26} />
            </div>
          </div>
          {favChannels && <CardCollection data={favChannels} />}
        </div>
      )}
    </>
  );
}
