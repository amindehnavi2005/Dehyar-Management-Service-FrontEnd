import DividerSimple from "@/components/common/Divider/DividerSimple";
import { Box, Button, Grid, Typography } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import React, { useEffect } from "react";
import DocumentUpload from "@/Services/UploadDocument";
import { FormProvider, useForm } from "react-hook-form";
import api from "@/utils/axiosInstance";
import { getVillageGradeUpgrades } from "@/Services/UpgradeVillage";

const UpgradeVillageInformation = () => {
  const methods = useForm();
  const onSubmit = (data) => {
    // console.log(data);
  };
  useEffect(() => {
    const response = api.get(getVillageGradeUpgrades(), { requiresAuth: true });
    // console.log("Response => ", response);
  }, []);
  return (
    <FormProvider {...methods}>
      {" "}
      <Grid>
        <Typography display={"flex"} variant={"h5"} mb={5} gap={1}>
          <span>بررسی درجه بندی</span>

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
            عباس آباد
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
          <i className="ri-building-4-line h-4"></i>استان :{" "}
          <span className="font-medium text-secondary">ایلام</span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-building-2-line h-4"></i>شهرستان :{" "}
          <span className="font-medium text-secondary"></span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-building-line h-4"></i>بخش :{" "}
          <span className="font-medium text-secondary"></span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i className="ri-hotel-line h-4"></i>دهستان :{" "}
          <span className="font-medium text-secondary"></span>
        </Typography>
        <div className="my-5">
          <DividerSimple title={"درجه دهیاری"} />
        </div>
        <div className="gap-5">
          <Typography
            fontWeight={"medium"}
            className="text-textPrimary"
            display={"flex"}
            alignItems={"center"}
            my={2}
          >
            <i className="ri-medal-line h-4"></i>درجه فعلی :{" "}
            <span className="font-medium text-secondary">ایلام</span>
          </Typography>
          <Typography
            fontWeight={"medium"}
            className="text-textPrimary"
            display={"flex"}
            alignItems={"center"}
            my={2}
          >
            <i className="ri-calendar-line h-4"></i>تاریخ :{" "}
            <span className="font-medium text-secondary"></span>
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
          >
            بازگشت به کارتابل
          </Button>
        </div>
      </Grid>
    </FormProvider>
  );
};

export default UpgradeVillageInformation;
