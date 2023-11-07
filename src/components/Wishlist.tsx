import { getUserID_db } from "../context/customHooks";
import { useEffect, useState } from "react";
import { ChannelCollectionResponse } from "../types/type";
import { getWishlist } from "../api/UserApi";
import Loading from "./Loading";
import SectionHeading from "./SectionHeading";
import CardCollection from "./CardCollection";
import { BsFillBookmarkStarFill } from "react-icons/bs";

export default function Wishlist() {
  const userId = getUserID_db();

  const [wishlist, setwishlist] = useState<ChannelCollectionResponse | null>(
    null
  );
  const [isLoadingWishlist, setisLoadingWishlist] = useState<boolean>(true);

  async function fetchWishlist() {
    if (userId) {
      try {
        setisLoadingWishlist(true);
        const data = await getWishlist(userId);
        setwishlist(data);
        setisLoadingWishlist(false);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setisLoadingWishlist(false);
      }
    }
  }

  const removeCard = (channelIdToRemove: string) => {
    setwishlist((currentData) =>
      currentData
        ? currentData.filter(
            (channel) => channel.ChannelId !== channelIdToRemove
          )
        : null
    );
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  return (
    <>
      {isLoadingWishlist ? (
        <Loading />
      ) : (
        <div className="mb-4  ">
          <div className="flex mx-2 px-2 py-2 my-2 md:mx-8 md:px-8 items-center">
            <SectionHeading>Wishlist</SectionHeading>
            <div className="md:pt-3">
              <BsFillBookmarkStarFill size={26} />
            </div>
          </div>
          {wishlist && (
            <CardCollection data={wishlist} onRemoveCard={removeCard} />
          )}
        </div>
      )}
    </>
  );
}
