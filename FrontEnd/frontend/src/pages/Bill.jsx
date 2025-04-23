import React, { useEffect, useState } from "react";
import "./Bill.css";
import billIcon from "../assets/bill.png";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

function Bill() {
  const navigate = useNavigate();
  const location = useLocation();

  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const data = location.state || JSON.parse(sessionStorage.getItem("billData"));

    if (data && data.billItems && data.totalAmount) {
      setBillData(data);
    } else {
      navigate("/dashboard");
    }
  }, [location.state, navigate]);

  if (!billData) return null; // Wait for data before rendering

  const { billItems, totalAmount, clinicid } = billData;

  const handleClick = async () => {
    try {
      for (const item of billItems) {
        await axios.post(`http://127.0.0.1:8000/api/post-tablet/`, {
          clinic_id: clinicid,
          tabletName: item.tablet_name,
          tabletQuantity: item.quantity
        });
        console.log("Sold:", item.tablet_name);
      }
      alert('Bill was Generated');
      sessionStorage.removeItem("billData");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error during selling tablets:", err);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("billData");
    navigate("/dashboard");
  };

  return (
    <div className="Bill">
      <div className="BillContainer">
        <div className="top">
          <img src={billIcon} alt="icon" />
          <h2 className="h2 text-center p-4">Medical Invoice</h2>
        </div>

        <h5>Medicine Details</h5>
        {billItems.map((item, index) => (
          <div key={index}>
            <p><b>Medicine:</b> {item.tablet_name}</p>
            <p><b>Required Quantity:</b> {item.quantity}</p>
            <p><b>Price per item:</b> ₹{item.price}</p>
            <p><b>Total:</b> ₹{item.total}</p>
            <p>----------------------------</p>
          </div>
        ))}
        <p><b>Grand Total Amount:</b> ₹{totalAmount}</p>
        <p>----------------------------------------------------------------------------------------</p>
        <p>Powered by @DoctorCrono software</p>

        <div className="buttons">
          <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleClick}>Sell</button>
        </div>
      </div>
    </div>
  );
}

export default Bill;
