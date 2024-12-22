import api from "@utils/axiosInstance";
import {
  ChangeStateSalaries,
  ChangeStateWorkflowForUpgradeVillage,
} from "@/Services/humanResources";

export const changeStateWorkflow = (humanResourceId, state, message) => {
  const data = {
    state: state,
    comments: message,
  };
  return api.post(ChangeStateSalaries(humanResourceId), data, {
    requiresAuth: true,
  });
};

export const changeStateWorkflowForUpgradeVillageRank = (
  id,
  state,
  message
) => {
  const data = {
    state: state,
    comments: message,
  };
  console.log("Data => ", data);
  return api.post(ChangeStateWorkflowForUpgradeVillage(id), data, {
    requiresAuth: true,
  });
};
