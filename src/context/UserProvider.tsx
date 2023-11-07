import { ReactNode, useState } from "react";
import UserContext from "./userContext";
import { User } from "../types/type";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [userData, setuserData] = useState<User | null>(null);
  const [changeObserved, setChangeObserved] = useState<boolean | null>(null);

  return (
    <UserContext.Provider
      value={{ userData, setuserData, changeObserved, setChangeObserved }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
