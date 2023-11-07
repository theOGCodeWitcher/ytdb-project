import { BrowseCategorySection } from "../components/BrowseCategorySection";
import { HomeBanner } from "../components/HomeBanner";
import { TrendingSection } from "../components/TrendingSection";

export default function Homepage() {
  return (
    <>
      <HomeBanner />
      <TrendingSection />
      <BrowseCategorySection />
    </>
  );
}
