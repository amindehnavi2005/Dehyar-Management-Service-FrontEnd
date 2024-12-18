const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const getVillageGradeUpgrades = () => {
  return `${BaseUrl}/village-grade-upgrades`;
};

const getPopulationVillageInformation = () => {
  return `${BaseUrl}/population-village-information`;
};

const getDivisionInformation = () => {
  return `${BaseUrl}/division-informations`;
};

export {
  getVillageGradeUpgrades,
  getPopulationVillageInformation,
  getDivisionInformation,
};
