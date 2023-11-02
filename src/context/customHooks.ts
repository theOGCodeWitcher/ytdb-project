import { useContext } from "react";
import UserContext from "./userContext";

export function getUserData() {
  const { userData } = useContext(UserContext);
  return userData;
}

export function getUserID_db() {
  const { userData } = useContext(UserContext);
  if (userData) {
    return userData._id;
  }
}
