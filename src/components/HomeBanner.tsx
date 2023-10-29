import bannerImage from "../assets/bannerImage.jpg";

export const HomeBanner = () => {
  return (
    <section id="banner">
      <div className=" w-full h-[19rem] md:h-[20rem] flex rounded-lg shadow-lg">
        <div className=" w-full md:w-1/2 flex flex-col  md:gap-4  px-2 md:p-8  ">
          <div className="pt-6 px-4 flex gap-2 flex-col">
            <h1 className="text-base md:text-4xl font-bold md:mb-4">
              "Navigate YouTube Like Never Before"
            </h1>
            <p className="text-sm md:text-xl w-full ">
              Dive into quality recommendations and insightful reviews
            </p>
            <div className=" md:py-4 ">
              <button className="btn btn-xs btn-outline btn-primary rounded-lg  md:w-[10rem]">
                Explore
              </button>
            </div>
          </div>
          <div className=" md:w-1/2  md:hidden  ">
            <img
              src={bannerImage}
              alt="banner-image "
              className="w-full h-full object-contain "
            />
          </div>
        </div>
        <div className=" pt-4 md:w-1/2 hidden md:block ">
          <img
            src={bannerImage}
            alt="banner-image "
            className="w-full h-full object-contain "
          />
        </div>
      </div>
    </section>
  );
};
