import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";

const SidePanel = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#333",
          color: "white",
          paddingTop: 10,
        },
      }}
    >
      <List>
        <ListItem component={Link} to="/" sx={{ textDecoration: "none", color: "inherit" }}>
          <ListItemIcon>
            <QueryStatsRoundedIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem component={Link} to="/metrics" sx={{ textDecoration: "none", color: "inherit" }}>
          <ListItemIcon>
            <TrendingUpRoundedIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Metrics" />
        </ListItem>

        <ListItem component={Link} to="/campaigns" sx={{ textDecoration: "none", color: "inherit" }}>
          <ListItemIcon>
            <NotificationsActiveRoundedIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Campaign Performance" />
        </ListItem>

        <ListItem component={Link} to="/newcampaigns" sx={{ textDecoration: "none", color: "inherit" }}>
          <ListItemIcon>
            <AddCircleOutlineRoundedIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="New Campaigns" />
        </ListItem>

        <ListItem component={Link} to="/segments" sx={{ textDecoration: "none", color: "inherit" }}>
          <ListItemIcon>
            <DirectionsWalkRoundedIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Segments" />          
        </ListItem>

        <ListItem component={Link} to="/abtesting" sx={{ textDecoration: "none", color: "inherit" }}>
          <ListItemIcon>
            <DirectionsWalkRoundedIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="AB Testing" />          
        </ListItem>

      </List>
    </Drawer>
  );
};

export default SidePanel;
