import LineContentLoader from "@/components/common/LineContentLoader";

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
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        Math.round(details?.population_score || 0)
      ),
    },
    {
      id: 2,
      parameter: "وسعت (هکتار)",
      year: "-",
      value: details?.area_hectares || 0,
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        Math.round(details?.area_hectar_score || 0)
      ),
      isValueEditing: false,
    },
    {
      id: 3,
      parameter: "درآمد (میلیون ریال)",
      year: isLoading ? (
        <LineContentLoader />
      ) : (
        (details?.incomes && details?.incomes[0]?.year) || "-"
      ),
      value:
        (details?.incomes &&
          Math.round(details?.incomes[0]?.income_per_capital)) ||
        "-",
      score: isLoading ? (
        <LineContentLoader />
      ) : (
        Math.round(details?.income_per_capita_score || 0)
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
        Math.round(details?.tourism_goal_score || 0)
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
        Math.round(details?.centralization_dehestan_score || 0)
      ),
    },
    {
      id: 6,
      parameter: "مرکز بخش",
      year: "-",
      value: details?.centralization === 2,
      score: Math.round(details?.centralization_bakhsh_score || 0),
    },
  ];
};
