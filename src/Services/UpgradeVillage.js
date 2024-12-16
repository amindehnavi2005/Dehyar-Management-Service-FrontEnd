const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const getVillageGradeUpgrades = () => {
  return `${BaseUrl}/village_grade_upgrades`;
};

const getPopulationVillageInformation = () => {
  return `${BaseUrl}/population_village_information`;
};

const getDivisionInformation = () => {
  return `${BaseUrl}/division_informations`;
};

export {
  getVillageGradeUpgrades,
  getPopulationVillageInformation,
  getDivisionInformation,
};
