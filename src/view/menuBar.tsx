import React, { FC } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface MenuBarProps {
  handleResetGame: () => void;
}
const MenuBar: FC<MenuBarProps> = ({ handleResetGame }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "black" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bowling Game
          </Typography>
          <Button variant="outlined" color="inherit" onClick={handleResetGame}>
            Reset game
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MenuBar;
