"use client";
import React, {
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
  useRef,
} from "react";
import Image, { StaticImageData } from "next/image";
import { makeRequest } from "@/app/lib/helperFunctions";
import { ChangePasswordTemplate } from "@/app/component/users/ProfileInfomation";
import { useSearchParams } from "next/navigation";
import { LoadingDivs } from "@/app/component/Loading";
import { IoIosCamera } from "react-icons/io";
import Modal from "@/app/component/Modal";
import { CustomFile } from "@/app/lib/customHooks";
import { blobToFile } from "@/app/lib/helperFunctions";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import ProfileImage from "@/public/profile.jpg";
import { useProfile } from "@/app/context/ProfileContext";
import ImageComponent from "@/app/component/Image";
const ContactInformation = lazy(
  () => import("@/app/component/users/ProfileInfomation")
);
const UserProfile = () => {
  const [user, setUser] = useState<any>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string | any>(ProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [avarta, setAvarta] = useState<string>("");
  const [message, setMessage] = useState<{
    showMessage: boolean;
    message: string;
    messageType: string;
  }>({ showMessage: false, message: "", messageType: "" });

  const { profilePicture, updateProfilePicture } = useProfile();
  const fetchUser = useCallback(async () => {
    const user = await makeRequest(`/api/auth?service=fetchUser`, {
      method: "GET", 
      cache: "no-store",
    });
    console.log(user);
    setUser(user);
    setAvarta(user.avarta);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      // const reader = new FileReader();
      const fileUrl: CustomFile | any = URL.createObjectURL(file);
      setProfileImage(fileUrl);
      setModalOpen(true);
      console.log(fileUrl);
      // reader.onloadend = () => {
      //   // You can also upload the file to the server here
      // };

      // reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const tabs = [
    {
      label: "Personal Information",
      content: <ContactInformation user={user} />,
    },
    {
      label: "Security",
      content: <ChangePasswordTemplate username={user ? user.username : ""} />,
    },
  ];
 
  async function useProfilePhoto(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const profilePicture = await blobToFile(profileImage, "profile-image");
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    if (profilePicture) {
      formData.append("profile-picture", profilePicture);
    }
    const response = await makeRequest(`/api/users?id=${user._id}`, {
      method: "PUT",
      body: formData,
    });
    console.log(response);
    if (!response.success) {
      setPending(false);
      setMessage({
        showMessage: true,
        message: response.message,
        messageType: "errorMessage",
      });
      return;
    }
    setAvarta(response.data);
    updateProfilePicture(response.data);
    setModalOpen(false);
    setPending(false);
    setMessage({
      showMessage: true,
      message: response.message,
      messageType: "successMessage",
    });
    let timeOut: NodeJS.Timeout;
    timeOut = setTimeout(() => {
      setMessage({ showMessage: false, messageType: "", message: "" });
    }, 1000);

    return () => clearTimeout(timeOut);
  }

  return (
    <main className="min-w-full relative">
      {message.showMessage && message.messageType === "successMessage" && (
        <Toast message={message.message} Icon={FaCircleCheck} title="" />
      )}

      {user ? (
        <section className="w-full flex flex-col gap-5 p-10 relative">
          <div className="bg-white flex flex-col w-full min-h-96 relative">
            <div className="bg-gradient-to-r from-violet-500 to-violet-900 gap-3 w-full h-60 relative">
              {/* <button className="btn text-gray-600 bg-slate-100 py-2 px-5 hover:bg-slate-300 transition-all flex items-center justify-center gap-3 cursor-pointer desktop:float-right laptop:float-right tablet:float-right m-5 rounded-md">
                {" "}
                <FiEdit /> Edit User
              </button> */}
              <div
                className="relative cursor-pointer desktop:top-32 laptop:top-24 tablet:top-24 phone:top-32 border-2 border-white left-5 rounded-full desktop:h-30 laptop:h-30 tablet:h-30 phone:h-32 desktop:w-30 laptop:w-30 tablet:w-30 phone:w-32"
                onClick={handleClick}
              >
                {avarta ? (
                  process.env.NEXT_PUBLIC_NODE_ENV !== "development" ? (
                    <ImageComponent src={avarta} className="rounded-full border-white border-solid w-full h-full"/>
                  ) : (
                    <Image
                      src={`/uploads/${avarta}`}
                      width={100}
                      height={100}
                      alt="Profile image"
                      className=" rounded-full border-white border-solid w-full h-full"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gray-800 rounded-full flex justify-center items-center">
                    <h1 className="text-slate-100 font-mono text-sm">
                      Profile Picture
                    </h1>
                  </div>
                )}
                <IoIosCamera
                  className="w-full cursor-pointer z-10 absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                  size={25}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="w-full mt-7 ml-10">
              <div className="flex flex-row items-center gap-4">
                <h1 className="font-sans font-semibold desktop:text-base laptop:text-base tablet:text-sm phone:text-sm">
                  {user && user.first_name} {user && user.other_names}{" "}
                  {user && user.last_name}
                </h1>
                <p
                  className={`border desktop:px-5  laptop:px-5 tablet:px-5 phone:px-1 py-1 rounded flex flex-row gap-3 items-center`}
                >
                  {" "}
                  <span
                    className={`h-3 w-3 rounded-full ${
                      user && user.online_status === "online"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>{" "}
                  {user && user.online_status === "online"
                    ? "Available"
                    : "Not Available"}
                </p>
              </div>
              <span className="text-gray-500 font-semibold">
                {user && user.roles.toString()}
              </span>
            </div>
            <div className="m-auto flex space-x-2">
              {tabs.map((tabs, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`tab font-mono transition duration-300 ease-in-out h-16 ${
                    activeTab === index
                      ? " text-violet-700  font-semibold border-b-2 border-violet-700"
                      : " hover:bg-gray-300"
                  }`}
                  type="button"
                >
                  {tabs.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            {tabs[activeTab].content}
          </div>
          <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div className="w-full flex flex-col gap-5 items-center">
              {message.showMessage &&
                message.messageType === "errorMessage" && (
                  <p className="w-1/2 text-red-500 p-1 font-semibold text-center bg-red-200 m-4 border-2 border-red-600 rounded-md desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
                    {message.message}
                  </p>
                )}
              <form
                method="post"
                className="w-full flex flex-col gap-5 items-center"
                onSubmit={useProfilePhoto}
                ref={formRef}
              >
                <div className="desktop:h-30 laptop:h-30 tablet:h-30 phone:h-32 desktop:w-30 laptop:w-30 tablet:w-30 phone:w-32">
                  <Image
                    src={profileImage}
                    alt="profile-img"
                    className="rounded-full border-white border-solid w-full h-full"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex gap-5">
                  <button
                    className="btn btn-sm bg-violet-600 text-slate-100"
                    type="submit"
                  >
                    {pending && (
                      <span className="loading loading-spinner loading-sm"></span>
                    )}
                    Use Picture
                  </button>
                  <button
                    className="btn btn-sm btn-error text-slate-100"
                    onClick={handleClick}
                    type="button"
                    disabled={pending}
                  >
                    Select Another
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </section>
      ) : (
        <>
          <LoadingDivs />
          <LoadingDivs />
          <LoadingDivs />
        </>
      )}
    </main>
  );
};

export default UserProfile;
