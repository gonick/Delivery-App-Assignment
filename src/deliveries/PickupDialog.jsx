import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

export const PickupDialog = ({ open, handleClose, handleOnContinue }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Complete Pickup</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please check mark all the order items in order to mark this delivery
          as picked up.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOnContinue} autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
