"use client";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import NavToggle from "./NavToggle";
import ModeDropdown from "@components/layout/shared/ModeDropdown";
import { verticalLayoutClasses } from "@layouts/utils/layoutClasses";
import UserDropdown from "@components/layout/shared/UserDropdown";
import api from "@utils/axiosInstance";
import { me } from "@/Services/Auth/AuthService";
import { Avatar, Chip } from "@mui/material";
import roles from "@data/roles.json";
import UserDivisionChip from "../shared/UserDivisionChip";

const NavbarContent = () => {
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await api.get(`${me()}`, { requiresAuth: true });
      setUserDetails(response.data.data.user.original);
    };
    fetchUserData();
  }, []);

  return (
    <div
      className={classnames(
        verticalLayoutClasses.navbarContent,
        "flex items-center justify-between gap-4 is-full"
      )}
    >
      <div className="flex items-center gap-[7px]">
        <NavToggle />
      </div>
      <div className="flex items-center">
        <UserDivisionChip
          workGroup={roles[userDetails?.work_group]}
          geoState={userDetails?.geo_state}
          geoCity={userDetails?.geo_city}
          geoRegion={userDetails?.geo_region}
          geoDehestan={userDetails?.geo_dehestan}
        />
        <ModeDropdown />
        <UserDropdown userDetails={userDetails} />
      </div>
    </div>
  );
};

export default NavbarContent;
