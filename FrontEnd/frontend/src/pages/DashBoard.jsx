import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashBoard.css";

export default function DashBoard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);

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

  const [clinicid, setClinicid] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserDetails();
      setClinicid(data.clinic_id);
    };

    getUserData();
  }, []);

  useEffect(() => {
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

  const saleTablet = (tablet_name,quantity) =>{
    console.log("Output:"+clinicid);
    axios.post(`http://127.0.0.1:8000/api/post-tablet/`, {
      clinic_id: clinicid, tabletName : tablet_name, tabletQuantity: quantity
    })
      .then(response => {
        console.log("successful");
      })
      .catch(error => {
        console.error("Error fetching medicines:", error);
      });
  }

  const logoutUser = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar logoutUser={logoutUser} />

      <div className="top">
        <span className="h2 text-danger">Hello <br /><hr /></span>
        <input type="search" className="form-control" placeholder="Search everything...." />
      </div>

      <main>
        <form action="#">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Tablet Name</th>
                <th>Expiry Date</th>
                <th>Available Quantity</th>
                <th>Price (per unit)</th>
                <th>Needed Quantity</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine, index) => (
                <tr key={index}>
                  <td>{medicine.tablet_name}</td>
                  <td>{medicine.expiry_date}</td>
                  <td>{medicine.quantity_available}</td>
                  <td>${medicine.price}</td>
                  <td className="group">
                    <input 
                        type="number" 
                        className="form-control" 
                        min="1" 
                        max={medicine.quantity_available} 
                        onChange={(e) => medicine.inputValue = e.target.value} />
                    <button
                     className="btn btn-primary"
                     onClick={() => saleTablet(medicine.tablet_name, medicine.inputValue)}>Sale</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="billSection">
            <span>Total Amount:</span>
            <input type="number" className="form-control w-25 d-inline" readOnly />
            <button type="reset" className="btn btn-danger">Cancel</button>
            <button type="submit" className="btn btn-success">Generate Bill</button>
          </div>
        </form>
      </main>
    </>
  );
}
