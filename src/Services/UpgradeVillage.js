const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const getVillageGradeUpgrades = () => {
  return `${BaseUrl}/village-grade-upgrades`;
};

const getPopulationVillageInformation = () => {
  return `${BaseUrl}/village-information/population`;
};

const getDivisionInformation = () => {
  return `${BaseUrl}/division-informations`;
};

const updateDivisionInformation = () => {
  return `${BaseUrl}/village-information/grade`;
};

export {
  getVillageGradeUpgrades,
  getPopulationVillageInformation,
  getDivisionInformation,
  updateDivisionInformation,
};
