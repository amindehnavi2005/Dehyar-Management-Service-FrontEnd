"use client";
import { Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import UpgradeVillageTable from "./list/UpgradeVillageTable";
import UpgradeVillageInformation from "./list/UpgradeVillageInformation";
import { getDivisionInformation } from "@/Services/UpgradeVillage";
import { me } from "@/Services/Auth/AuthService";
import api from "@/utils/axiosInstance";

const UpgradeVillageRank = () => {
  const [loading, setLoading] = useState(false);
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false);
  const [divisionInformation, setDivisionInformation] = useState({});
  const [userInfo, setUserInfo] = useState({});

  const handleAddEventSidebarToggle = () =>
    setAddEventSidebarOpen(!addEventSidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(getDivisionInformation(), {
        requiresAuth: true,
      });
      setDivisionInformation(response.data.data);
    };
    const userDetails = async () => {
      const response = await api.get(`${me()}`, { requiresAuth: true });
      setUserInfo(response.data.data.user.original);
    };
    fetchData();
    userDetails();
  }, []);

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
          />
        </div>
        <Divider className="bg-backgroundDefault md:w-[3px] sm:w-full md:ml-5 mx-5" />
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
      </div>
    </Grid>
  );
};

export default UpgradeVillageRank;
