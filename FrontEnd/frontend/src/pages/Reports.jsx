import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import './Reports.css';
import { useEffect} from "react";

function Reports() {
  const [results, setResults] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [clinicid, setClinicid] = useState(null);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("jwtToken");
  
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
      const getUserData = async () => {
        const data = await fetchUserDetails();
        setClinicid(data.clinic_id);
      };
  
      getUserData();
    }, []);

  const handleClick = async () => {
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
      const formatted = Object.entries(data).map(([name, req]) => ({ name, req }));

      setResults(formatted);
      setShowTable(true);

    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <button className="btn btn-primary w-25 p-3 predict" onClick={handleClick}>
          Predict
        </button>

        {showTable && (
          <table className="table table-bordered table-striped table-hover text-center" id="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Tablet Name</th>
                <th>Required Quantity</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.req}</td>
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
