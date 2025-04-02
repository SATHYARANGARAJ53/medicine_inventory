import React from "react";
import "./Orders.css";
import { FaClinicMedical, FaIndustry } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
function Orders() {
  return (
    <>
    <Navbar/>
    <div className="Ordercontainer">
      <div className="clinicOrder">
        <h1 className="text-center"><span>From Clinics </span><FaClinicMedical className="h4"/></h1>
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
        <h1 className="text-center"><span>From Company</span><FaIndustry className="h4"/></h1>
        <label>
          Name Of the Manufacturer{" "}
          <input type="text" className="form-control" />
        </label>
        <label>
          Email Of the Manufacturer{" "}
          <input type="text" className="form-control" />
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

export default Orders;
