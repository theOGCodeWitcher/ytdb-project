import "./App.css";
import { Navbar } from "./components/Navbar";
import { HomeBanner } from "./components/HomeBanner";
import Card from "./components/Card";
// import SectionHeading from "./components/SectionHeading";
import { cardData } from "./data";
function App() {
  return (
    <div className="">
      <Navbar />
      <HomeBanner />
      {/* <SectionHeading>Trending</SectionHeading> */}
      {/* <Card
        imgSrc={cardData.Thumbnails ? cardData.Thumbnails[0] : undefined}
        imgAlt={cardData.Title}
        title={cardData.Title}
        description={cardData.Description}
        Rating={cardData.Rating}
        TopicCategories={cardData.TopicCategories}
      /> */}
    </div>
  );
}

export default App;
