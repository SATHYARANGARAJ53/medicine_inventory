import React, { useEffect, useState } from "react";
import "./Orders.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Orders() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [clinicid, setClinicid] = useState(null);
  const token = localStorage.getItem("jwtToken");

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

  return (
    <>
      <Navbar logoutUser={logoutUser} />
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
