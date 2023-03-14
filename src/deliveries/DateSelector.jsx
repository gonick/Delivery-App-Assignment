import { Stack, Typography } from "@mui/material";
import moment from "moment-timezone";
import React from "react";

export const DateSelector = ({ date, updateDate }) => {
  const max = moment().add(7, "days").format("YYYY-MM-DD");

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end">
      <Typography variant="subtitle2" mr={1}>
        Select a date
      </Typography>
      <input
        type="date"
        value={date}
        min={moment().format("YYYY-MM-DD")}
        max={max}
        onChange={(data) => updateDate(data.target.value)}
      ></input>
    </Stack>
  );
};

export default DateSelector;
