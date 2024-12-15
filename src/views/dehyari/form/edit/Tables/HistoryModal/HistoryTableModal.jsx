import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  Modal,
  Step,
  StepLabel,
  Stepper,
  Typography,
  IconButton,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import StepOneFields from "./StepOneFields";
import StepTwoFields from "./StepTwoFields";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { HumanContract } from "@/Services/humanResources";
import { toast } from "react-toastify";
import HumanContractDTO from "@/utils/HumanContractDTO";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  paddingTop: 6,
  paddingLeft: 6,
  paddingRight: 6,
  borderRadius: 3,
};

const validationSchemas = {
  jobTitle: {
    required: "پست سازمانی الزامی است",
  },
  contractStart: {
    required: "تاریخ شروع قرارداد الزامی است",
  },
  contractEnd: {
    required: "تاریخ پایان قرارداد الزامی است",
  },
  currentJob: {
    required: "شغل فعلی الزامی است",
  },
  titleContract: {
    required: "عنوان قرارداد الزامی است",
  },
  descriptionContract: {
    required: "شرح قرارداد الزامی است",
  },
  appointmentDate: {
    required: "تاریخ انتصاب الزامی است",
  },
  coveredVillages: {
    required: "انتخاب دهیاری‌های تحت پوشش الزامی است",
  },
  contractExecute: {
    required: "تاریخ اجرا الزامی است",
  },
};

const steps = ["ساختار تشکیلاتی", "اطلاعات قرارداد"];

const HistoryTableModal = ({
  open,
  loading,
  setLoading,
  handleClose,
  refreshData,
  mode,
  editId,
}) => {
  const [activeStep, setActiveStep] = useState(0); // Initialize step state
  const today = new DateObject({ calendar: persian, locale: persian_fa });
  const firstDayOfYear = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: today.year,
    month: 1,
    day: 1,
  });
  const lastDayOfYear = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: today.year,
    month: 12,
    day: 29,
  });
  const methods = useForm({
    defaultValues: {
      contractStart: firstDayOfYear.unix,
      contractEnd: lastDayOfYear.unix,
      contractExecute: today.unix,
    },
  });

  useEffect(() => {
    if (open === false) {
      // Reset the form and stepper state when the modal is closed
      methods.reset(); // Reset form data
      setActiveStep(0); // Reset stepper to first step
    }
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && editId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${HumanContract()}/show/${editId}`,
            {
              headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
            }
          );
          const mappedData = {
            contractStart: response.data.contract_start,
            contractType: response.data.contract_type,
            contractEnd: response.data.contract_end,
            contractExecute: response.data.execute_start,
            appointmentDate: response.data.appointment_date,
            descriptionContract: response.data.description_contract,
            titleContract: response.data.title_contract,
            jobTitle: response.data.job_type_id,
            currentJob: response.data.main_work,
            coveredVillages: response.data.cover_villages.map(
              (village) => village.village_code
            ),
            villageEmployer: response.data.village_employer,
          };
          console.log("Mapped Data => ", mappedData);

          methods.reset(mappedData); // Populate the form with fetched data
        } catch (error) {
          toast.error("خطا در دریافت اطلاعات");
        }
      };
      fetchData();
    }
  }, [editId, mode]);

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const queryParams = new URLSearchParams(window.location.search);
  const param = queryParams.get("param");
  const handleSubmit = async (formData) => {
    setLoading(true);
    const dto = HumanContractDTO.fromForm(formData, param);
    try {
      let response;
      if (mode === "edit") {
        // Edit mode: send PUT request to update
        response = await axios.put(`${HumanContract()}/update/${editId}`, dto, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        });
        toast.success("قرارداد با موفقیت ویرایش شد");
      } else {
        response = await axios.post(HumanContract(), dto, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        });
        toast.success("قرارداد با موفقیت ثبت شد");
      }
      methods.reset(); // Reset form after submission
      handleClose(); // Close modal after submission
      refreshData(); // Refresh data
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        Object.keys(error.response.data.errors).forEach((key) => {
          toast.error(error.response.data.errors[key][0]);
        });
      } else {
        toast.error("خطا در ثبت اطلاعات");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="stepper-modal-title"
      aria-describedby="stepper-modal-description"
      open={open}
      onClose={null} // Prevent closing the modal by clicking outside
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '20px' }}>
                    {mode === 'edit' ? 'ویرایش قرارداد' : 'ثبت اطلاعات حکم کارگزینی'}
                </Typography> */}

        <Stepper
          activeStep={activeStep}
          sx={{ width: "50%", margin: "0 auto", paddingBottom: "16px" }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {activeStep === 0 && (
              <StepOneFields validation={validationSchemas} mode={mode} />
            )}
            {activeStep === 1 && (
              <StepTwoFields validation={validationSchemas} />
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", pt: 7 }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                بازگشت
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  activeStep === steps.length - 1
                    ? methods.handleSubmit(handleSubmit)
                    : handleNext
                }
                disabled={loading}
              >
                {loading
                  ? "در حال ارسال..."
                  : activeStep === steps.length - 1
                    ? mode === "edit"
                      ? "ویرایش"
                      : "اتمام"
                    : "بعدی"}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default HistoryTableModal;
