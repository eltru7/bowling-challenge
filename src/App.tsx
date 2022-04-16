import React from "react";
import logo from "./bowling.jpeg";
import "./App.css";
import GameScreen from "./view/GameScreen";
import { Routes, Route, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import StartPage from "./view/startPage";

function App() {
  return (
    <div className="App">
      <StartPage />
    </div>
  );
}

export default App;
