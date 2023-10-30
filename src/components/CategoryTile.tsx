interface ImageTileProps {
  imageUrl: string;
}

export default function CategoryTile({ imageUrl }: ImageTileProps) {
  return (
    <div className="w-[8rem] h-[8rem] bg-gray-200 flex items-center justify-center overflow-hidden ">
      <img
        src={imageUrl}
        alt="Tile"
        className="max-w-full max-h-full scale-[1.2]"
      />
    </div>
  );
}
