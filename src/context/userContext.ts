import { createContext } from "react";
import { User } from "../types/type";

interface UserContextType {
  userData: User | null;
  setuserData: (userData: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  setuserData: () => {},
});

export default UserContext;
