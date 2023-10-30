interface ImageTileProps {
  imageUrl: string;
  name: string;
}

export default function CategoryTile({ imageUrl, name }: ImageTileProps) {
  return (
    <div className="w-[4rem] h-[4rem] flex flex-col items-center justify-center gap-2 overflow-hidden cursor-pointer hover:scale-110 transition md:w-[7rem] md:h-[7rem] ">
      <img
        src={imageUrl}
        alt="Tile"
        className=" w-3/5 h-3/5 scale-[1.2] rounded-full object-contain"
      />
      <p className="text-xs md:text-base">{name}</p>
    </div>
  );
}
