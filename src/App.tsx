import "./App.css";
import { Navbar } from "./components/Navbar";
import { HomeBanner } from "./components/HomeBanner";
import { TrendingSection } from "./components/TrendingSection";
import { BrowseCategorySection } from "./components/BrowseCategorySection";

function App() {
  return (
    <div className="">
      <Navbar />
      <HomeBanner />
      <TrendingSection />
      <BrowseCategorySection />
    </div>
  );
}

export default App;
