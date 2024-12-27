import React from "react";
import ContentLoader from "react-content-loader";

const LineContentLoader = () => {
  return (
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
  );
};

export default LineContentLoader;
