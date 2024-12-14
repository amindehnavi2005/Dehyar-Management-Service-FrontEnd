import React, { forwardRef } from "react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

const FilterChip = forwardRef(
  (
    {
      avatarValue,
      label,
      onClick,
      selected,
      variant = "outlined",
      sx = {},
      ...props
    },
    ref
  ) => {
    return (
      <Chip
        avatar={<Avatar>{avatarValue}</Avatar>}
        label={label}
        onClick={onClick}
        clickable
        variant={variant}
        ref={ref}
        sx={{
          boxShadow: selected ? 2 : 0,
          borderWidth: 1,
          "&:hover": {
            backgroundColor: "primary.main",
            color: "black",
          },
          ...sx,
        }}
        {...props} // سایر props اضافی
      />
    );
  }
);

export default FilterChip;
