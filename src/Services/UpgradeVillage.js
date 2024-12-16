const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

getVillageGradeUpgrades = () => {
  return `${BaseUrl}/village_grade_upgrades`;
};

getPopulationVillageInformation = () => {
  return `${BaseUrl}/population_village_information`;
};

getDivisionInformation = () => {
  return `${BaseUrl}/division_informations`;
};

export {
  getVillageGradeUpgrades,
  getPopulationVillageInformation,
  getDivisionInformation,
};
