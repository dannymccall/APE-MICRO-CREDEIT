import React from "react";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";

const DashboardUI = ({ route }: { route: string }) => {
  const breadcrumbsLinks = [{ name: "Dashboard", href: "/dashboard" }];
  return (
    <div>
      <InfoHeaderComponent route={route} links={breadcrumbsLinks} />
    </div>
  );
};

export default DashboardUI;
