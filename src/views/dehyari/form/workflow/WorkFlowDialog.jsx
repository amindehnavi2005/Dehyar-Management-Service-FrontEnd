"use client";
import {
  Button,
  Drawer,
  DialogActions,
  DialogContent,
  Collapse,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomIconButton from "@core/components/mui/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DividerSimple from "@components/common/Divider/DividerSimple";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import UserInfoItem from "../edit/Tables/UserInfoItem";
import { changeStateWorkflow } from "@/utils/workflowService";
import { toast } from "react-toastify";
import CustomTextField from "@/@core/components/custom-inputs/CustomTextField";
import { useForm } from "react-hook-form";
import { convertUnixToJalali } from "@/utils/dateConverter";
import useWorkflow from "@/hooks/useWorkflowState";
import RequestHistory from "./RequestHistory";
import ReviewDecree from "./ReviewDecree";
import TabContent from "@/components/common/Tabs/TabContent";
import AnimatedTabs from "@/components/common/Tabs/AnimatedTabs";
import Typography from "@mui/material/Typography";
import { getHistoryWorkflow } from "@/Services/Salary";
import api from "@/utils/axiosInstance";
import moment from "moment-jalaali";

const WorkFlowDrawer = ({
  open,
  setDialogOpen,
  details,
  rejectApprovalLevel = 0,
  loading,
  setLoading,
  nextState,
  readOnly = false,
}) => {
  const [showRejectOptions, setShowRejectOptions] = useState(false);
  const [selectedRejectType, setSelectedRejectType] = useState(null);
  const [activeTab, setActiveTab] = useState("review");
  const [historyData, setHistoryData] = useState([]);

  const {
    state,
    description,
    error,
    canReject,
    handleStateChange,
    handleDescriptionChange,
    submitWorkflow,
  } = useWorkflow("", (rejectApprovalLevel == 0 && false) || true);

  const handleClose = () => {
    setDialogOpen(false);
    setShowRejectOptions(false);
    setSelectedRejectType(null);
    handleStateChange("", false);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await changeStateWorkflow(details.salary_id, nextState, description);
      const fullName = `${details.first_name || ""} ${details.last_name || ""}`;

      if (rejectApprovalLevel === 2) {
        toast.success(`حکم کارگزینی ${fullName} تایید نهایی شد.`);
      } else {
        toast.success(`عملیات با موفقیت انجام شد`);
      }

      handleClose();
    } catch (err) {
      toast.error(err.message || "خطا در انجام عملیات");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRejectType && rejectApprovalLevel === 2) {
      toast.error("لطفا نوع رد درخواست را انتخاب کنید");
      return;
    }

    setLoading(true);
    try {
      const result = await submitWorkflow(details.salary_id, true);
      const fullName = `${details.first_name || ""} ${details.last_name || ""}`;
      if (result.success) {
        const rejectState =
          rejectApprovalLevel === 2
            ? selectedRejectType
            : "rejected_to_financial_officer";
        await changeStateWorkflow(
          details.salary_id,
          rejectState,
          result.description
        );

        if (rejectState === "rejected_to_supervisor") {
          toast.success(
            `حکم کارگزینی ${fullName} به بخشدار مربوطه جهت اصلاح بازگشت داده شد.`
          );
        } else if (rejectState === "rejected_to_financial_officer") {
          toast.success(
            `حکم کارگزینی ${fullName} به مسئول امور مالی مربوطه جهت اصلاح بازگشت داده شد.`
          );
        }

        handleClose();
      }
    } catch (err) {
      toast.error("توضیحات را وارد نمایید" || "خطا در انجام عملیات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (details) {
      const fetchData = async () => {
        try {
          const response = await api.get(
            getHistoryWorkflow(details.salary_id),
            { requiresAuth: true }
          );

          // Sort data from newest to oldest
          const sortedData = response.data.sort(
            (firstDate, lastDate) =>
              moment(lastDate.started_at).valueOf() -
              moment(firstDate.started_at).valueOf()
          );
          setHistoryData(sortedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [details]);

  const renderRejectOptions = () => {
    if (!showRejectOptions) return null;

    // For rejectedLevel 0, we don't show any rejection options
    if (rejectApprovalLevel === 0 || rejectApprovalLevel === 1) return null;

    // For rejectedLevel 2, keep the current implementation with both options
    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              size="small"
              fullWidth
              variant="contained"
              color="error"
              onClick={async () => {
                if (!description) {
                  toast.error("لطفا توضیحات را وارد کنید");
                  return;
                }
                setLoading(true);
                try {
                  await changeStateWorkflow(
                    details.salary_id,
                    "rejected_to_financial_officer",
                    description
                  );
                  toast.success("عملیات با موفقیت انجام شد");
                  handleClose();
                } catch (err) {
                  toast.error(err.message || "خطا در انجام عملیات");
                } finally {
                  setLoading(false);
                }
              }}
            >
              عدم تایید و بازگشت به مسئول مالی
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              size="small"
              fullWidth
              variant="contained"
              color="error"
              onClick={async () => {
                if (!description) {
                  toast.error("لطفا توضیحات را وارد کنید");
                  return;
                }
                setLoading(true);
                try {
                  await changeStateWorkflow(
                    details.salary_id,
                    "rejected_to_supervisor",
                    description
                  );
                  toast.success("عملیات با موفقیت انجام شد");
                  handleClose();
                } catch (err) {
                  toast.error(err.message || "خطا در انجام عملیات");
                } finally {
                  setLoading(false);
                }
              }}
            >
              عدم تایید و بازگشت به بخشداری
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const getApprovalButtonText = () => {
    switch (rejectApprovalLevel) {
      case 0:
        return "تایید اطلاعات و ارسال به بخشداری";
      case 1:
        return "تایید اطلاعات و ارسال به استانداری";
      case 2:
        return "تایید نهایی";
      default:
        return "تایید";
    }
  };

  const getRejectionButtonText = () => {
    switch (rejectApprovalLevel) {
      case 0:
        return null; // No rejection button for level 0
      case 1:
        return "عدم تایید حکم";
      default:
        return "رد درخواست";
    }
  };

  const tabs = [
    { label: "بررسی حکم", value: "review" },
    {
      avatar: historyData?.length || 0,
      label: "سوابق درخواست",
      value: "history",
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        setShowRejectOptions(false);
        handleClose();
      }}
      PaperProps={{
        sx: { width: 350 },
      }}
    >
      <div className={"flex w-full justify-end px-5 py-2"}>
        <Tooltip title="بستن" placement={"top"}>
          <CustomIconButton
            onClick={() => handleClose()}
            className={"rounded-full"}
          >
            <i className="ri-close-line" />
          </CustomIconButton>
        </Tooltip>
      </div>
      <DividerSimple
        title={
          <Typography component="span">
            حکم کارگزینی{" "}
            <Typography
              component="span"
              sx={{ fontWeight: 700 }}
              display="inline"
            >
              {details?.first_name || ""} {details?.last_name || ""}
            </Typography>
          </Typography>
        }
      />
      <Box className={"w-full flex justify-center"}>
        <AnimatedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Box>
      <DialogContent>
        <TabContent active={activeTab === "review"}>
          <ReviewDecree
            details={details}
            rejectApprovalLevel={rejectApprovalLevel}
            description={description}
            error={error}
            handleDescriptionChange={handleDescriptionChange}
            renderRejectOptions={renderRejectOptions}
            readOnly={readOnly}
          />
        </TabContent>
        <TabContent active={activeTab === "history"}>
          <RequestHistory details={details} history={historyData} />
        </TabContent>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 5, pb: 3 }}>
        {!readOnly && (
          <>
            {(!showRejectOptions || rejectApprovalLevel !== 2) &&
              activeTab == "review" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={loading}
                >
                  {getApprovalButtonText()}
                </Button>
              )}
            {(!showRejectOptions || rejectApprovalLevel !== 2) &&
              activeTab == "review" &&
              getRejectionButtonText() && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (rejectApprovalLevel === 1) {
                      handleReject();
                    } else {
                      setShowRejectOptions(true);
                      handleStateChange("rejected", true);
                    }
                  }}
                  disabled={loading}
                >
                  {getRejectionButtonText()}
                </Button>
              )}
          </>
        )}
      </DialogActions>
    </Drawer>
  );
};

export default WorkFlowDrawer;
