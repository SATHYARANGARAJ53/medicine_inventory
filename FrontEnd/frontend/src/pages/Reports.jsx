import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import './Reports.css';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Reports() {
  const [results, setResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [clinicid, setClinicid] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();


  const logoutUser = () => {
    localStorage.removeItem("jwtToken");
    console.log("Removed");
    navigate("/register", { replace: true });
    return ;
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.log("No token found in localStorage");
      navigate("/login", { replace: true });
      
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
    const getUserData = async () => {
      const data = await fetchUserDetails();
      setClinicid(data.clinic_id);
    };

    getUserData();
  }, []);


  useEffect(() => {
    if (!clinicid) return;
    console.log(clinicid);
    axios.get(`http://127.0.0.1:8000/api/get-medicines/`, {
      params: { clinic_id: clinicid }
    })
      .then(response => {
        setMedicines(response.data.medicines);
      })
      .catch(error => {
        console.error("Error fetching medicines:", error);
      });
  }, [clinicid]);


const handleClick = async () => {

  if (!clinicid) {
    console.warn("Clinic ID not set yet");
    return;
  }

  if (medicines.length === 0) {
    console.warn("Medicines not loaded yet");
    return;
  }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clinic_id: clinicid
        }),
      });

      const data = await response.json();
      const formatted = Object.entries(data).map(([name, req]) => {
        const match = medicines.find((med) => {
          const medName = med.tablet_name; 
          const inputName = name;
          return medName === inputName;
        });
      
        if (!match) {
          console.warn(`No match found for "${name}"`);
          return null;
        }
      
        return {
          name,
          req,
          available: match.quantity_available
        };
      });

      const validResults = formatted.filter(item => item !== null); 
      setResults(formatted);
      setShowTable(true);

      for (const item of validResults) {
        if (item.req > item.available) {
          const requestPayload = {
            tablet_name: item.name,
            from_clinic_id: clinicid,
            requested_quantity: item.req - item.available,
          };
  
          try {
            const res = await fetch("http://127.0.0.1:8000/api/create-redistribution/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestPayload),
            });

            if (!res.ok) {
              const text = await res.text(); // For debugging
              throw new Error(`Failed (${res.status}): ${text}`);
            }
  
            const resultData = await res.json();
            console.log(`Redistribution created for ${item.name}:`, resultData);
          } catch (err) {
            console.error(`Error creating redistribution for ${item.name}:`, err);
          }
        }
      }

    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div>
      <Navbar logoutUser={logoutUser} />
      <div>
        <button className="btn btn-primary w-25 p-3 predict" onClick={handleClick}>
          Predict
        </button>

        {showTable && results.length > 0 && (
          <table className="table table-bordered table-striped table-hover text-center" id="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Tablet Name</th>
                <th>Required Quantity</th>
                <th>Available Quantity</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.req}</td>
                  <td>{item.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reports;