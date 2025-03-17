// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";
import Snapshot from "./pages/Snapshot";
import Metrics from "./pages/Metrics";
import Campaigns from "./pages/Campaigns";
import NewCampaigns from "./pages/NewCampaigns";
import UserPathAnalysis from "./pages/UserPathAnalysis";

const App = () => {
  console.log("App component loaded");
  return (
    <Router>
      <div className="app-container" style={{ display: "flex", height: "100vh" }}>
        <SidePanel />
        <div className="main-content" style={{ flexGrow: 1, padding: "0px", display: "flex", flexDirection: "column" }}>
        <Header />
          <div style={{ flexGrow: 1, marginTop: "0px" }}>
            <Routes>``
              <Route path="/" element={<Snapshot />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/new-campaigns" element={<NewCampaigns />} />
              <Route path="/user-path-analysis" element={<UserPathAnalysis />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;