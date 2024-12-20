export const translateContractState = (state) => {
  switch (state) {
    case "draft":
      return {
        title: "پیش نویس",
        color: "info",
      };
    case "pending_supervisor":
      return {
        title: "در انتظار تایید بخشدار",
        color: "warning",
      };
    case "approved_by_supervisor":
      return {
        title: "تایید شده توسط بخشدار",
        color: "primary",
      };
    case "rejected_by_supervisor":
      return {
        title: "رد شده توسط بخشدار",
        color: "error",
      };
    case "pending_governor":
      return {
        title: "در انتظار تایید استانداری",
        color: "primary",
      };
    case "approved":
      return {
        title: "تایید شده",
        color: "success",
      };
    case "rejected_to_supervisor":
      return {
        title: "بازگشت به بخشدار",
        color: "error",
      };
    case "rejected_to_financial_officer":
      return {
        title: "نیازمند اصلاح مجدد",
        color: "error",
      };
    default:
      return {
        title: "نامشخص",
        color: "error",
      };
  }
};

export const translateContractStateForHistory = (state) => {
  switch (state) {
    //   case "draft":
    //     return {
    //       title: "پیش نویس",
    //       color: "info",
    //     };
    case "pending_supervisor":
      return {
        title: "ارسال به بخشدار",
        color: "info",
      };
    case "approved_by_supervisor":
      return {
        title: "تایید شده توسط بخشدار",
        color: "primary",
      };
    case "rejected_by_supervisor":
      return {
        title: "رد شده توسط بخشدار",
        color: "error",
      };
    case "pending_governor":
      return {
        title: "ارسال  به استانداری",
        color: "warning",
      };
    case "approved":
      return {
        title: "تایید حکم کارگزینی",
        color: "success",
      };
    case "rejected_to_supervisor":
      return {
        title: "بازگشت به بخشدار جهت اصلاح",
        color: "error",
      };
    case "rejected_to_financial_officer":
      return {
        title: "بازگشت به مسئول مالی جهت اصلاح",
        color: "error",
      };
    default:
      return {
        title: "نامشخص",
        color: "error",
      };
  }
};
