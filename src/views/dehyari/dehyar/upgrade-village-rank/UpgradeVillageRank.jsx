"use client";
import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import UpgradeVillageTable from "./list/UpgradeVillageTable";
import UpgradeVillageInformation from "./list/UpgradeVillageInformation";
import { getDivisionInformation } from "@/Services/UpgradeVillage";
import { me } from "@/Services/Auth/AuthService";
import api from "@/utils/axiosInstance";
import UpgradeVillageLoading from "@/components/loadings/UpgradeVillageLoading";
import { fetchGeoDetails } from "@/utils/fetchGeoDetails";

const UpgradeVillageRank = () => {
  const [loading, setLoading] = useState(false);
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false);
  const [divisionInformation, setDivisionInformation] = useState("");
  const [geoNames, setGeoNames] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const handleAddEventSidebarToggle = () =>
    setAddEventSidebarOpen(!addEventSidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(getDivisionInformation(), {
          requiresAuth: true,
        });
        setDivisionInformation(response.data.data);
      } catch (error) {
        console.error("Error fetching division information:", error);
      } finally {
        setLoading(false);
      }
    };

    const userDetails = async () => {
      try {
        const response = await api.get(`${me()}`, { requiresAuth: true });
        setUserInfo(response.data.data.user.original);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
    userDetails();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const getGeoNames = async () => {
        console.log("User Info => ", userInfo);
        const geoState = userInfo?.geo_state;
        const geoCity = userInfo?.geo_city;
        const geoRegion = userInfo?.geo_region;
        const geoDehestan = userInfo?.geo_dehestan;
        const geoVillage = userInfo?.geo_village;
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
    }
  }, [userInfo]);

  console.log("Geo Names => ", geoNames);
  if (!divisionInformation || !geoNames) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <UpgradeVillageLoading />
      </Box>
    );
  }

  return (
    <Grid
      container
      p={5}
      borderRadius={2}
      boxShadow={2}
      className="bg-backgroundPaper"
    >
      <div className="w-full h-full md:flex justify-around">
        <div className="flex-1">
          <UpgradeVillageInformation
            details={divisionInformation}
            userInfo={userInfo}
            geoNames={geoNames}
          />
        </div>
        <Divider className="bg-backgroundDefault md:w-[3px] sm:w-full md:ml-5 mx-5" />
        {divisionInformation ? (
          <div className="flex-[2]">
            <Typography
              display={"flex"}
              mb={5}
              variant="h6"
              justifyContent={"center"}
            >
              جزئیات محاسبه درجه بندی دهیاری
            </Typography>
            <UpgradeVillageTable
              details={divisionInformation}
              loading={loading}
              setLoading={setLoading}
              handleAddEventSidebarToggle={handleAddEventSidebarToggle}
              addEventSidebarOpen={addEventSidebarOpen}
            />
          </div>
        ) : (
          <div>sss</div>
        )}
      </div>
    </Grid>
  );
};

export default UpgradeVillageRank;
