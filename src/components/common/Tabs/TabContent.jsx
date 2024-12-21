import React from "react";
import Box from "@mui/material/Box";

const TabContent = ({ active, children }) => {
  return (
    <Box
      sx={{
        opacity: active ? 1 : 0,
        transform: `translateY(${active ? 0 : "10px"})`,
        position: active ? "static" : "absolute",
        visibility: active ? "visible" : "hidden",
        width: "100%",
        height: active ? "auto" : 0,
        overflow: "hidden",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {children}
    </Box>
  );
};

export default TabContent;
