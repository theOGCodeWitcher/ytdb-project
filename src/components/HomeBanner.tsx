import bannerImage from "../assets/bannerImage.png";

export const HomeBanner = () => {
  return (
    <section id="banner">
      <div className=" w-full h-[16rem] md:h-[20rem] flex rounded-lg shadow-lg px-6">
        <div className=" w-full md:w-3/4 flex flex-col  justify-center gap-4  px-2 md:p-8 ">
          <h1 className="text-base md:text-4xl font-bold md:mb-4">
            "Navigate YouTube Like Never Before"
          </h1>
          <p className="text-base md:text-xl w-full ">
            Dive into quality recommendations and insightful reviews
          </p>
          <div className=" md:py-4 m-2">
            <button className="btn btn-sm btn-outline btn-primary rounded-lg  md:w-[10rem]">
              Click me
            </button>
          </div>
        </div>
        <div className="w-1/4 py-6  hidden md:block items-center">
          <img
            src={bannerImage}
            alt="banner-image "
            className="w-[20rem] h-[17rem] rounded-lg   "
          />
        </div>
      </div>
    </section>
  );
};
