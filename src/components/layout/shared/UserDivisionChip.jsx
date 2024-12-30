"use client";
import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { fetchGeoDetails } from "@/utils/fetchGeoDetails";

const UserDivisionChip = ({
  workGroup,
  geoState,
  geoCity,
  geoRegion,
  geoDehestan,
  geoVillage,
}) => {
  const [geoNames, setGeoNames] = useState({
    stateName: "",
    cityName: "",
    regionNames: [],
    dehestanName: "",
    villageName: "",
  });

  useEffect(() => {
    const getGeoNames = async () => {
      const geoData = await fetchGeoDetails({
        geoState,
        geoCity,
        geoRegion,
        geoDehestan,
        geoVillage,
      });
      setGeoNames(geoData);
    };

    getGeoNames();
  }, [geoState, geoCity, geoRegion, geoDehestan, geoVillage]);

  const getLocationLabel = () => {
    const parts = [];
    if (geoNames.stateName) parts.push(geoNames.stateName);
    if (geoNames.cityName) parts.push(geoNames.cityName);
    if (
      geoNames.regionNames.length &&
      parts.push(...geoNames.regionNames.slice(0))
    );

    if (geoNames.dehestanName) parts.push(geoNames.dehestanName);
    const lastLocation =
      geoNames.villageName ||
      geoNames.regionNames[geoNames.regionNames.length - 1];

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {parts.length > 1 && " - "}
          </span>
        ))}
        {lastLocation && <b>{lastLocation}</b>}
      </>
    );
  };

  return (
    <Chip
      className="mx-2 gap-1"
      sx={{
        height: "auto",
        "& .MuiChip-avatar": {
          width: "auto",
          height: "auto",
        },
        "& .MuiChip-label": {
          display: "block",
          padding: "8px",
          paddingLeft: "12px",
        },
      }}
      avatar={
        <p
          className={`flex items-center rounded-full bg-backgroundPaper p-1 text-textPrimary px-2`}
        >
          {workGroup || ""}
        </p>
      }
      label={<p>{getLocationLabel()}</p>}
      onClick={() => {}}
      style={{ textAlign: "right" }}
    />
  );
};

export default UserDivisionChip;
