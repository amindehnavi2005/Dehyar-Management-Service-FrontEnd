import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteEvent, selectedEvent } from "@/redux-store/slices/calendar";
import { user } from "@/Services/Auth/AuthService";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstance";

const useMunicipalityUserForm = (
  calendarStore,
  setValue,
  clearErrors,
  handleAddEventSidebarToggle,
  setLoading,
  sidebarDetails,
  setSidebarDetails
) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    nid: "",
    role: "",
    villages: [],
  });
  const resetToStoredValues = useCallback(() => {
    const event = calendarStore.selectedEvent;
    setValue("title", "");
    setValue("nid", "");
    setValues({
      title: "",
      nid: "",
      role: "",
    });
    setSidebarDetails({ status: "add", defaultValues: {} });
  }, [setValue, calendarStore.selectedEvent]);

  const resetToEmptyValues = useCallback(() => {
    setValue("title", "");
    setValue("nid", "");
    setValues({
      title: "",
      nid: "",
      role: "",
    });
  }, [setValue]);

  const handleSidebarClose = () => {
    setValues({
      title: "",
      nid: "",
      role: "",
    });
    clearErrors();
    dispatch(selectedEvent(null));
    handleAddEventSidebarToggle();
  };

  const handleDeleteButtonClick = () => {
    if (calendarStore.selectedEvent) {
      dispatch(deleteEvent(calendarStore.selectedEvent.id));
    }
    handleSidebarClose();
  };

  const onSubmit = (data) => {
    const finallyVillages = data.covered_villages
      ? data.covered_villages.map((village) =>
          String(
            typeof village === "object"
              ? village.hierarchy_code || village.village_code
              : village
          )
        )
      : [];

    let processedData = {
      nid: data.nid,
      work_group: data.role,
      geo_state:
        (data.covered_villages &&
          data.covered_villages.length &&
          data.covered_villages[0].geo_state) ||
        data.geo_state ||
        null,
      geo_city: data.geo_city || null,
      geo_region: data.geo_region || null,
      villages: finallyVillages,
      ...data,
    };

    sidebarDetails.status == "edit"
      ? api
          .put(`${user()}/${sidebarDetails.defaultValues.id}`, processedData, {
            requiresAuth: true,
          })
          .then(() => {
            toast.success("کاربر با موفقیت ویرایش شد");
            handleSidebarClose();
            setLoading(true);
          })
          .catch((error) => error)
      : api
          .post(user(), processedData, { requiresAuth: true })
          .then(() => {
            toast.success("کاربر با موفقیت ایجاد شد");
            handleSidebarClose();
            setLoading(true);
          })
          .catch((error) => error);
  };

  useEffect(() => {
    if (calendarStore.selectedEvent !== null) {
      resetToStoredValues();
    } else {
      resetToEmptyValues();
    }
  }, [resetToStoredValues, resetToEmptyValues, calendarStore.selectedEvent]);

  return {
    values,
    setValues,
    handleSidebarClose,
    handleDeleteButtonClick,
    onSubmit,
    resetToStoredValues,
  };
};

export default useMunicipalityUserForm;
