import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import React from "react";

export const OrderList = ({
  orderItems,
  showCheckbox,
  handleOnCheckboxClick,
}) => {
  return (
    <>
      {orderItems.map((item, index) =>
        !showCheckbox ? (
          <Typography
            key={index}
          >{`${item.qty} x ${item.description}`}</Typography>
        ) : (
          <FormControlLabel
            key={index}
            label={`${item.qty} x ${item.description}`}
            control={
              <Checkbox
                onClick={handleOnCheckboxClick}
                id={index}
                checked={!!item.checked}
              />
            }
          />
        )
      )}
    </>
  );
};

export default OrderList;
