import React, { useState } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axios from "axios";




function RegisterPage() {
  const navigate = useNavigate();
  
  const initialStateErrors = {
    email: { required: false },
    password: { required: false },
    clinic_name: { required: false },
    customError: null,
    district: null,
  };

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    clinic_name: "",
    district: "",
  });

  const [errors, setErrors] = useState(initialStateErrors);

  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = initialStateErrors;
    let hasError = false;

    if (inputs.clinic_name == "") {
      errors.clinic_name.required = true;
      hasError = true;
    }
    if (inputs.email == "") {
      errors.email.required = true;
      hasError = true;
    }
    if (inputs.password == "") {
      errors.password.required = true;
      hasError = true;
    }
    if (!hasError) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/signup/", inputs);
        alert(response.data.message);
        navigate("/login");
      } catch (error) {
        alert(error.response.data.error);
      }

    }
    setErrors({ ...errors });
  };

 

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };


  //!

  // if (isAuthenticated()) {
  //   //true or false
  //   //redirect to Dashboard
  //   console.log("Inputs:", inputs);

  //   return <Navigate to="/dashboard" />;
  // }

  return (
    <>
      <Navbar />
      <section className="register-block">
        <div className="container text-dark">
          <div className="row">
            <div className="col register-sec">
              <h2 className="text-center text-primary">Register Now</h2>
              <form className="register-form" action="" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="exampleInputEmail1"
                    className="fw-bold fs-6"
                  >
                    Clinic Name
                  </label>
                  <br />
                  <br />
                  <input
                    type="text"
                    className="form-control"
                    name="clinic_name"
                    id="clinic_name"
                    onChange={handleInputs}
                  />
                  <br />
    
                  {errors.clinic_name.required ? (
                    <span className="text-danger">Clinic Name is required.</span>
                  ) : null}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className=" fs-6 fw-bold"
                  >
                    District
                  </label>
                  <br />
                  <br />
                  <select
                    className="form-control form-select"
                    name="district"
                    id="districts"
                    onChange={handleInputs}
                  >
                    <option className="bg-dark text-light">
                      ------ Select District -------
                    </option>
                    <option className="bg-dark text-light" value="Ariyalur">
                      Ariyalur
                    </option>
                    <option className="bg-dark text-light" value="Chengalpattu">
                      Chengalpattu
                    </option>
                    <option className="bg-dark text-light" value="Chennai">
                      Chennai
                    </option>
                    <option className="bg-dark text-light" value="Coimbatore">
                      Coimbatore
                    </option>
                    <option className="bg-dark text-light" value="Cuddalore">
                      Cuddalore
                    </option>
                    <option className="bg-dark text-light" value="Dharmapuri">
                      Dharmapuri
                    </option>
                    <option className="bg-dark text-light" value="Dindigul">
                      Dindigul
                    </option>
                    <option className="bg-dark text-light" value="Erode">
                      Erode
                    </option>
                    <option className="bg-dark text-light" value="Kallakurichi">
                      Kallakurichi
                    </option>
                    <option className="bg-dark text-light" value="Kancheepuram">
                      Kancheepuram
                    </option>
                    <option className="bg-dark text-light" value="Karur">
                      Karur
                    </option>
                    <option className="bg-dark text-light" value="Krishnagiri">
                      Krishnagiri
                    </option>
                    <option className="bg-dark text-light" value="Madurai">
                      Madurai
                    </option>
                    <option
                      className="bg-dark text-light"
                      value="Mayiladuthurai"
                    >
                      Mayiladuthurai
                    </option>
                    <option className="bg-dark text-light" value="Nagapattinam">
                      Nagapattinam
                    </option>
                    <option
                      className="bg-dark text-light"
                      value="Kanniyakumari"
                    >
                      Kanniyakumari
                    </option>
                    <option className="bg-dark text-light" value="Namakkal">
                      Namakkal
                    </option>
                    <option className="bg-dark text-light" value="Perambalur">
                      Perambalur
                    </option>
                    <option className="bg-dark text-light" value="Pudukkottai">
                      Pudukkottai
                    </option>
                    <option
                      className="bg-dark text-light"
                      value="Ramanathapuram"
                    >
                      Ramanathapuram
                    </option>
                    <option className="bg-dark text-light" value="Ranipet">
                      Ranipet
                    </option>
                    <option className="bg-dark text-light" value="Salem">
                      Salem
                    </option>
                    <option className="bg-dark text-light" value="Sivaganga">
                      Sivaganga
                    </option>
                    <option className="bg-dark text-light" value="Tenkasi">
                      Tenkasi
                    </option>
                    <option className="bg-dark text-light" value="Thanjavur">
                      Thanjavur
                    </option>
                    <option className="bg-dark text-light" value="Theni">
                      Theni
                    </option>
                    <option className="bg-dark text-light" value="Thoothukudi">
                      Thoothukudi
                    </option>
                    <option
                      className="bg-dark text-light"
                      value="Tiruchirappalli"
                    >
                      Tiruchirappalli
                    </option>
                    <option className="bg-dark text-light" value="Tirunelveli">
                      Tirunelveli
                    </option>
                    <option className="bg-dark text-light" value="Tirupathur">
                      Tirupathur
                    </option>
                    <option className="bg-dark text-light" value="Tiruppur">
                      Tiruppur
                    </option>
                    <option className="bg-dark text-light" value="Tiruvallur">
                      Tiruvallur
                    </option>
                    <option
                      className="bg-dark text-light"
                      value="Tiruvannamalai"
                    >
                      Tiruvannamalai
                    </option>
                    <option className="bg-dark text-light" value="Tiruvarur">
                      Tiruvarur
                    </option>
                    <option className="bg-dark text-light" value="Vellore">
                      Vellore
                    </option>
                    <option className="bg-dark text-light" value="Viluppuram">
                      Viluppuram
                    </option>
                    <option className="bg-dark text-light" value="Virudhunagar">
                      Virudhunagar
                    </option>
                  </select>

                </div>
                <br />
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="fs-6 fw-bold"
                  >
                    Email
                  </label>
<br />
<br />
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id=""
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.email.required ? (
                    <span className="text-danger">Email is required.</span>
                  ) : null}
                </div>

                <div className="form-group">
                  <br />
                  <label
                    htmlFor="exampleInputPassword1"
                    className="text-uppercas fs-6 fw-bold"
                  >
                    Password
                  </label>
                  <br />
                  <br />
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    id=""
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.password.required ? (
                    <span className="text-danger">Password is required.</span>
                  ) : null}
                </div>

                <div className="form-group">
                  {errors.customError ? (
                    <span className="text-danger">
                      <p>{errors.customError}</p>
                    </span>
                  ) : null}
                  {loading ? (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary "
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : null}
                  <br />
                  <input
                    type="submit"
                    className="btn btn-login float-right"
                    value="Register"
                    disabled={loading}
                  />
                </div>

                <div className="clearfix"></div>
                <div className="form-group">
                  Already have account ? Please{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#ff0000",
                      fontSize: "1.2em",
                      fontWeight: "900",
                    }}
                  >
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default RegisterPage;
