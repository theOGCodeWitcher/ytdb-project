import "./App.css";

import { Route, Routes } from "react-router-dom";
import Channel from "./pages/Channel";
import Homepage from "./pages/Homepage";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/channel/:channelId" element={<Channel />} />
      </Routes>
    </>
  );
}

export default App;
