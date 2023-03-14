import { Alert, Button, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { actionButtonTextMapping, DeliveryStates } from "../lib/deliveries";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useMemo } from "react";
import OrderList from "./OrderList";
import { Stack } from "@mui/system";
import GoogleMapLink from "./GoogleMapLink";

export const DeliveryDetails = ({
  deliveries,
  onChange,
  handleOnNext,
  isFutureDate,
}) => {
  const [delivery, setDelivery] = React.useState(null);
  const { id } = useParams();

  useEffect(() => {
    const [delivery] = deliveries.filter((item) => item.id === +id);
    setDelivery(delivery || null);
  }, [deliveries, id]);

  const handleOnCheckboxClick = (e) => {
    const index = +e.target.id;
    const checked = e.target.checked;
    const result = { ...delivery };
    result.orderItems[index].checked = checked;
    //update localstorage
    onChange(result);
  };

  const isButtonDisabled = useMemo(() => {
    if (
      delivery &&
      isFutureDate &&
      delivery.state === DeliveryStates.DRIVER_CONFIRMED
    )
      return true;
    if (
      delivery &&
      delivery.state === DeliveryStates.DRIVER_AT_RESTAURANT &&
      delivery.orderItems.filter((item) => !!item.checked).length !==
        delivery.orderItems.length
    )
      return true;
    if (delivery && delivery.state === DeliveryStates.DELIVERED) return true;

    return false;
  }, [delivery, isFutureDate]);

  return delivery ? (
    <Container>
      <Stack direction="column" alignItems="flex-start">
        <Typography variant="h4" component="h2" textAlign="left" mb={2}>
          {delivery.client}
        </Typography>
        <Stack direction="row" mb={1}>
          <StorefrontIcon color="primary" />
          <Typography marginLeft={1}>{delivery.restaurant}</Typography>
        </Stack>

        {/* Address */}
        <Stack direction="row" mb={1}>
          <Typography textAlign="left" mr={1}>
            Pickup
          </Typography>
          <GoogleMapLink address={delivery.pickupAddress} />
        </Stack>
        <Stack direction="row" mb={1}>
          <Typography textAlign="left" mr={1}>
            Delivery
          </Typography>
          <GoogleMapLink address={delivery.deliveryAddress} />
        </Stack>

        {/* Order Items */}
        <Stack>
          <Typography textAlign="left" mr={1}>
            Order Items ({delivery.orderItems.length})
          </Typography>
          <OrderList
            showCheckbox={
              delivery.state === DeliveryStates.DRIVER_AT_RESTAURANT
            }
            handleOnCheckboxClick={handleOnCheckboxClick}
            orderItems={delivery.orderItems}
          />
        </Stack>

        {/* Info Message */}
        <Stack mt={2} mb={2}>
          {delivery.state === DeliveryStates.DRIVER_AT_RESTAURANT && (
            <Alert variant="outlined" severity="info">
              Checkout each item to proceed
            </Alert>
          )}
        </Stack>

        {/* Action Button */}
        <Stack>
          <Button
            variant="contained"
            onClick={() => handleOnNext(delivery)}
            disabled={isButtonDisabled}
          >
            {actionButtonTextMapping[delivery.state]}
          </Button>
        </Stack>
      </Stack>
    </Container>
  ) : (
    <Typography variant="h4" component="h2" textAlign="left">
      Invalid Delivery Id
    </Typography>
  );
};

export default DeliveryDetails;
