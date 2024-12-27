import LineContentLoader from "@/components/common/LineContentLoader";
import ContentLoader from "react-content-loader";

export const rebuildVillageRanks = (details) => {
  const isLoading = !details || Object.keys(details).length === 0;

  return [
    {
      id: 1,
      parameter: "جمعیت",
      year: isLoading ? (
        <LineContentLoader />
      ) : (
        (details?.populations && details?.populations[0]?.year) || "-"
      ),
      value: (details?.populations && details?.populations[0]?.population) || 0,
      score: isLoading ? <LineContentLoader /> : details?.population_score || 0,
    },
    {
      id: 2,
      parameter: "وسعت (هکتار)",
      year: "-",
      value: details?.area_hectares || 0,
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        details?.area_hectar_score || 0
      ),
      isValueEditing: false,
    },
    {
      id: 3,
      parameter: "درآمد (میلیون ریال)",
      year: isLoading ? <LineContentLoader /> : details?.incomes?.length || "-",
      value: details?.incomes?.length || "-",
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        details?.income_per_capita_score || 0
      ),
      isYearEditing: false,
      isValueEditing: false,
    },
    {
      id: 4,
      parameter: "هدف گردشگری",
      year: "-",
      value: details?.tourism_goal === 1,
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        details?.tourism_goal_score || 0
      ),
    },
    {
      id: 5,
      parameter: "مرکز دهستان",
      year: "-",
      value: details?.centralization === 1,
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        details?.centralization_score || 0
      ),
    },
    {
      id: 6,
      parameter: "مرکز بخش",
      year: "-",
      value: details?.city_grade === 1,
      score: 0,
    },
  ];
};
