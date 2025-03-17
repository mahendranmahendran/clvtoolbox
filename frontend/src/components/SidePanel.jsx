import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";// import Drawer, List, ListItem, ListItemText from "@mui/material";
import { Link } from "react-router-dom";// import Link from "react-router-dom";

import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DirectionsWalkRoundedIcon from '@mui/icons-material/DirectionsWalkRounded';


const SidePanel = () => { // Create a new functional component named SidePanel
  return (
    <Drawer// Add a Drawer component
      variant="permanent" // Always visible on large screens
      anchor="left"// Position on the left side of the screen
      sx={{// Add custom styles
        width: 240,// Set the width to 240px
        flexShrink: 0,// Prevent shrinking when the screen size is reduced
        "& .MuiDrawer-paper": {// Customize the drawer paper
          width: 240,// Set the width to 240px
          boxSizing: "border-box",// Include padding and border in the width
          backgroundColor: "#333",// Set the background color to dark gray
          color: 'white',// Set the text color to white
          paddingTop: 10,// Add padding to the top
        },
      }}
    >
      <List>
        <ListItem component={Link} to="/" button>
        <QueryStatsRoundedIcon style={{ marginRight: "10px" }} /> 
          <ListItemText primary="Snapshot" /> 
        </ListItem>
        <ListItem button component={Link} to="/Metrics">
        <TrendingUpRoundedIcon style={{ marginRight: "10px" }} /> 
          <ListItemText primary="Metrics" />
        </ListItem>
        <ListItem button component={Link} to="/campaigns">
        <NotificationsActiveRoundedIcon style={{ marginRight: "10px" }} /> 
          <ListItemText primary="Campaigns" />
        </ListItem>
        <ListItem button component={Link} to="/new-campaigns">
        <AddCircleOutlineRoundedIcon style={{ marginRight: "10px" }} /> 
          <ListItemText primary="New Campaigns" />
        </ListItem>
        <ListItem button component={Link} to="/user-path-analysis">
        <DirectionsWalkRoundedIcon style={{ marginRight: "10px" }} /> 
          <ListItemText primary="User Path Analysis" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SidePanel;
