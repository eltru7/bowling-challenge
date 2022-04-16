import React from "react";
import logo from "../bowling.jpeg";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function StartPage() {
  return (
    <div>
      <img src={logo} className="App-logo" alt="logo" />
      <nav>
        <Button variant="outlined">
          <Link to="/game">Start a new game</Link>
        </Button>
      </nav>
    </div>
  );
}

export default StartPage;
