import React from "react";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { DeliveryStates, actionButtonTextMapping } from "../lib/deliveries";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom";
import { PickupDialog } from "./PickupDialog";
import DeliveryStatusChip from "./DeliveryStatusChip";
import GoogleMapLink from "./GoogleMapLink";

function DeliveryCard({ delivery, handleOnNext, isFutureDate }) {
  const { classes } = useStyles();
  const {
    client,
    restaurant,
    pickupAt,
    deliverAt,
    pickupAddress,
    deliveryAddress,
    orderItems,
    state,
    id,
  } = delivery;
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleViewDetailsClick = () => {
    history.push(`/delivery/${id}`);
  };

  const onNextClick = () => {
    if (
      state === DeliveryStates.DRIVER_AT_RESTAURANT &&
      orderItems.filter((item) => !!item.checked).length !== orderItems.length
    ) {
      setOpen(true);
      return;
    }
    handleOnNext(delivery);
  };

  return (
    <>
      <Card
        className={`${classes.card} ${
          [DeliveryStates.PICKED_UP, DeliveryStates.DRIVER_AT_CLIENT].includes(
            state
          ) && "picked-up"
        }  ${state === DeliveryStates.DELIVERED && "delivered"}`}
        wid
      >
        <CardContent>
          <div className={classes.header}>
            <Stack>
              <Typography variant="h6" component="h2" textAlign="left">
                {client}
              </Typography>
              <Stack direction="row" mb={1}>
                <StorefrontIcon color="action" />
                <Typography marginLeft={1}>{restaurant}</Typography>
              </Stack>
            </Stack>
            <DeliveryStatusChip
              deliverAt={deliverAt}
              pickupAt={pickupAt}
              state={state}
            />
          </div>
          <div className={classes.body}>
            {/* Address */}
            <div className={classes.item}>
              <Typography variant="subtitle2">Pickup</Typography>
              <GoogleMapLink address={pickupAddress} />
            </div>
            <div className={classes.item}>
              <Typography variant="subtitle2">Delivery</Typography>
              <GoogleMapLink address={deliveryAddress} />
            </div>

            {/* Order items */}
            <div className={classes.item}>
              <Typography variant="subtitle2">Order items:</Typography>
              <Box marginLeft={1}>
                <Badge badgeContent={orderItems.length} color="primary">
                  <ShoppingBagOutlinedIcon color="action" />
                </Badge>
              </Box>
            </div>
          </div>

          {/* Actions */}
          <CardActions sx={{ justifyContent: "end", padding: 0 }}>
            <Button variant="text" onClick={handleViewDetailsClick}>
              Details
            </Button>
            <Button
              variant="outlined"
              onClick={onNextClick}
              disabled={
                state === DeliveryStates.DELIVERED ||
                (isFutureDate && state === DeliveryStates.DRIVER_CONFIRMED)
              }
            >
              {actionButtonTextMapping[state]}
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      <PickupDialog
        open={open}
        handleClose={() => setOpen(false)}
        handleOnContinue={handleViewDetailsClick}
      />
    </>
  );
}

export default DeliveryCard;
