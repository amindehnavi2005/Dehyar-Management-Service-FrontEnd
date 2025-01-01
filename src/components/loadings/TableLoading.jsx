import React from "react";
import ContentLoader from "react-content-loader";

const TableLoading = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      backgroundColor="#ccc"
      foregroundColor="#ecebeb"
    >
      <rect x="3" y="3" rx="10" ry="10" width="100%" height="80%" />
    </ContentLoader>
  );
};

export default TableLoading;
