import { getUserID_db } from "../context/customHooks";
import { useEffect, useState } from "react";
import { ChannelCollectionResponse } from "../types/type";
import { getFavorites } from "../api/UserApi";
import Loading from "./Loading";
import SectionHeading from "./SectionHeading";
import CardCollection from "./CardCollection";
import { BsBalloonHeartFill } from "react-icons/bs";

export default function Favorites() {
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
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setisLoadingFav(false);
      }
    }
  }

  const removeCard = (channelIdToRemove: string) => {
    setfavChannels((currentData) =>
      currentData
        ? currentData.filter(
            (channel) => channel.ChannelId !== channelIdToRemove
          )
        : null
    );
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

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
          {favChannels && (
            <CardCollection data={favChannels} onRemoveCard={removeCard} />
          )}
        </div>
      )}
    </>
  );
}
