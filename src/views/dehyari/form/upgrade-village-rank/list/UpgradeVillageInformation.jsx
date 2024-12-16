import DividerSimple from "@/components/common/Divider/DividerSimple";
import { Box, Button, Grid, Typography } from "@mui/material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import React from "react";

const UpgradeVillageInformation = () => {
  return (
    <Grid>
      <Typography variant="h5" textAlign={"center"}>
        بررسی درجه دهیاری{" "}
        <span className="font-bold text-primary">عباس آباد</span>
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
      <div className="flex gap-5">
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i class="ri-medal-line h-4"></i>درجه فعلی :{" "}
          <span className="font-medium text-secondary">ایلام</span>
        </Typography>
        <Typography
          fontWeight={"medium"}
          className="text-textPrimary"
          display={"flex"}
          alignItems={"center"}
          my={2}
        >
          <i class="ri-calendar-line h-4"></i>تاریخ :{" "}
          <span className="font-medium text-secondary"></span>
        </Typography>
      </div>
      <Typography
        fontWeight={"medium"}
        className="text-textPrimary"
        display={"flex"}
        alignItems={"center"}
        my={2}
      >
        <i class="ri-verified-badge-line h-4"></i>درجه نهایی :{" "}
        <span className="font-medium text-secondary"></span>
      </Typography>
      <div className="flex justify-between gap-5">
        <Button variant="contained" color="primary">
          ذخیره و ارسال درخواست ارتقاء رتبه
        </Button>
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
  );
};

export default UpgradeVillageInformation;
