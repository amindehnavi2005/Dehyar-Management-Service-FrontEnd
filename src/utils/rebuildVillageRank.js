import ContentLoader from "react-content-loader";

export const rebuildVillageRanks = (details) => {
  const isLoading = !details || Object.keys(details).length === 0;
  console.log("Details => ", details);
  console.log("Is Loading => ", isLoading);

  return [
    {
      id: 1,
      parameter: "جمعیت",
      year: isLoading ? (
        <ContentLoader
          speed={2}
          width={100}
          height={20}
          viewBox="0 0 100 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
        </ContentLoader>
      ) : (
        (details?.populations && details?.populations[0]?.year) || "-"
      ),
      value: (details?.populations && details?.populations[0]?.population) || 0,
      score: isLoading ? (
        <ContentLoader
          speed={2}
          width={100}
          height={20}
          viewBox="0 0 100 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
        </ContentLoader>
      ) : (
        details?.population_score || 0
      ),
    },
    {
      id: 2,
      parameter: "وسعت (هکتار)",
      year: "-",
      value: details?.area_hectares || 0,
      score: isLoading ? (
        <ContentLoader
          speed={2}
          width={100}
          height={20}
          viewBox="0 0 100 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
        </ContentLoader>
      ) : (
        details?.area_hectar_score || 0
      ),
      isValueEditing: false,
    },
    {
      id: 3,
      parameter: "درآمد (میلیون ریال)",
      year: isLoading ? (
        <ContentLoader
          speed={2}
          width={40}
          height={20}
          viewBox="0 0 40 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="40" height="20" />
        </ContentLoader>
      ) : (
        details?.incomes?.length || "-"
      ),
      value: details?.incomes?.length || "-",
      score: isLoading ? (
        <ContentLoader
          speed={2}
          width={40}
          height={20}
          viewBox="0 0 40 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="40" height="20" />
        </ContentLoader>
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
        <ContentLoader
          speed={2}
          width={100}
          height={20}
          viewBox="0 0 100 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
        </ContentLoader>
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
        <ContentLoader
          speed={2}
          width={100}
          height={20}
          viewBox="0 0 100 20"
          backgroundColor="gray"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100" height="20" />
        </ContentLoader>
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
