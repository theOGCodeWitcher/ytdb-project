import "./App.css";

import { Route, Routes } from "react-router-dom";
import Channel from "./pages/Channel";
import Homepage from "./pages/Homepage";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";
import Wishlist from "./components/Wishlist";
import Explore from "./components/Explore";
import Favorites from "./components/Favorites";
import { ThemeSwitch } from "./components/ThemeSwitch";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homePage" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/channel/:channelId" element={<Channel />} />
        </Routes>
      </div>
      <ThemeSwitch />
      <Footer />
    </div>
  );
}

export default App;
