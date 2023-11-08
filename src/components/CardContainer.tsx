import { ChannelItem } from "../types/type";
import Card from "./Card";

interface CardCollectionProps {
  data: ChannelItem[];
}

export default function CardContainer({ data }: CardCollectionProps) {
  return (
    <div className="w-full">
      <div className="flex mx-2 px-2 pb-2  md:pb-8 md:mx-16 ml-[2.3rem] md:ml-[8rem] gap-3 md:p-4 md:gap-8 flex-wrap ">
        {data.map((item, index) => (
          <div key={index} className="">
            <Card data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
