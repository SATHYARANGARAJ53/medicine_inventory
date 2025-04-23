import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashBoard.css";



export default function DashBoard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editableRows, setEditableRows] = useState({});
  const [billData,setBillData] = useState({});
  const [user,setUser]=useState({name:"",email:""})



  

  const handleGenerateBill = () => {
    const data = {};
    let totalAmount = 0;
    navigate('/bill')
  
    medicines.forEach((medicine, index) => {
      const row = editableRows[index];
      if (row && parseInt(row.inputValue) > 0) {
        const quantity = parseInt(row.inputValue);
        saleTablet(medicine.tablet_name,quantity);
        data[medicine.tablet_name] = quantity;
        totalAmount += quantity * medicine.price;
      }
    });
  
    // if (Object.keys(data).length === 0) {
    //   alert("Please enter quantity for at least one tablet.");
    //   return;
    // }
    
    // setBillData(data);
    // alert(`Total Bill: $${totalAmount.toFixed(2)}`);
  
    // 🔁 You can now send `billData` to the backend as needed
    console.log("Bill to send:", data);
  };
  

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    setEditableRows((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        inputValue: value,
      },
    }));
  };

  const handleKeyDown = (e, medicine, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
  
      const value = parseInt(editableRows[index]?.inputValue || 0);
      const maxQty = medicine.quantity_available;
  
      if (value > -1 && value <= maxQty) {
        setEditableRows((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            isEditable: false,
          },
        }));

      } else {
        alert("Enter a valid quantity!");
      }
    }
  };
  
  

  const handleEditClick = (index) => {
    setEditableRows((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        isEditable: true,
      },
    }));
  };

  const saleTabletButton = (tablet_name, quantity, index, medicine) => {
    const value = parseInt(quantity);
    const maxQty = medicine.quantity_available;
  
    if (value > 0 && value <= maxQty) {
      // Lock the row (same as pressing Enter)
      setEditableRows((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          isEditable: false,
          inputValue: value,
        },
      }));

    } else {
      alert("Enter a valid quantity before proceeding.");
    }
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
      setUser({
        name:data.username,
        email:data.email
      })
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
  }, [clinicid,billData]);

  useEffect(() => {
    if (medicines.length > 0) {
      const initialEditableRows = {};
      medicines.forEach((_, index) => {
        initialEditableRows[index] = { inputValue: "", isEditable: true };
      });
      setEditableRows(initialEditableRows);
    }
  }, [medicines]);
  

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
    localStorage.removeItem("jwtToken");
    console.log("Removed");
    navigate("/register");
    return;
  };
  
  // const logoutUser = () => {
  //   navigate("/login");
  // };

  return (
    <>
      <Navbar logoutUser={logoutUser} />

      <div className="top">
        <span className="h2 text-danger">Hello , <span className="text-light">{user.name}</span><hr /></span>
        {/* <input
          type="search"
          className="form-control"
          placeholder="Search everything...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}
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
              {/* {medicines
                .filter((medicine) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    medicine.tablet_name.toLowerCase().includes(query) ||
                    medicine.expiry_date.toLowerCase().includes(query) ||
                    medicine.quantity_available.toString().includes(query) ||
                    medicine.price.toString().includes(query)
                  );
                })
                .map((medicine, index) => {
                  const row = editableRows[index] || {
                    inputValue: "",
                    isEditable: true,
                  };


                  return (
                    <tr key={index}>
                      <td>{medicine.tablet_name}</td>
                      <td>{medicine.expiry_date}</td>
                      <td>{medicine.quantity_available}</td>
                      <td>${medicine.price}</td>
                      <td className="group d-flex align-items-center gap-2">
                        {row.isEditable ? (
                          <>
                            <input
                              type="number"
                              className="form-control"
                              min="1"
                              max={medicine.quantity_available}
                              value={row.inputValue}
                              onChange={(e) => handleInputChange(e, index)}
                              onKeyDown={(e) => handleKeyDown(e, medicine, index)}
                            />
                          </>
                        ) : (
                          <>
                            <span>{row.inputValue}</span>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleEditClick(index)}
                            >
                              Edit
                            </button>
                          </>
                        )}

                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            saleTabletButton(medicine.tablet_name, row.inputValue, index, medicine)
                          }
                          disabled={!row.inputValue}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  );
                })} */}
                <tr>
                  <td><input type="search" name="search" id="search" className="form-control"/></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
            </tbody>

          </table>

          <div className="billSection">
            <button type="reset" className="btn btn-danger">Cancel</button>
            <button type="submit" className="btn btn-success" onClick={handleGenerateBill}>Generate Bill</button>
          </div>
        </form>
      </main>
    </>
  );
}