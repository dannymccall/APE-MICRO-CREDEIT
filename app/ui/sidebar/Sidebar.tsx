"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiSettings,
  FiUsers,
  FiChevronDown,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import { MdKeyboardArrowLeft } from "react-icons/md";

import { RxDashboard } from "react-icons/rx";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaCodeBranch } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";
import { useLogginIdentity } from "@/app/lib/customHooks";
import { TbReportSearch } from "react-icons/tb";
import { NavbarLink } from "../navbar/Navbar";
import { IoIosInformationCircle } from "react-icons/io";
import NavbarLinks from "@/app/component/navbar/NavbarLinks";
import { IoLogOut, IoLogOutOutline } from "react-icons/io5";
import { LoadingSpinner } from "@/app/component/Loaders/Loading";
import { useProfile } from "@/app/context/ProfileContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { clearLocalStorage, makeRequest } from "@/app/lib/helperFunctions";
import Modal from "@/app/component/Modal";
import ImageComponent from "@/app/component/Image";
import { FaShieldAlt } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import SidebarSkeleton from "@/app/component/Loaders/SidebarSkeleton";
// Define the type for sidebar links
interface SidebarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  subLinks?: SidebarLink[];
  roles: string[];
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathName = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { profilePicture } = useProfile();
  // console.log(profilePicture)
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for toggling sidebar

  const pathname = usePathname(); // To get current route path
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [showUserProfileNavs, setShowUserProfileNavs] =
    useState<boolean>(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const logginIdentity = useLogginIdentity();
  // console.log(logginIdentity);
  // Navbar links configuration

  useEffect(() => {
    setIsSidebarOpen(false);
  },[pathname]);
 
  // Toggle Dropdown
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Check if link is active
  const isActiveLink = (href: string) => pathname === href;
  // Sidebar links configuration
  const sidebarLinks: SidebarLink[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: RxDashboard,
      roles: ["Admin", "Loan officer"],
    },
    {
      name: "Staff",
      href: "#",
      icon: FiUsers,
      roles: ["Admin"], // Only Admins can see this
      subLinks: [
        {
          name: "Add Staff",
          href: "/addUser",
          icon: FiChevronRight,
          roles: ["Admin"],
        },
        {
          name: "Manage Staff",
          href: "/manage-user",
          icon: FiChevronRight,
          roles: ["Admin"],
        },
      ],
    },
    {
      name: "Clients",
      href: "#",
      icon: PiUsersThreeBold,
      roles: ["Admin", "Loan officer"],
      subLinks: [
        {
          name: "Add Client",
          href: "/add-client",
          icon: FiChevronRight,
          roles: ["Admin", "Loan officer"],
        },
        {
          name: "Manage Client",
          href: "/manage-client",
          icon: FiChevronRight,
          roles: ["Admin", "Loan officer"],
        },
      ],
    },
    {
      name: "Loans",
      href: "#",
      icon: GiCash,
      roles: ["Admin", "Loan officer"],
      subLinks: [
        {
          name: "Apply Loans",
          href: "/add-loan",
          icon: FiChevronRight,
          roles: ["Admin", "Loan officer"],
        },
        {
          name: "Manage Loans",
          href: "/manage-loan",
          icon: FiChevronRight,
          roles: ["Admin", "Loan officer"],
        },
        {
          name: "Loan Recovery",
          href: "/loan-recovery",
          icon: FiChevronRight,
          roles: ["Admin", "Loan officer"],
        },
        {
          name: "Approval Repayments",
          href: "/approve-loan-payment",
          icon: FiChevronRight,
          roles: ["Admin"],
        },
      ],
    },
    {
      name: "Branches",
      href: "#",
      icon: FaCodeBranch,
      roles: ["Admin"], // Only Admins can see this
      subLinks: [
        {
          name: "Add Branch",
          href: "/add-branch",
          icon: FiChevronRight,
          roles: ["Admin"],
        },
        {
          name: "Manage Branch",
          href: "/manage-branch",
          icon: FiChevronRight,
          roles: ["Admin"],
        },
      ],
    },
    {
      name: "Reports",
      href: "/report",
      icon: TbReportSearch,
      roles: ["Admin", "Loan officer"],
    },
    {
      name: "Finance",
      href: "#",
      icon: FaShieldAlt,
      roles: ["Admin"], // Only Admins can see this
      subLinks: [
        {
          name: "Vault",
          href: "/vault",
          icon: FiChevronRight,
          roles: ["Admin"],
        },
        // {
        //   name: "Manage Branch",
        //   href: "/manage-branch",
        //   icon: FiChevronRight,
        //   roles: ["Admin"],
        // },
      ],
    },
  ];

  // Function to toggle the submenu
  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Function to check if a link is active
  const isActive = (href: string) => pathName === href;

  const userRoles = logginIdentity?.userRoles || [];

  const hasPermission = (roles: string[]) =>
    roles.some((role) => userRoles.includes(role));
  // Toggle sidebar
  // const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleLogout = async () => {
    setModalOpen(true);
    const response = await makeRequest("/api/logout", { method: "POST" });

    const { success } = response;

    if (!success) return;

    clearLocalStorage();

    router.push("/");
  };

  return (
    <div
      className={`min-h-screen bg-violet-700 text-white flex flex-col desktop:w-72 laptop:64 phone:fixed tablet:fixed z-20 desktop:relative laptop:relative transition-all ${
        isSidebarOpen
          ? "phone:w-full tablet:w-full phone:h-screen tablet:h-screen overflow-y-auto"
          : "phone:w-0 desktop:w-72 laptop:w-64 overflow-hidden"
      }`}
    >
      {
        logginIdentity && profilePicture ?
        <section className="h-full flex flex-col justify-between">
  
        <div className="bg-violet-900 p-4 text-xl font-bold border-b border-violet-500 z-10 mb-7 relative">
          <span
            className="phone:block desktop:hidden laptop:hidden tablet:block font-sans text-2xl float-right relative bottom-2 cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MdKeyboardArrowLeft />
          </span>
          <div className="flex flex-col gap-5 items-center justify-center relative">
            <h1 className="font-mono">APE CREDIT</h1>
            <div className="flex flex-col items-center gap-2 relative">
              {profilePicture ? (
                <div className="relative border-2 border-white rounded-full desktop:h-30 laptop:h-30 tablet:h-30 phone:h-32 desktop:w-30 laptop:w-30 tablet:w-30 phone:w-32">
                  {process.env.NEXT_PUBLIC_NODE_ENV !== "development" ? (
                    <ImageComponent
                      src={profilePicture}
                      className="rounded-full border-white border-solid w-full h-full"
                    />
                  ) : (
                    <Image
                      src={`/uploads/${profilePicture}`}
                      width={100}
                      height={100}
                      alt="Profile image"
                      className="rounded-full border-white border-solid w-full h-full"
                    />
                  )}
                </div>
              ) : (
                <div
                  className={` bg-violet-500  rounded-full items-center relative flex justify-center desktop:w-32 desktop:h-32 laptop:w-28 laptop:h-28 phone:w-24 phone:h-24 tablet:w-24 tablet:h-24`}
                >
                  <FaUserLarge size={40}/>
                </div>
              )}
  
              <div className="flex flex-col justify-center items-center">
                <>
                  <h1 className="font-semibold text-base text-center font-sans">
                    {logginIdentity && logginIdentity.fullName}
                  </h1>
                  <h1 className="font-normal text-sm text-gray-300 capitalize">
                    {logginIdentity && logginIdentity.userRoles.toString()}
                  </h1>
                </>
              </div>
            </div>
          </div>
        </div>
  
        {/* Sidebar Links */}
        <nav className="flex-grow mb-full">
          {/* <ul className="space-y-2 p-2"> */}
          <div className="h-full flex flex-col gap-2">
            <ul className="space-y-2 p-2">
              {sidebarLinks
                .filter((link) => hasPermission(link.roles))
                .map((link) => (
                  <li key={link.name} className="border-b border-b-gray-500">
                    {!link.subLinks ? (
                      <Link
                        href={link.href}
                        className={`flex items-center space-x-2 p-2 rounded-md mb-2 transition-all ${
                          isActive(link.href)
                            ? "bg-white text-violet-700 font-semibold"
                            : "hover:bg-violet-300"
                        }`}
                        prefetch={false}
                      >
                        <link.icon />
                        <span>{link.name}</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            toggleMenu(link.name);
                            console.log({ openMenus });
                          }}
                          className="w-full flex items-center justify-between p-2 mb-2 rounded-md hover:bg-violet-300 transition-all"
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
  
                        {openMenus[link.name] && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {link.subLinks
                              .filter((subLink) => hasPermission(subLink.roles))
                              .map((subLink) => (
                                <li key={subLink.name}>
                                  <Link
                                    href={subLink.href}
                                    className={`flex items-center space-x-2 p-2 mb-1 rounded-md transition-all ${
                                      isActive(subLink.href)
                                        ? "bg-white text-violet-700 font-semibold"
                                        : "hover:bg-violet-300"
                                    }`}
                                    prefetch={false}
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
              <div className="flex flex-1 flex-col gap-1 phone:block desktop:hidden laptop:hidden tablet:block">
                <ul className="space-y-2 p-2">
                  <div className="flex items-center space-x-2">
                    <FiUser />
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-violet-300 transition-all"
                      onClick={() => setShowUserProfileNavs(!showUserProfileNavs)}
                    >
                      {logginIdentity ? logginIdentity.userName : "Guest"}{" "}
                      {showUserProfileNavs ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronRight />
                      )}
                    </button>
                  </div>
                  {showUserProfileNavs && (
                    <div className="flex flex-col gap-1 ml-5">
                      <ul className="space-y-2">
                        <li className="">
                          <Link
                            href="/user-profile"
                            className={`flex items-center gap-2 space-x-2 p-2 rounded-md mb-2 transition-all ${
                              isActive("")
                                ? "bg-white text-violet-700 font-semibold"
                                : "hover:bg-violet-300"
                            } `}
                          >
                            <IoIosInformationCircle />
                            Basic Info
                          </Link>
                        </li>
                        <li className="">
                          <button
                            className={`flex w-full items-center gap-2 space-x-2 p-2 rounded-md  mb-2 transition-all ${
                              isActive("")
                                ? "bg-white text-violet-700 font-semibold"
                                : "hover:bg-violet-300"
                            } `}
                            onClick={handleLogout} // Call logout function
                          >
                            <IoLogOut />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </ul>
              </div>
            </ul>
          </div>
  
          {/* <NavbarLinks
            openDropdown={openDropdown}
            isActive={isActiveLink}
            navbarLinks={navbarLinks}
            toggleDropdown={toggleDropdown}
            className="flex-col justify-center"
          /> */}
        </nav>
        {/* Sidebar Footer */}
        <div className="p-4 border-t h-20 border-violet-500 mt-auto">
          <p className="text-sm text-center h-20">{`© ${new Date().getFullYear()} APE CREDIT`}</p>
        </div>
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          <div className="flex flex-col gap-10 items-center justify-center">
            <p className="font-semibold font-sans text-lg">Sad to see you go</p>
            <span className="loading loading-ring loading-lg text-violet-500"></span>
          </div>
        </Modal>
        {/* Menu Button (toggle) */}
        {/* <button
          onClick={toggleSidebar}
          className="absolute top-4 left-4 text-xl text-white z-10 lg:hidden"
        >
          ☰
        </button> */}
        </section>:
        <SidebarSkeleton />
     

      }
    </div>
  );
}
