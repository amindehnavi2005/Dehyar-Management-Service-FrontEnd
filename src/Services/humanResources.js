const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const humanResources = () => {
  return `${BaseUrl}/human-resources`;
};
const GetHumanResource = (id) => {
  return `${BaseUrl}/human-resources/findByIdOrNid/${id}`;
};
const GetHumanResourcesForCfo = () => {
  return `${BaseUrl}/cfo/covered-villages`;
};
const GetHumanCoverdVillageForCfo = () => {
  return `${BaseUrl}/cfo/village-statuses`;
};
const GetHumanResourcesForBakhshdar = () => {
  return `${BaseUrl}/bakhshdar/villages-by-region`;
};
const GetHumanResourcesForGovernor = () => {
  return `${BaseUrl}/governor/villages-by-state`;
};
const GetFieldStudy = () => {
  return `${BaseUrl}/education-fields`;
};
const GetJobTitles = () => {
  return `${BaseUrl}/job-titles`;
};

const DownloadHumanResourcePdf = () => {
  return `${BaseUrl}/human-resources/download`;
};
const HumanContract = () => {
  return `${BaseUrl}/human-contract`;
};

const InsuranceHistory = () => {
  return `${BaseUrl}/insurance-history`;
};

const ChangeStateSalaries = (id) => {
  return `${BaseUrl}/salaries/${id}/change-state`;
};

const ChangeStateWorkflowForUpgradeVillage = (id) => {
  return `${BaseUrl}/village-grade-upgrades/${id}/change-state`;
};

export {
  humanResources,
  GetHumanResource,
  GetHumanResourcesForCfo,
  GetHumanResourcesForBakhshdar,
  GetHumanResourcesForGovernor,
  GetHumanCoverdVillageForCfo,
  GetJobTitles,
  GetFieldStudy,
  DownloadHumanResourcePdf,
  HumanContract,
  InsuranceHistory,
  ChangeStateSalaries,
  ChangeStateWorkflowForUpgradeVillage,
};
