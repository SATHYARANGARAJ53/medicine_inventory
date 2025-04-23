import React, { useState,useEffect } from "react";
import "./Orders.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { FaClinicMedical, FaIndustry } from "react-icons/fa";
import { BsShieldExclamation } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import axios from "axios";


function Orders() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [clinicid, setClinicid] = useState(null);
  const token = localStorage.getItem("jwtToken");



  // const logoutUser = () => {
  //   localStorage.removeItem("jwtToken");
  //   console.log("Removed");
  //   navigate("/register", { replace: true });
  // };

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserDetails();
      setClinicid(data.clinic_id);
    };

    getUserData();
  }, []);

  const fetchUserDetails = async () => {
    if (!token) {
      console.log("No token found in localStorage");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user-details/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  useEffect(() => {
    if (token && clinicid) {
      axios
        .get("http://localhost:8000/api/redistribution-requests/", {
          params: { clinic_id: clinicid },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setRequests(response.data.requests || []);
          console.log(requests);
        })
        .catch((error) => {
          console.error("Error fetching requests:", error);
        });
    }
  }, [clinicid]);

  const handleAction = async (requestId, action) => {
    try {
      console.log(requestId+" "+action);
      axios.post('http://localhost:8000/api/update-redistribution/',{ request_id: requestId, action: action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      )
      .then(response => {
        console.log("Redistribution updated:", response.data);
      })
      .catch(error => {
        console.error("Error updating redistribution:", error);
      });

      // Update UI: disable buttons and change status
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: action === "accept" ? "fulfilled" : "rejected" } : req
        )
      );
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("clinicId");
    navigate("/register", { replace: true });
  };

  const messages = [
    {
      clinicID: 1,
      clinicName: "Raja Medicals",
      Medicine: "Paracetamol",
      exp: "22-08-2025",
      Qty: 200,
    },
    {
      clinicID: 2,
      clinicName: "Immanuel Medicals",
      Medicine: "E-Caps",
      exp: "22-08-2025",
      Qty: 200,
    },
    {
      clinicID: 3,
      clinicName: "AR Medicals",
      Medicine: "Aspirin",
      exp: "22-08-2025",
      Qty: 200,
    },

    {
      clinicID: 4,
      clinicName: "Ayush Medicals",
      Medicine: "Dolo 650",
      exp: "22-08-2025",
      Qty: 200,
    },

    {
      clinicID: 5,
      clinicName: "NBR Medicals",
      Medicine: "Rsd",
      exp: "22-08-2025",
      Qty: 200,
    },
    {
      clinicID: 6,
      clinicName: "NBR Medicals",
      Medicine: "Rsd",
      exp: "22-08-2025",
      Qty: 200,
    },
  ];

  function handleClick() {
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
    toast.error("Request was rejeted!", {
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
      <Navbar clinic={messages.length} logoutUser={logoutUser} />
      <div
        className="modal fade"
        tabindex="-1"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content pl-2">
            <div className="modal-header">
              <div className="d-flex flex-column justify-content-center align-items-center fs-3 text-danger">
                <BsShieldExclamation />
              </div>
              <h5 className="modal-title fs-5 w-100" id="exampleModalLabel">
                Are you sure to sell ?
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <table className="table table-responsive">
                <tr>
                  <td>&nbsp;&nbsp;&nbsp;</td>
                  <td className="fs-5">Medicine</td>
                  <td>:</td>
                  <td>Paracetamol</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="fs-5">Needed Quantity</td>
                  <td>:</td>
                  <td>150</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="fs-5">Available Quantity</td>
                  <td>:</td>
                  <td>200</td>
                </tr>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-bs-dismiss="modal"
                data-target="#exampleModal"
                onClick={() => handleClick()}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="Notify">
        {messages.length > 0 ? (
          <table className="table table-bordered text-center ">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Clinic Name</th>
                <th>Medicine</th>
                <th>Expiry Date</th>
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
                  <td key={row.clinicID}>{row.exp}</td>
                  <td key={row.clinicID}>{row.Qty}</td>
                  <td>
                 
                    <button
                      className="btn btn-success "
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      id={row.clinicID}
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
              ))}
            </tbody>
          </table>
        ) : (
          <p className="EmptyData">No Data Available</p>
        )}
      </div> */}
 <div className="Ordercontainer">
        <h2 className="text-center">Incoming Redistribution Requests</h2>
        <div className="request-list">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.id} className="request-line">
                <span>
                  <strong>{req.from_clinic}</strong> wants{" "}
                  <strong>{req.requested_quantity}</strong> of{" "}
                  <strong>{req.tablet_name}</strong>
                </span>
                {req.status === "pending" ? (
                  <span className="buttons-inline">
                    <button
                      className="btn btn-success btn-sm mx-1"
                      onClick={() => handleAction(req.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleAction(req.id, "reject")}
                    >
                      Reject
                    </button>
                  </span>
                ) : (
                  <span className={`badge ${req.status === "fulfilled" ? "bg-success" : "bg-secondary"}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p>No requests found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Orders;
