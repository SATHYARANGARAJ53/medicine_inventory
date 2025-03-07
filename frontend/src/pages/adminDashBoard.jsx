import { useEffect, useState } from "react";
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import { userDetailApi } from "../services/Api";
import Navbar from "../Components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/Auth";
import "./adminDashBoard.css";

export default function AdminDashboard() {
  const [user, setUser] = useState({ name: "", email: "", localID: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      userDetailApi().then((response) => {
        setUser({
          name: response.data.users[0].displayName,
          email: response.data.users[0].email,
          localId: response.data.users[0].localId,
        });
      });
    }
  }, []);

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const [medicines, setMedicines] = useState([]);
  const [newTabletName, setNewTabletName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newExpiryDate, setNewExpiryDate] = useState("");

  // Fetch medicine data
  useEffect(() => {
    fetch("/data/medicine.json")
      .then((response) => response.json())
      .then((data) => setMedicines(data));
  }, []);

  // Add new medicine
  function addMedicine() {
    const tabletName = newTabletName.trim();
    const quantity = newQuantity.trim();
    const expiryDate = newExpiryDate.trim();

    if (tabletName && quantity && expiryDate) {
      const newMedicine = {
        "s.no": medicines.length + 1,
        "Tablet Name": tabletName,
        "Available Quantity": quantity,
        "Expiry Date": expiryDate,
      };

      fetch("/data/medicine.json", {
        method: "POST",
        body: JSON.stringify([...medicines, newMedicine]),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then(() => {
          setMedicines([...medicines, newMedicine]);
          setNewTabletName("");
          setNewQuantity("");
          setNewExpiryDate("");

          Toaster.create().show({
            message: "Medicine added successfully",
            intent: "success",
            timeout: 3000,
          });
        });
    }
  }

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
  function deleteMedicine(id) {
    const updatedMedicines = medicines.filter((m) => m["s.no"] !== id);
    fetch("/data/medicine.json", {
      method: "DELETE",
      body: JSON.stringify(updatedMedicines),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        setMedicines(updatedMedicines);
        Toaster.create().show({
          message: "Medicine deleted successfully",
          intent: "success",
          timeout: 3000,
        });
      });
  }

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
              {medicines.map((med) => (
                <tr key={med["s.no"]}>
                  <td>{med["s.no"]}</td>
                  <td>
                    <EditableText
                      onChange={(value) =>
                        setMedicines((prev) =>
                          prev.map((m) =>
                            m["s.no"] === med["s.no"]
                              ? { ...m, "Tablet Name": value }
                              : m
                          )
                        )
                      }
                      value={med["Tablet Name"]}
                    />
                  </td>
                  <td>
                    <EditableText
                      onChange={(value) =>
                        setMedicines((prev) =>
                          prev.map((m) =>
                            m["s.no"] === med["s.no"]
                              ? { ...m, "Available Quantity": value }
                              : m
                          )
                        )
                      }
                      value={med["Available Quantity"]}
                    />
                  </td>
                  <td>
                    <EditableText
                      onChange={(value) =>
                        setMedicines((prev) =>
                          prev.map((m) =>
                            m["s.no"] === med["s.no"]
                              ? { ...m, "Expiry Date": value }
                              : m
                          )
                        )
                      }
                      value={med["Expiry Date"]}
                    />
                  </td>
                  <td>
                    <Button
                       intent="primary p-3 w-45 rounded"
                      onClick={() => updateMedicine(med["s.no"])}
                    >
                      Update
                    </Button>
                    &nbsp;
                    <Button
                      intent="danger p-3 w-45 rounded"
                      onClick={() => deleteMedicine(med["s.no"])}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
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
