import { useEffect, useState } from "react";
import { userDetailApi } from "../services/Api";
import Navbar from "../Components/Navbar";
import { removeUserData } from "../services/Storage";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/Auth";
import "./DashBoard.css";

export default function DashBoard() {
  const [user, setUser] = useState({ name: "", email: "", localID: "" });
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated()) {
      userDetailApi().then((response) => {
        setUser({
          name: response.data.users[0].displayName,
          email: response.data.users[0].email,
          localId: response.data.users[0].localId,
        });
      });
    }
  }, []);

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar logoutUser={logoutUser} />

      <div className="top">
        <span className="h2">Hello,{user.name}</span>
        <input type="search" className="form-control" placeholder="Search everything......." />
      </div>
      <main role="main" className="container mt-5">
        <div className="container">
          <div className="text-center mt-5">
            <h3>Dashboard page</h3>
            {user.name && user.email && user.localId ? (
              <div>
                <p className="text-bold ">
                  Hi {user.name}, your Firebase ID is {user.localId}
                </p>
                <p>Your email is {user.email}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
