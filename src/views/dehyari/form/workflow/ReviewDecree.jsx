import React from "react";
import Box from "@mui/material/Box";
import UserInfoItem from "../edit/Tables/UserInfoItem";
import TextField from "@mui/material/TextField";
import { convertUnixToJalali } from "@/utils/dateConverter";
import { downloadHumanResourcePdf } from "@/utils/humanResourcePdfUtils";
import Chip from "@mui/material/Chip";
import ArticleIcon from "@mui/icons-material/Article";
import { Button, Typography } from "@mui/material";
import CustomIconButton from "@/@core/components/mui/IconButton";

const ReviewDecree = ({
  details,
  rejectApprovalLevel,
  description,
  error,
  handleDescriptionChange,
  renderRejectOptions,
  readOnly,
  workflowType = "حکم کارگزینی",
}) => {
  const handleDownloadPdf = () => {
    downloadHumanResourcePdf(
      details.human_resource_id,
      details.human_contract_id
    );
  };

  const renderFields = () => {
    if (workflowType === "حکم کارگزینی") {
      return (
        <>
          <UserInfoItem
            icon="ri-government-line"
            label="پست سازمانی"
            value={details ? details?.job_type : "نامشخص"}
          />
          <UserInfoItem
            icon="ri-community-line"
            label="دهیاری"
            value={details ? details?.village?.approved_name : "نامشخص"}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserInfoItem
              icon="ri-file-line"
              label="نوع قرارداد"
              value={
                details ? `${details?.contract_type} روز کارکرد` : "نامشخص"
              }
            />
            {details && (
              <Chip
                icon={<ArticleIcon />}
                label="حکم کارگزینی"
                color="primary"
                onClick={handleDownloadPdf}
                sx={{ cursor: "pointer" }}
                size="small"
              />
            )}
          </Box>
          <UserInfoItem
            icon="ri-calendar-line"
            label="تاریخ شروع قرارداد"
            value={
              details ? convertUnixToJalali(details?.contract_start) : "نامشخص"
            }
          />
          <UserInfoItem
            icon="ri-calendar-line"
            label="تاریخ اجرای قرارداد"
            value={
              details ? convertUnixToJalali(details?.execute_start) : "نامشخص"
            }
          />
          <UserInfoItem
            icon="ri-wallet-2-line"
            label="مبلغ حکم کارگزینی"
            value={
              `${
                details
                  ? details?.salary_benefits
                  : // .toLocaleString("fa-IR")
                    "نامشخص"
              } ریال` || "نامشخص"
            }
          />
        </>
      );
    } else if (workflowType === "ارتقاء درجه") {
      return (
        <>
          <UserInfoItem
            icon="ri-map-pin-line"
            label="استان"
            value={details ? details.geo_state : "نامشخص"}
          />
          <UserInfoItem
            icon="ri-map-pin-2-line"
            label="شهرستان"
            value={details ? details.geo_city : "نامشخص"}
          />
          <UserInfoItem
            icon="ri-building-line"
            label="بخش"
            value={details ? details.geo_region : "نامشخص"}
          />
          <UserInfoItem
            icon="ri-home-2-line"
            label="دهستان"
            value={details ? details.geo_village : "نامشخص"}
          />
          <UserInfoItem
            icon="ri-arrow-down-s-line"
            label="نوع درخواست"
            value={details ? details.request_type : "نامشخص"}
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                mb: -3,
              }}
            >
              تاریخچه درجه‌بندی
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              sx={{
                position: "relative",
                width: "100%",
              }}
            >
              <div className="grid items-center rounded-full w-10 h-10 border text-center font-bold">
                {details.current_grade}
              </div>
              <Box
                sx={{
                  height: "2px",
                  width: "125px",
                  background: "#ccc",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "-4px",
                    right: "-10px",
                    width: "0",
                    height: "0",
                    borderLeft: "10px solid #ccc",
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                  }}
                />
              </Box>
              <div className="grid items-center rounded-full w-10 h-10 border text-center font-bold mr-2">
                {details.new_grade}
              </div>
            </Box>
          </Box>
        </>
      );
    }
  };

  return (
    <Box className={"flex flex-col gap-3"}>
      {renderFields()}
      {rejectApprovalLevel > 0 && !readOnly && (
        <TextField
          fullWidth
          multiline
          rows={4}
          label="توضیحات"
          placeholder="لطفا دلیل رد درخواست را وارد کنید"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          error={!!error}
          helperText={
            error || "در صورت رد درخواست، وارد کردن توضیحات الزامی است"
          }
          required
          disabled={readOnly}
          sx={{
            mt: 2,
            direction: "ltr",
            textAlign: "left",
            "& .MuiInputBase-input": {
              textAlign: "left",
            },
            "& .MuiFormHelperText-root": {
              textAlign: "left",
            },
            "& .MuiInputLabel-root": {
              direction: "rtl",
            },
          }}
        />
      )}
      {renderRejectOptions()}
    </Box>
  );
};

export default ReviewDecree;
