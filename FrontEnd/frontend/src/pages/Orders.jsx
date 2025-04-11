import React, { useState } from "react";
import "./Orders.css";
import { FaClinicMedical, FaIndustry } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

function Orders() {
  const messages = [
    {
      clinicID: 1,
      clinicName: "Raja Medicals",
      Medicine: "Paracetamol",
      Qty: 200,
    },
    {
      clinicID: 2,
      clinicName: "Immanuel Medicals",
      Medicine: "E-Caps",
      Qty: 200,
    },
    {
      clinicID: 3,
      clinicName: "AR Medicals",
      Medicine: "Aspirin",
      Qty: 200,
    },

    {
      clinicID: 4,
      clinicName: "Ayush Medicals",
      Medicine: "Dolo 650",
      Qty: 200,
    },

    {
      clinicID: 5,
      clinicName: "NBR Medicals",
      Medicine: "Rsd",
      Qty: 200,
    },
  ];

  function handleClick(id) {
    toast.success("Request was accepted Successfully!", {
      position: "top-center",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: "1rem",
      },
    });
  }

  const Reject = (id) => {
    toast.error("Request was rejeted Successfully!", {
      position: "top-center",
      autoClose: 5000,
      theme: "dark",
      style: {
        fontSize: "1rem",
      },
    });
  };
  return (
    <>
      <Navbar clinic={messages.length} />
      <div className="Notify">
        {messages.length>0?
        <table className="table table-bordered text-center ">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Clinic Name</th>
            <th>Medicine</th>
            <th>Required Quantity</th>
            <th>Needed Action</th>
          </tr>
        </thead>
        <tbody>
          
            {messages.map((row) => (
              <tr>
                <td key={row.clinicID}>{row.clinicID}</td>
                <td key={row.clinicID}>{row.clinicName}</td>
                <td key={row.clinicID}>{row.Medicine}</td>
                <td key={row.clinicID}>{row.Qty}</td>
                <td>
                  <button
                    className="btn btn-success"
                    id={row.clinicID}
                    onClick={() => handleClick(row.clinicID)}
                  >
                    Accept
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-danger"
                    id={row.clinicID}
                    onClick={() => Reject(row.clinicID)}
                  >
                    Reject
                  </button>
                  <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    theme="light"
                  />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>:
      <p className="EmptyData">No Data Available</p>
      }
        
      </div>
      <Footer />
    </>
  );
}

export default Orders;
