"use client";
import DividerSimple from "@/components/common/Divider/DividerSimple";
import { Button, Grid, Typography } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import React, { useEffect } from "react";
import DocumentUpload from "@/Services/UploadDocument";
import { FormProvider, useForm } from "react-hook-form";
import api from "@/utils/axiosInstance";
import { getDivisionInformation } from "@/Services/UpgradeVillage";
import { useRouter } from "next/navigation";
import { getGeoDetails } from "@/Services/CountryDivision";
import ContentLoader from "react-content-loader";
import LineContentLoader from "@/components/common/LineContentLoader";

const UpgradeVillageInformation = ({ details, userInfo }) => {
  const methods = useForm();
  const router = useRouter();
  const [geoNames, setGeoNames] = React.useState({
    stateName: "",
    cityName: "",
    regionNames: [],
    dehestanName: "",
  });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = (data) => {
    // console.log(data);
  };

  useEffect(() => {
    const fetchGeoDetails = async () => {
      if (!userInfo.geo_state && !userInfo.geo_city && !userInfo.geo_region)
        return;
      try {
        const geoDetails = [
          { geo_type: "state", geo_code: `${userInfo.geo_state}` },
          { geo_type: "city", geo_code: `${userInfo.geo_city}` },
          { geo_type: "dehestan", geo_code: `${userInfo.geo_dehestan}` },
          { geo_type: "village", geo_code: `${userInfo.geo_village}` },
          ...(Array.isArray(userInfo.geo_region)
            ? userInfo.geo_region.map((region) => ({
                geo_type: "region",
                geo_code: region.toString(),
              }))
            : userInfo.geo_region
              ? [
                  {
                    geo_type: "region",
                    geo_code: userInfo.geo_region.toString(),
                  },
                ]
              : []),
        ].filter((item) => item.geo_code !== "undefined");

        const geoResponse = await api.post(
          getGeoDetails(),
          { geo_data: geoDetails },
          { requiresAuth: true }
        );
        const geoData = geoResponse.data;
        const geoState = userInfo.geo_state;
        const geoCity = userInfo.geo_city;
        const geoRegion = userInfo.geo_region;
        const geoDehestan = userInfo.geo_dehestan;
        const geoVillage = userInfo.geo_village;

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

        const villageInfo = geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoVillage
        );

        setGeoNames({
          stateName: stateInfo?.info[0]?.approved_name || "",
          cityName: cityInfo?.info[0]?.approved_name || "",
          regionNames: regionInfos,
          dehestanName: dehestanInfo?.info[0]?.approved_name || "",
          villageName: villageInfo?.info[0]?.approved_name || "",
        });
      } catch (error) {
        console.error("Error fetching geo details:", error);
      }
    };

    fetchGeoDetails();
  }, [userInfo]);

  return (
    <FormProvider {...methods}>
      {" "}
      <Grid>
        <Typography display={"flex"} variant={"h6"} mb={5} gap={1} justifyContent={"center"}>
          <span>درجه بندی دهیاری</span>

          <span className={"text-error font-bold relative inline-block"}>
            <img
              src="/images/icons/Line-2.png"
              alt="زیرخط"
              style={{
                display: "block",
                margin: "0 auto",
                width: "100%",
                height: "4px",
                position: "absolute",
                bottom: "-2px",
                objectFit: "contain",
              }}
            />
            {geoNames.villageName || <LineContentLoader />}
          </span>
          <span></span>
        </Typography>
        <div className="my-5">
          <DividerSimple title={"تقسیمات کشوری"} />
        </div>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-building-4-line h-4"></i>استان :
          <span className="mr-1 font-medium text-secondary">
            {geoNames.stateName || <LineContentLoader />}
          </span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-building-2-line h-4"></i>شهرستان :{" "}
          <span className="mr-1 font-medium text-secondary">
            {geoNames.cityName || <LineContentLoader />}
          </span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-building-line h-4"></i>بخش :{" "}
          <span className="mr-1 font-medium text-secondary">
            {geoNames.regionNames.join(", ") || <LineContentLoader />}
          </span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-hotel-line h-4"></i>دهستان :{" "}
          <span className="mr-1 font-medium text-secondary">
            {geoNames.dehestanName || <LineContentLoader />}
          </span>
        </Typography>
        <div className="my-5">
          <DividerSimple title={"درجه فعلی دهیاری"} />
        </div>
        <div className="grid grid-cols-2">
          <Typography
            fontWeight={"medium"}
            className="text-textPrimary"
            display={"flex"}
            alignItems={"center"}
            my={2}
          >
            <i className="ri-medal-line h-4"></i>درجه :{" "}
            <span className="mr-1 font-medium text-secondary">
              {details ? details.grade : "نامشخص"}
            </span>
          </Typography>
          <Typography
            fontWeight={"medium"}
            className="text-textPrimary"
            display={"flex"}
            alignItems={"center"}
            my={2}
          >
            <i className="ri-calendar-line h-4"></i>تاریخ :{" "}
            <span className="mr-1 font-medium text-secondary"></span>
          </Typography>
        </div>
        <DocumentUpload />
        <br />
        <div className="flex justify-between gap-5">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<KeyboardReturnIcon />}
            sx={{
              backgroundColor: "secondary.main",
              color: "secondary.contrastText",
              "&:hover": {
                color: "black",
              },
            }}
            onClick={handleBack}
          >
            بازگشت به کارتابل
          </Button>
        </div>
      </Grid>
    </FormProvider>
  );
};

export default UpgradeVillageInformation;
