import { createContext, useContext, useEffect, useState } from "react";
import { useLogginIdentity } from "../lib/hooks/useLogginIdentity";
import { makeRequest } from "../lib/helperFunctions";
interface ProfileContextType {
  profilePicture: string;
  updateProfilePicture: (newPicture: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profilePicture, setProfilePicture] = useState<string>("");
	// const {} = useLogginIdentity()
  useEffect(() => {
    (async () => {
      const response = await makeRequest(`/api/auth?service=fetchUser`, {
        method: "GET",
      });
      // console.log(response);
      if (response && response.avarta) {
        setProfilePicture(response.avarta);
      }
    })();
  }, [profilePicture]);

  const updateProfilePicture = (newPicture: string) => {
    setProfilePicture(newPicture);
  };

  return (
    <ProfileContext.Provider value={{ profilePicture, updateProfilePicture }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
