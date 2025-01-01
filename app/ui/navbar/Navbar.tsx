"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // To determine active route
import {
  FiHome,
  FiSettings,
  FiUsers,
  FiChevronDown,
  FiChevronRight,
  FiUser 
} from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";
import { useLogginIdentity } from "@/app/lib/customHooks";
// Define the type for navbar links
interface NavbarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  subLinks?: NavbarLink[];
}

export default function Navbar() {
  const pathname = usePathname(); // To get current route path
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const logginIdentity = useLogginIdentity();
  console.log(logginIdentity)
  // Navbar links configuration
  const navbarLinks: NavbarLink[] = [
    { name: "Home", href: "/", icon: FiHome },
    {
      name: `${logginIdentity ? logginIdentity.userName : "Guest"}`,
      href: "#",
      icon: FiUser,
      subLinks: [
        { name: "Basic info", href: "/users/admins", icon: FiChevronRight },
        { name: "Logout", href: "/users/guests", icon: FiChevronRight },
      ],
    },
    { name: "Settings", href: "/settings", icon: FiSettings },
  ];

  // Toggle Dropdown
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Check if link is active
  const isActive = (href: string) => pathname === href;

 
  
  return (
    <nav className="bg-violet-700 text-white">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-3">
        {/* Logo */}
        <div className="text-2xl font-bold border-2 border-gray-400 rounded-lg hover:bg-slate-600">
          <CgMenuGridO cursor={"pointer"} size={30} />
        </div>

        {/* Navbar Links */}
        <ul className="flex space-x-6 items-center">
          {navbarLinks.map((link) => (
            <li key={link.name} className="relative">
              {/* Links without Sublinks */}
              {!link.subLinks ? (
                <Link
                  href={link.href}
                  className={`flex items-center space-x-2 p-2 rounded-md hover:bg-violet-600 ${
                    isActive(link.href) ? "bg-violet-600" : ""
                  }`}
                >
                  <link.icon />
                  <span>{link.name}</span>
                </Link>
              ) : (
                <>
                  {/* Links with Sublinks */}
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-violet-600"
                  >
                    <link.icon />
                    <span>{link.name}</span>
                    {openDropdown === link.name ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </button>

                  {/* Sublinks Dropdown */}
                  {openDropdown === link.name && (
                    <ul className="absolute left-0 mt-2 bg-violet-800 rounded-md shadow-lg w-48">
                      {link.subLinks.map((subLink) => (
                        <li key={subLink.name}>
                          <Link
                            href={subLink.href}
                            className={`flex items-center space-x-2 p-2 hover:bg-violet-600 ${
                              isActive(subLink.href) ? "bg-violet-600" : ""
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
      </div>
    </nav>
  );
}
