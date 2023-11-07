import { MouseEventHandler } from "react";

interface ImageTileProps {
  imageUrl: string;
  name: string;
  onClick: MouseEventHandler;
  selectedCategory: string;
}

export default function CategoryTile({
  imageUrl,
  name,
  onClick,
  selectedCategory,
}: ImageTileProps) {
  return (
    <div
      className={`w-[4rem] h-[4rem] flex flex-col items-center justify-center gap-2 overflow-hidden cursor-pointer hover:scale-110 transition md:w-[7rem] md:h-[7rem]  ${
        selectedCategory === name.toLowerCase()
          ? "shadow-xl border border-black pt-2 rounded-lg transition"
          : ""
      }`}
    >
      <img
        src={imageUrl}
        alt="Tile"
        className=" w-3/5 h-3/5 scale-[1.2] rounded-full object-cover"
        onClick={onClick}
      />
      <p className="text-xs md:text-base">{name}</p>
    </div>
  );
}
