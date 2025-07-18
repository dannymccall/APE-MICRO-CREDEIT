"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import QuickAccess from "@/app/component/QuickAccess";
export interface IInfoHeader {
  name: string;
  href: string;
}

const InfoHeader = ({
  route,
  links,
  title,
  onClick,
}: {
  route: string;
  links: IInfoHeader[];
  title: string;
  onClick: () => void;
}) => {
  const pathName = usePathname();
  const isActive = (href: string) => pathName === href;

  return (
    <div className="flex justify-between items-center bg-violet-800 shadow-md p-1">
      <div className="flex w-full flex-row gap-5  items-center phone:justify-between desktop:justify-start laptop:justify-start tablet:justify-start">
        <h1 className="font-sans font-semibold text-lg text-slate-50">
          {route}
        </h1>
        {pathName !== "/dashboard" && (
          <QuickAccess title={title} onClick={onClick} />
        )}
      </div>
      <div className="breadcrumbs text-slate-50 w-full relative text-sm phone:hidden desktop:block laptop:block tablet:hidden">
        <ul className="float-right mr-3">
          {links.map((link) => {
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`text-slate-50
                    ${isActive(link.href)
                      ? " text-slate-50 font-semibold"
                      : "hover:text-violet-300 no-underline text-violet-200"}`
                  }
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InfoHeader;
