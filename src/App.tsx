import React from "react";
import logo from "./logo.svg";
import "./App.css";
import GameScreen from "./view/GameScreen";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  const startNewGame = (): void => {
    console.log("start new game");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <nav>
        <Link to="/game">Start a new game</Link>
      </nav>

      <Routes>
        <Route path="game" element={<GameScreen />} />
      </Routes>
    </div>
  );
}

export default App;
