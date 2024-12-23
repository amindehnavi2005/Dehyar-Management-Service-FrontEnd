import React from "react";
import Box from "@mui/material/Box";
import UserInfoItem from "../edit/Tables/UserInfoItem";
import TextField from "@mui/material/TextField";
import { convertUnixToJalali } from "@/utils/dateConverter";
import { downloadHumanResourcePdf } from "@/utils/humanResourcePdfUtils";
import Chip from "@mui/material/Chip";
import ArticleIcon from "@mui/icons-material/Article";

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
      console.log("Details => ", details);

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
              details ? convertUnixToJalali(details.execute_start) : "نامشخص"
            }
          />
          <UserInfoItem
            icon="ri-calendar-line"
            label="تاریخ اجرای قرارداد"
            value={
              details ? convertUnixToJalali(details.contract_end) : "نامشخص"
            }
          />
          <UserInfoItem
            icon="ri-wallet-2-line"
            label="مبلغ حکم کارگزینی"
            value={details.base_salary || "-"}
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
            value={
              details ? (
                <span className="text-xl font-bold">
                  {details.new_grade} → {details.current_grade}
                </span>
              ) : (
                "نامشخص"
              )
            }
          />
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
            direction: "rtl",
            "& .MuiInputBase-input": {
              textAlign: "right",
            },
            "& .MuiFormHelperText-root": {
              textAlign: "right",
            },
          }}
        />
      )}
      {renderRejectOptions()}
    </Box>
  );
};

export default ReviewDecree;
