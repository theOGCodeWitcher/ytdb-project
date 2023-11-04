import { createContext } from "react";
import { User } from "../types/type";

interface UserContextType {
  userData: User | null;
  setuserData: (userData: User | null) => void;
  changeObserved: boolean | null;
  setChangeObserved: (changeObserved: boolean) => void;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  setuserData: () => {},
  changeObserved: false,
  setChangeObserved: () => {},
});

export default UserContext;
