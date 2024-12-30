import api from "@/utils/axiosInstance";
import { getGeoDetails } from "@/Services/CountryDivision";

export const fetchGeoDetails = async ({
  geoState,
  geoCity,
  geoRegion,
  geoDehestan,
  geoVillage,
}) => {
  if (!geoState && !geoCity && !geoRegion && !geoDehestan && !geoVillage) {
    return {
      stateName: "",
      cityName: "",
      regionNames: [],
      dehestanName: "",
      villageName: "",
    };
  }

  try {
    const geoDetails = [
      { geo_type: "state", geo_code: `${geoState}` },
      { geo_type: "city", geo_code: `${geoCity}` },
      ...(Array.isArray(geoRegion)
        ? geoRegion.map((region) => ({
            geo_type: "region",
            geo_code: region.toString(),
          }))
        : geoRegion
          ? [{ geo_type: "region", geo_code: geoRegion.toString() }]
          : []),
      { geo_type: "dehestan", geo_code: `${geoDehestan}` },
      { geo_type: "village", geo_code: `${geoVillage}` },
    ].filter((item) => item.geo_code && item.geo_code !== "undefined");

    const geoResponse = await api.post(
      getGeoDetails(),
      { geo_data: geoDetails },
      { requiresAuth: true }
    );
    const geoData = geoResponse.data;

    return {
      stateName:
        geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoState
        )?.info[0]?.approved_name || "",
      cityName:
        geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoCity
        )?.info[0]?.approved_name || "",
      regionNames: Array.isArray(geoRegion)
        ? geoRegion.map((region) => {
            const info = geoData.find(
              (geo) => geo.info.length && geo.info[0].hierarchy_code == region
            );
            return info?.info[0]?.approved_name || region;
          })
        : geoRegion
          ? [
              geoData.find(
                (geo) =>
                  geo.info.length && geo.info[0].hierarchy_code == geoRegion
              )?.info[0]?.approved_name || geoRegion,
            ]
          : [],
      dehestanName:
        geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoDehestan
        )?.info[0]?.approved_name || "",
      villageName:
        geoData.find(
          (geo) => geo.info.length && geo.info[0].hierarchy_code === geoVillage
        )?.info[0]?.approved_name || "",
    };
  } catch (error) {
    console.error("Error fetching geo details:", error);
    return {
      stateName: "",
      cityName: "",
      regionNames: [],
      dehestanName: "",
      villageName: "",
    };
  }
};
