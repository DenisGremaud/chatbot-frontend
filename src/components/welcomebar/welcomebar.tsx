// src/components/welcomebar/welcomebar.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/UNIL_logo.png";
import "./welcomebar.css";

interface WelcomeBarProps {
	handleOpenCloseNavMenu: () => void;
}

const WelcomeBarComponent = ({ handleOpenCloseNavMenu }: WelcomeBarProps) => {
  return (
    <AppBar position="fixed" className="AppBar">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleOpenCloseNavMenu}
        >
          <MenuIcon />
        </IconButton>
        <img src={logo} alt="UNIL Logo" className="app-logo" />
      </Toolbar>
    </AppBar>
  );
};

export default WelcomeBarComponent;
