import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import { CssVarsProvider } from "@mui/joy/styles";
import "./App.css";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Contact from "./Components/Contact";
import About from "./Components/About";
import Features from "./Components/Features";
import Dashboard from "./Dashboard/Dashboard";
import FarmerPost from "./Dashboard/FarmerPost";

function App() {
  return (
    <CssVarsProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/farmer" element={<FarmerPost />} />
          </Routes>
        </div>
      </Router>
    </CssVarsProvider>
  );
}

export default App;
