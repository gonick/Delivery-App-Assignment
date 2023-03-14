import "./App.css";
import moment from "moment";
import { Switch, Route } from "react-router-dom";
import {
  fetchDeliveries,
  getNextState,
  sortDeliveries,
  storeDeliveries,
} from "./lib/deliveries";

import React, { useState, useEffect, useCallback } from "react";
import Deliveries from "./deliveries/Deliveries";
import { DeliveryDetails } from "./deliveries/DeliveryDetails";
import { Container, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import DateSelector from "./deliveries/DateSelector";
import { useMemo } from "react";

function App() {
  const [deliveries, setDeliveries] = useState([]);
  const [viewingDay, setViewingDay] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    const deliveries = fetchDeliveries(viewingDay);
    setDeliveries(deliveries);
  }, [viewingDay]);

  const updateDeliveries = useCallback(
    (delivery) => {
      setDeliveries((deliveries) => {
        let updatedDeliveries = [...deliveries];
        const index = deliveries.findIndex((item) => item.id === delivery.id);
        updatedDeliveries.splice(index, 1, delivery);
        //update localStorage
        updatedDeliveries = sortDeliveries(updatedDeliveries);
        storeDeliveries(viewingDay, updatedDeliveries);
        return updatedDeliveries;
      });
    },
    [viewingDay]
  );

  const handleOnNext = useCallback(
    (delivery) => {
      const state = getNextState(delivery.state);
      const updatedDelivery = { ...delivery, state };
      updateDeliveries(updatedDelivery);
    },
    [updateDeliveries]
  );

  const isFutureDate = useMemo(() => {
    return moment().format("YYYY-MM-DD") !== viewingDay;
  }, [viewingDay]);

  return (
    <Container>
      <Grid container spacing={2} mt={2} mb={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h2">
            Deliveries For: {viewingDay}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <DateSelector date={viewingDay} updateDate={setViewingDay} />
        </Grid>
      </Grid>

      <Switch>
        <Route exact path="/">
          <Deliveries
            isFutureDate={isFutureDate}
            deliveries={deliveries}
            handleOnNext={handleOnNext}
          />
        </Route>
        <Route path="/delivery/:id">
          <DeliveryDetails
            isFutureDate={isFutureDate}
            deliveries={deliveries}
            onChange={updateDeliveries}
            handleOnNext={handleOnNext}
          />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
