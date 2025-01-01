import InfoHeader from "@/app/ui/info/Info-Header";
import React from "react";
import { IInfoHeader } from "@/app/ui/info/Info-Header";

const InfoHeaderComponent = ({
  route,
  links,
  title,
  onClick
}: {
  route: string;
  links: IInfoHeader[];
 title: string,
  onClick: () => void
}) => {
  return <InfoHeader route={route} links={links} title={title} onClick={onClick}/>;
};

export default InfoHeaderComponent;
