import React, { useEffect } from "react";
import "./Orders.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.log("No token found in localStorage");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const logoutUser = () => {
    localStorage.removeItem("jwtToken");
    console.log("Removed");
    navigate("/register", { replace: true });
  };

  return (
    <>
      <Navbar logoutUser={logoutUser} />
      <div className="Ordercontainer">
        <div className="clinicOrder">
          <h1 className="text-center"><span>From Clinics </span></h1>
          <label>
            Name Of the Clinic <input type="text" className="form-control" />
          </label>
          <label>
            Needed Medicine <input type="text" className="form-control" />
          </label>
          <label>
            Needed Quantity <input type="number" className="form-control" />
          </label>
          <div className="buttons">
            <button className="btn btn-primary">Buy</button>
            <button className="btn btn-success">Sell</button>
          </div>
        </div>
        <div className="ManOrder">
          <h1 className="text-center"><span>From Company</span></h1>
          <label>
            Name Of the Manufacturer <input type="text" className="form-control" />
          </label>
          <label>
            Email Of the Manufacturer <input type="text" className="form-control" />
          </label>
          <label>
            Needed Medicine <input type="text" className="form-control" />
          </label>
          <label>
            Needed Quantity <input type="number" className="form-control" />
          </label>
          <div className="buttons">
            <button className="btn btn-primary">Buy</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Orders