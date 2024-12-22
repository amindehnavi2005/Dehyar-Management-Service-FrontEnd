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
      setDivisionInformation(response.data);
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
        <UpgradeVillageInformation
          details={divisionInformation}
          userInfo={userInfo}
        />
        <Divider className="bg-backgroundDefault md:w-[3px] sm:w-full md:ml-5" />
        <div className="">
          <Typography my={5} variant="h5">
            جزئیات محاسبه درجه بندی دهیاری
          </Typography>
          <UpgradeVillageTable
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
