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
  FiUser,
} from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";
import { useLogginIdentity } from "@/app/lib/customHooks";
import NavbarLinks from "@/app/component/navbar/NavbarLinks";
import { makeRequest, clearLocalStorage } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import Modal from "@/app/component/Modal";
import { IoIosInformationCircle } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
// Define the type for navbar links
export interface NavbarLink {
  name: string;
  href: string;
  icon: React.ElementType;
  subLinks?: NavbarLink[];
}

export default function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname(); // To get current route path
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  // const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const logginIdentity = useLogginIdentity();
  const router = useRouter()
  // console.log(logginIdentity);
  // Navbar links configuration
  const navbarLinks: NavbarLink[] = [
    { name: "Home", href: "/dashboard", icon: FiHome },
    {
      name: `${logginIdentity ? logginIdentity.userName : "Guest"}`,
      href: "#",
      icon: FiUser,
      subLinks: [
        { name: "Basic info", href: `/user-profile`, icon: IoIosInformationCircle },
        { name: "Logout", href: "/users/guests", icon: IoLogOut },
      ],
    },
  ];

  // Toggle Dropdown
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    setModalOpen(true);
    const response = await makeRequest("/api/logout", { method: "POST" });

    const { success } = response;

    if (!success) return;

    clearLocalStorage();
   
    router.replace("/");
  }

  // Check if link is active
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="bg-white text-white shadow-md border-b w-full">
        <div className="w-full mx-auto flex items-center justify-end p-3">
          {/* Logo */}

          {/* Navbar Links */}
          <NavbarLinks
            openDropdown={openDropdown}
            isActive={isActive}
            navbarLinks={navbarLinks}
            toggleDropdown={toggleDropdown}
            className="items-center"
            handleLogout={handleLogout}
          />
          <div className="text-2xl font-bold  rounded-lg destop:hidden laptop:hidden phone:block">
            <CgMenuGridO
              cursor={"pointer"}
              size={30}
              className="text-gray-500"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </div>
        </div>
      </nav>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className="flex flex-col gap-10 items-center justify-center"> 
          <p className="font-semibold font-sans text-lg">Sad to see you go</p>
          <span className="loading loading-ring loading-lg text-violet-500"></span>
        </div>
      </Modal>
    </>
  );
}
