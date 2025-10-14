import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation";
import MLRedirectNotice from "./components/MLRedirectNotice";
import NisrHome from "./pages/nisrHome";
import DynamicHotspot from "./pages/dynamicHotspot";
import Footer from "./components/footer";
import AnalyticsPage from "./pages/analytics";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <MLRedirectNotice />

        <main>
          <Routes>
            <Route path="/" element={<NisrHome />} />
            <Route path="/hotspot" element={<DynamicHotspot />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
