import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation";
import NisrHome from "./pages/nisrHome";
import DynamicHotspot from "./pages/dynamicHotspot";
import Footer from "./components/footer";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<NisrHome />} />
          <Route path="/hotspot" element={<DynamicHotspot />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
