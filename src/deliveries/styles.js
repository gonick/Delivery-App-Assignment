import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    borderLeft: `10px solid transparent`,
    // width: 450,
    "&.picked-up": {
      borderLeft: `10px solid ${theme.palette.secondary.main}`,
    },
    "&.delivered": {
      borderLeft: `10px solid #999`,
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
  item: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  itemCheckbox: {
    marginRight: theme.spacing(1),
  },
  actionButton: {
    alignSelf: "flex-end",
  },
}));
