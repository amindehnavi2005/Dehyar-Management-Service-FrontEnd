import React from "react";
import ContentLoader from "react-content-loader";

const LineInformationLoading = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      backgroundColor="#ccc"
      foregroundColor="#ecebeb"
    >
      <rect x="25%" y="56" rx="3" ry="3" width="50%" height="6" />
      <rect x="75%" y="106" rx="3" ry="3" width="25%" height="6" />
      <rect x="75%" y="136" rx="3" ry="3" width="25%" height="6" />
      <rect x="75%" y="166" rx="3" ry="3" width="25%" height="6" />
      <rect x="75%" y="196" rx="3" ry="3" width="25%" height="6" />
      <rect x="75%" y="280" rx="3" ry="3" width="25%" height="6" />
      <rect x="25%" y="280" rx="3" ry="3" width="25%" height="6" />
    </ContentLoader>
  );
};

export default LineInformationLoading;
