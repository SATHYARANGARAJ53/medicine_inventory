import React from "react";
import Navbar from "../Components/Navbar";
import './Reports.css'
function Reports() {
  let list = [
    {
      name: "Paracetamel",
      date: "22-08-2023",
      req:200,
    },
    {
      name: "Aspirin",
      date: "22-08-2023",
      req:200,
    },
   
    {
      name: "Vicks",
      date: "22-08-2024",
      req:200,
    },
    {
      name: "Dollo 650",
      date: "22-08-2024",
      req:200,
    },
    {
      name: "Aspirin",
      date: "22-08-2023",
      req:200,
    },
   
  ];

  function handleClick(){
    let table=document.getElementById('table');
    table.classList.remove('d-none');
  }
  return (
    <div>
     <Navbar/>
      <div>
      <button className="btn btn-primary w-25 p-3 predict" onClick={()=>handleClick()}>Predict</button>
      <table className="table table-bordered table-striped table-hover d-none text-center" id="table">
        <tr>
          <th>S.No</th>
          <th>Tablet Name</th>
          <th>Required Quantity</th>
        </tr>
        {
            list.map((i,key)=><tr>
              <td>{key+1}</td>
              <td>{i.name}</td>
              <td>{i.req}</td>
              
            </tr>)
          }
      </table>
      </div>
    </div>
  );
}

export default Reports;
