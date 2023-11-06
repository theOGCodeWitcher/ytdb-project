import { useRef } from "react";
import Card from "./Card";
import { ChannelItem } from "../types/type";
import { BiSolidChevronsLeft, BiSolidChevronsRight } from "react-icons/bi";

interface CardCollectionProps {
  data: ChannelItem[];
  onRemoveCard?: (channelId: string) => void;
}

export default function CardCollection({
  data,
  onRemoveCard,
}: CardCollectionProps) {
  const carouselRef = useRef<any>();

  const scroll = (scrollOffset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className=" relative flex">
      <button
        onClick={() => scroll(-500)}
        className="absolute left-4 z-10 top-4 glass btn  opacity-50 h-[32rem] md:w-[1rem] hidden md:block  "
      >
        <div>
          <BiSolidChevronsLeft size={26} />
        </div>
      </button>

      <div
        ref={carouselRef}
        className="flex mx-2 px-2 pb-2 md:pb-8 md:mx-8 overflow-x-auto gap-3 md:p-4 md:gap-8 no-scrollbar mr-8"
      >
        {data.map((item) => (
          <div key={item.ChannelId}>
            <Card data={item} onRemoveCard={onRemoveCard} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(500)}
        className="absolute right-4 z-10 top-4 glass btn  h-[32rem] md:w-[1rem] w-[0.5rem] opacity-50  items-center justify-center  hidden md:block"
      >
        <div>
          {" "}
          <BiSolidChevronsRight size={24} />
        </div>
      </button>
    </div>
  );
}
