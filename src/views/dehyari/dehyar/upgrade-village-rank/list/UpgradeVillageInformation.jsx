"use client";
import DividerSimple from "@/components/common/Divider/DividerSimple";
import { Button, Grid, Typography } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import React, { useEffect, useState } from "react";
import DocumentUpload from "@/Services/UploadDocument";
import { FormProvider, useForm } from "react-hook-form";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { getGeoDetails } from "@/Services/CountryDivision";
import LineContentLoader from "@/components/common/LineContentLoader";
import LineInformationLoading from "@/components/loadings/InformationLoading";
import { convertUnixToJalali } from "@/utils/dateConverter";

const UpgradeVillageInformation = ({ details, userInfo, geoNames }) => {
  const methods = useForm();
  const router = useRouter();
  const isLoading = !geoNames || Object.keys(geoNames).length === 0;

  const handleBack = () => {
    router.back();
  };

  const onSubmit = (data) => {
    // console.log(data);
  };

  return (
    <FormProvider {...methods}>
      {" "}
      <Grid>
        <Typography
          display={"flex"}
          variant={"h6"}
          mb={5}
          gap={1}
          justifyContent={"center"}
        >
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
            <span className="mr-1 font-medium text-secondary">
              {convertUnixToJalali(details?.grade_date)}
            </span>
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
