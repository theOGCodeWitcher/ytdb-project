import "./App.css";
import { Navbar } from "./components/Navbar";
import { HomeBanner } from "./components/HomeBanner";
import { TrendingSection } from "./components/TrendingSection";

function App() {
  return (
    <div className="">
      <Navbar />
      <HomeBanner />
      <TrendingSection />
    </div>
  );
}

export default App;
