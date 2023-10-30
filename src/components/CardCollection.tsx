import Card from "./Card";
import { ChannelItem } from "../types/type";

interface CardCollectionProps {
  data: ChannelItem[];
}

export default function CardCollection({ data }: CardCollectionProps) {
  return (
    <div className="w-full">
      <div className="flex mx-2 px-2 pb-2  md:pb-8 md:mx-16 overflow-x-auto gap-3 md:p-4 md:gap-8 no-scrollbar">
        {data.map((item, index) => (
          <div key={index} className="">
            <Card data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
