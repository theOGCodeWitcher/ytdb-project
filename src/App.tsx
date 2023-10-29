import "./App.css";
import { Navbar } from "./components/Navbar";
import { HomeBanner } from "./components/HomeBanner";
import Card from "./components/Card";
import SectionHeading from "./components/SectionHeading";
import { cardData } from "./lib/data";

function App() {
  return (
    <div className="">
      <Navbar />
      <HomeBanner />
      <SectionHeading>Trending</SectionHeading>
      <Card
        imgSrc={cardData.Thumbnails ? cardData.Thumbnails[0] : undefined}
        imgAlt={cardData.Title}
        title={cardData.Title}
        description={cardData.Description}
        Rating={Number(cardData.Rating)}
        TopicCategories={cardData.TopicCategories}
        bannerImage={cardData.BannerImage}
        Subs={cardData.Subs}
        uploads={cardData.uploads}
      />
    </div>
  );
}

export default App;
