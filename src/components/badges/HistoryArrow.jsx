import { Box, Typography } from "@mui/material";
import React from "react";

const sizeStyles = {
  small: {
    badgeSize: "30px",
    lineHeight: "1px",
    lineWidth: "75px",
    arrowSize: "6px",
    arrowOffset: "-2px",
  },
  medium: {
    badgeSize: "40px",
    lineHeight: "1.5px",
    lineWidth: "100px",
    arrowSize: "8px",
    arrowOffset: "-3px",
  },
  large: {
    badgeSize: "50px",
    lineHeight: "2px",
    lineWidth: "125px",
    arrowSize: "10px",
    arrowOffset: "-4.5px",
  },
};

const HistoryArrow = ({ prevBadge, nextBadge, text, size = "large" }) => {
  const { badgeSize, lineHeight, lineWidth, arrowSize, arrowOffset } =
    sizeStyles[size] || sizeStyles.large;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Typography
        variant="caption"
        sx={{
          fontSize:
            size === "small" ? "10px" : size === "medium" ? "12px" : "14px",
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
        <div
          className="grid items-center rounded-full border text-center font-bold"
          style={{
            width: badgeSize,
            height: badgeSize,
            fontSize:
              size === "small" ? "10px" : size === "medium" ? "12px" : "14px",
          }}
        >
          {prevBadge}
        </div>
        <Box
          sx={{
            height: lineHeight,
            width: lineWidth,
            background: "#ccc",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: arrowOffset,
              right: "-8px",
              width: "0",
              height: "0",
              borderLeft: `${arrowSize} solid #ccc`,
              borderTop: `${arrowSize / 2}px solid transparent`,
              borderBottom: `${arrowSize / 2}px solid transparent`,
            }}
          />
        </Box>
        <div
          className="grid items-center rounded-full border text-center font-bold"
          style={{
            width: badgeSize,
            height: badgeSize,
            fontSize:
              size === "small" ? "10px" : size === "medium" ? "12px" : "14px",
          }}
        >
          {nextBadge}
        </div>
      </Box>
    </Box>
  );
};

export default HistoryArrow;
