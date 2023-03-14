import { Avatar, Chip } from "@mui/material";
import moment from "moment-timezone";
import React from "react";
import { DeliveryStates } from "../lib/deliveries";
import CheckIcon from "@mui/icons-material/Check";

export const DeliveryStatusChip = ({ state, deliverAt, pickupAt }) => {
  const getAvatar = (state) => {
    if (
      [DeliveryStates.PICKED_UP, DeliveryStates.DRIVER_AT_CLIENT].includes(
        state
      )
    )
      return "D";
    else if (state === DeliveryStates.DELIVERED)
      return <CheckIcon fontSize="small" sx={{ color: "white" }} />;
    else return "P";
  };
  return (
    <Chip
      avatar={<Avatar sx={{ color: "white" }}>{getAvatar(state)}</Avatar>}
      label={
        [
          DeliveryStates.PICKED_UP,
          DeliveryStates.DRIVER_AT_CLIENT,
          DeliveryStates.DELIVERED,
        ].includes(state)
          ? moment(deliverAt).calendar()
          : moment(pickupAt).calendar()
      }
    />
  );
};

export default DeliveryStatusChip;
