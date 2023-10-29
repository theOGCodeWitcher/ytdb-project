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
      <Card data={cardData} />
    </div>
  );
}

export default App;
