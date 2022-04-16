import React from "react";
import logo from "./bowling.jpeg";
import "./App.css";
import GameScreen from "./view/GameScreen";
import { Routes, Route, Link } from "react-router-dom";
import Button from "@mui/material/Button";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <nav>
        <Button variant="outlined">
          <Link to="/game">Start a new game</Link>
        </Button>
      </nav>
      <Routes>
        <Route path="game" element={<GameScreen />} />
      </Routes>
    </div>
  );
}

export default App;
