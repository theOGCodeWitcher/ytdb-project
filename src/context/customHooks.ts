// import { useContext } from "react";
// import UserContext from "./userContext";
import { useSelector } from "react-redux";

export function getUserData() {
  // const { userData } = useContext(UserContext);
  const userData = useSelector((state: any) => state.user);

  return userData;
}

export function getUserID_db() {
  // const { userData } = useContext(UserContext);
  const userData = useSelector((state: any) => state.user);
  if (userData) {
    return userData._id;
  }
}
