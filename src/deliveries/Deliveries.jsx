import { Grid } from "@mui/material";
import React from "react";
import DeliveryCard from "./DeliveryCard";

export const Deliveries = ({ isFutureDate, deliveries, handleOnNext }) => {
  return (
    <>
      <Grid container spacing={2}>
        {deliveries.map((delivery) => (
          <Grid item xs={12} md={6} key={delivery.id}>
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              handleOnNext={handleOnNext}
              isFutureDate={isFutureDate}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Deliveries;
