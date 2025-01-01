import { Box, Typography } from "@mui/material";
import React from "react";

const HistoryArrow = ({ prevBadge, nextBadge, text }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Typography
        variant="caption"
        sx={{
          fontSize: "12px",
          color: "text.secondary",
          mb: -3,
        }}
      >
        {text}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        <div className="grid items-center rounded-full w-10 h-10 border text-center font-bold">
          {prevBadge}
        </div>
        <Box
          sx={{
            height: "2px",
            width: "125px",
            background: "#ccc",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "-4.5px",
              right: "-8px",
              width: "0",
              height: "0",
              borderLeft: "10px solid #ccc",
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
            }}
          />
        </Box>
        <div className="grid items-center rounded-full w-10 h-10 border text-center font-bold mr-2">
          {nextBadge}
        </div>
      </Box>
    </Box>
  );
};

export default HistoryArrow;
