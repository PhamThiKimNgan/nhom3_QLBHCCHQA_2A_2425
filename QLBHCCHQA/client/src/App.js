import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Home from "./pages/Home";
import "./components/AuthPage.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
