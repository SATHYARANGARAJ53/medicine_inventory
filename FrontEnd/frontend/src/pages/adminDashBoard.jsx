import { useEffect, useState } from "react";
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import Navbar from "../Components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import "./adminDashBoard.css";
import axios from "axios"

export default function AdminDashboard() {
  const [user, setUser] = useState({ name: "", email: "", localID: "" });
  const navigate = useNavigate();
  const [clinicid, setClinicid] = useState(null);
  const [refresh, setRefresh] = useState(false);


  const logoutUser = () => {
    localStorage.removeItem("jwtToken");
    console.log("Removed");
    navigate("/register");
  };

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
      console.log("User details:", data);
      setClinicid(data.clinic_id);
      setRefresh(prev => !prev);
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



  // Add this function inside AdminDashboard component
  const isNearExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };


  const [medicines, setMedicines] = useState([]);
  const [newTabletName, setNewTabletName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");

  // Add new medicine
  const addMedicine = async (e) => {
    e.preventDefault();

    const tabletName = newTabletName.trim();
    const quantity = newQuantity.trim();
    const expiryDate = newExpiryDate.trim();
    const price = 10;

    if (tabletName && quantity && expiryDate) {
      const newMedicine = {
        "s.no": medicines.length + 1,
        "Tablet_Name": tabletName,
        "Available_Quantity": quantity,
        "Expiry_Date": expiryDate,
        "Price": price,
        "Clinic_Id": clinicid
      };

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/add-medicine/", newMedicine);
        setRefresh(prev => !prev);
        console.log(response.data.message);
      }
      catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log(clinicid);
    axios.get(`http://127.0.0.1:8000/api/get-medicines/`, {
      params: { clinic_id: clinicid }
    })
      .then(response => {
        console.log(response.data.medicines);
        setMedicines(response.data.medicines);
      })
      .catch(error => {
        console.error("Error fetching medicines:", error);
      });
  }, [refresh]);

  // Update medicine
  function updateMedicine(id) {
    const medicine = medicines.find((m) => m["s.no"] === id);
    fetch("/data/medicine.json", {
      method: "PUT",
      body: JSON.stringify(medicine),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        Toaster.create().show({
          message: "Medicine updated successfully",
          intent: "success",
          timeout: 3000,
        });
      });
  }

  // Delete medicine
  const deleteMedicine = async (tabletName) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/delete-medicine/`, {
        params: {
          tablet_name: tabletName,
          clinic_id: clinicid
        }
      });

      console.log(response.data.message);
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  return (
    <>
      <Navbar logoutUser={logoutUser} />
      <div className="top">
        <span className="h2 text-danger">
          Hello,
          <br />
          <hr />
          <span className="text-primary">{user.name}</span>
        </span>
      </div>

      <main>
        <form action="#">
          <h3>Available Medicine List</h3>
          {/* <Medicinelist clinicid={clinicid} /> */}

          <table className="bp4-html-table modifier table-bordered text-center table-striped">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Tablet Name</th>
                <th>Available Quantity</th>
                <th>Expiry Date</th>
                <th>Needed Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => {
                const nearExpiry = isNearExpiry(med.expiry_date);
                const lowStock = med.quantity_available <= 80;

                return (
                  <tr key={med.id}>
                    <td>{med.id}</td>
                    <td>
                      <EditableText
                        onChange={(value) =>
                          setMedicines((prev) =>
                            prev.map((m) =>
                              m.id === med.id ? { ...m, tablet_name: value } : m
                            )
                          )
                        }
                        value={med.tablet_name}
                      />
                    </td>
                    <td
                      style={{
                        backgroundColor: lowStock ? 'yellow' : 'transparent',
                        fontWeight: lowStock ? 'bold' : 'normal',
                      }}
                    >
                      <EditableText
                        onChange={(value) =>
                          setMedicines((prev) =>
                            prev.map((m) =>
                              m.id === med.id ? { ...m, quantity_available: value } : m
                            )
                          )
                        }
                        value={med.quantity_available}
                      />
                    </td>
                    <td
                      style={{
                        color: nearExpiry ? 'red' : 'black',
                        fontWeight: nearExpiry ? 'bold' : 'normal',
                      }}
                    >
                      <EditableText
                        type="date"
                        onChange={(value) =>
                          setMedicines((prev) =>
                            prev.map((m) =>
                              m.id === med.id ? { ...m, expiry_date: value } : m
                            )
                          )
                        }
                        value={med.expiry_date}
                      />
                    </td>
                    <td>
                      <Button
                        intent="primary p-3 w-45 rounded"
                        onClick={() => updateMedicine(med)}
                      >
                        Update
                      </Button>
                      &nbsp;
                      <Button
                        intent="danger p-3 w-45 rounded"
                        onClick={() => deleteMedicine(med.tablet_name)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <td></td>
                <td>
                  <InputGroup
                    value={newTabletName}
                    onChange={(e) => setNewTabletName(e.target.value)}
                    placeholder="Enter Tablet Name..."
                  />
                </td>
                <td>
                  <InputGroup
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="Enter Available Quantity..."
                  />
                </td>
                <td>
                  <InputGroup
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    placeholder="Enter Expiry Date..."
                  />
                </td>
                <td>
                  <Button intent="success p-3 rounded" onClick={addMedicine}>
                    Add Medicine
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </form>
      </main>
    </>
  );
}