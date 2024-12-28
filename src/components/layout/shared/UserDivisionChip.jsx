"use client";
import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import api from "@/utils/axiosInstance";
import { getGeoDetails } from "@/Services/CountryDivision";

const UserDivisionChip = ({
  workGroup,
  geoState,
  geoCity,
  geoRegion,
  geoDehestan,
}) => {
  const [geoNames, setGeoNames] = useState({
    stateName: "",
    cityName: "",
    regionNames: [],
    dehestanName: "",
  });

  useEffect(() => {
    const fetchGeoDetails = async () => {
      if (!geoState && !geoCity && !geoRegion && !geoDehestan) return;
      try {
        const geoDetails = [
          { geo_type: "state", geo_code: `${geoState}` },
          { geo_type: "city", geo_code: `${geoCity}` },
          ...(Array.isArray(geoRegion)
            ? geoRegion.map((region) => ({
                geo_type: "region",
                geo_code: region.toString(),
              }))
            : geoRegion
              ? [{ geo_type: "region", geo_code: geoRegion.toString() }]
              : []),
          { geo_type: "dehestan", geo_code: `${geoDehestan}` },
        ].filter((item) => item.geo_code !== "undefined");

        const geoResponse = await api.post(
          getGeoDetails(),
          { geo_data: geoDetails },
          { requiresAuth: true }
        );
        const geoData = geoResponse.data;

        const stateInfo = geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoState
        );
        const cityInfo = geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoCity
        );
        const regionInfos = Array.isArray(geoRegion)
          ? geoRegion.map((region) => {
              const info = geoData.find(
                (geo) => geo.info.length && geo.info[0].hierarchy_code == region
              );
              return info?.info[0]?.approved_name || region;
            })
          : geoRegion
            ? [
                geoData.find(
                  (geo) =>
                    geo.info.length && geo.info[0].hierarchy_code == geoRegion
                )?.info[0]?.approved_name || geoRegion,
              ]
            : [];
        const dehestanInfo = geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoDehestan
        );

        setGeoNames({
          stateName: stateInfo?.info[0]?.approved_name || "",
          cityName: cityInfo?.info[0]?.approved_name || "",
          regionNames: regionInfos,
          dehestanName: dehestanInfo?.info[0]?.approved_name || "",
        });
      } catch (error) {
        console.error("Error fetching geo details:", error);
      }
    };

    fetchGeoDetails();
  }, [geoState, geoCity, geoRegion, geoDehestan]);

  const getLocationLabel = () => {
    const parts = [];
    if (geoNames.stateName) parts.push(geoNames.stateName);
    if (geoNames.cityName) parts.push(geoNames.cityName);
    if (geoNames.regionNames.length)
      parts.push(...geoNames.regionNames.slice(0, -1));
    const lastLocation =
      geoNames.dehestanName ||
      geoNames.regionNames[geoNames.regionNames.length - 1];

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && " - "}
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
