import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function LoadingIcon() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress sx={{ color: "secondary.contrastText" }} />
    </Box>
  );
}
