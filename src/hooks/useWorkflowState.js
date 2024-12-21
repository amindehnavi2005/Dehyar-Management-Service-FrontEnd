import { useState } from "react";
import { toast } from "react-toastify";

const useWorkflow = (initialState = "", rejectApprovalLevel = false) => {
  const [state, setState] = useState(initialState);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleStateChange = (newState, requiresMessage = false) => {
    setState(newState);
    setError("");

    // Reset description if not required
    if (!requiresMessage) {
      setDescription("");
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    if (error && value.trim() !== "") {
      setError("");
    }
  };

  const validate = (isRejection) => {
    if (isRejection && description.trim() === "") {
      setError("توضیحات در صورت رد کردن الزامی است");
      return false;
    }
    return true;
  };

  const canReject = rejectApprovalLevel == true;

  const submitWorkflow = async (workflowId, isRejection = false) => {
    if (!validate(isRejection)) {
      return null;
    }

    try {
      // Return the state and description for the parent component to handle
      return {
        state,
        description: isRejection ? description : "",
        success: true,
      };
    } catch (error) {
      toast.error(error.message || "خطا در انجام عملیات");
      return { success: false, error };
    }
  };

  return {
    state,
    description,
    error,
    canReject,
    handleStateChange,
    handleDescriptionChange,
    submitWorkflow,
  };
};

export default useWorkflow;
