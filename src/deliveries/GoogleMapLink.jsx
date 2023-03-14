import { Typography } from "@mui/material";
import React from "react";

export const GoogleMapLink = ({ address }) => {
  return (
    <Typography
      marginLeft={1}
      component="a"
      target="_blank"
      color="primary"
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`}
      referrerPolicy="no-referrer"
    >
      {address}
    </Typography>
  );
};

export default GoogleMapLink;
