import bannerImage from "../assets/bannerImage.jpg";

export const HomeBanner = () => {
  return (
    <section id="banner">
      <div className=" w-full h-[16rem] md:h-[20rem] flex rounded-lg shadow-lg">
        <div className=" relative  w-full md:w-1/2 flex flex-col  md:gap-4  px-2 md:p-8  ">
          <div
            className="absolute inset-0 bg-bottom bg-contain bg-no-repeat md:hidden "
            style={{ backgroundImage: `url(${bannerImage})` }}
          ></div>
          <div className=" relative pt-6 px-4 flex gap-2 flex-col">
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
        </div>
        <div className=" pt-4 md:w-1/2 hidden md:block ">
          <img
            src={bannerImage}
            alt="banner-image "
            className="w-full h-full object-contain hover:scale-[1.03] transition "
          />
        </div>
      </div>
    </section>
  );
};