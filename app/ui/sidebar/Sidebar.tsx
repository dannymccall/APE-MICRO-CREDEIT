"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiSettings,
  FiUsers,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import ImageIcon from "@/public/icon.png";
import OnlineIcon from "@/public/online.png";
import Image from "next/image";
import { RxDashboard } from "react-icons/rx";
import { useLogginIdentity } from "@/app/lib/customHooks";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaCodeBranch } from "react-icons/fa6";

// Define the type for sidebar links
interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  subLinks?: SidebarLink[];
}

export default function Sidebar() {
  const pathName = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Sidebar links configuration
    const logginIdentity = useLogginIdentity();
  
  const sidebarLinks: SidebarLink[] = [
    { name: "Dashboard", href: "/dashboard", icon: RxDashboard },
    {
      name: "Staff",
      href: "#",
      icon: FiUsers,
      subLinks: [
        { name: "Add staff", href: "/addUser", icon: FiChevronRight },
        { name: "Manage staff", href: "/manage-user", icon: FiChevronRight },
      ],
    },
    {
      name: "Clients",
      href: "#",
      icon: PiUsersThreeBold,
      subLinks: [
        { name: "Add client", href: "/add-client", icon: FiChevronRight },
        { name: "Manage client", href: "/manage-client", icon: FiChevronRight },
      ],
    },
    {
      name: "Branches",
      href: "#",
      icon: FaCodeBranch,
      subLinks: [
        { name: "Add branch", href: "/add-branch", icon: FiChevronRight },
        { name: "Manage branch", href: "/manage-branch", icon: FiChevronRight },
      ],
    },
    { name: "Settings", href: "/settings", icon: FiSettings },
  ];

  // Function to toggle the submenu
  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Function to check if a link is active
  const isActive = (href: string) => pathName === href;

  return (
    <div className="min-h-screen bg-violet-700 text-white w-1/5 flex flex-col">
      {/* Sidebar Header */}
      <div className="bg-violet-900 p-4 text-xl font-bold border-b border-violet-500 mb-7">
        <div className="flex flex-row gap-3 w-full items-center  font-mono my-3"></div>
        <div className="flex flex-col gap-5 items-center justify-center">
          {/* <Image src={OnlineIcon} alt="online-icon" /> */}
          <h1 className="font-mono">APE MCICRO CREDIT</h1>
          <div className="flex flex-col items-center gap-2">
            <div className="w-36 h-36 bg-slate-100 rounded-full"></div>
            <div className="flex flex-col justify-center items-center">
              <h1 className="font-semibold font-sans">{logginIdentity && logginIdentity.fullName }</h1>
              <h1 className="font-normal text-sm text-gray-300">
                Loan Officer
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              {/* Main Links */}
              {!link.subLinks ? (
                <Link
                  href={link.href}
                  className={`flex items-center space-x-2 p-2 rounded-md transition-all ${
                    isActive(link.href)
                      ? "bg-white text-violet-700 font-semibold"
                      : "hover:bg-violet-600"
                  }`}
                >
                  <link.icon />
                  <span>{link.name}</span>
                </Link>
              ) : (
                <>
                  {/* Links with Sublinks */}
                  <button
                    onClick={() => toggleMenu(link.name)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-violet-600 transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <link.icon />
                      <span>{link.name}</span>
                    </div>
                    {openMenus[link.name] ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </button>

                  {/* Sublinks */}
                  {openMenus[link.name] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {link.subLinks.map((subLink) => (
                        <li key={subLink.name}>
                          <Link
                            href={subLink.href}
                            className={`flex items-center space-x-2 p-2 rounded-md transition-all ${
                              isActive(subLink.href)
                                ? "bg-white text-violet-700 font-semibold"
                                : "hover:bg-violet-600"
                            }`}
                          >
                            <subLink.icon />
                            <span>{subLink.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-violet-500">
        <p className="text-sm">© 2024 My Company</p>
      </div>
    </div>
  );
}
