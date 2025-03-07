import React, { useState } from "react";
import "./RegisterPage.css";
import { registerApi } from "../services/Api";
import { storeUserData } from "../services/Storage";
import { isAuthenticated } from "../services/Auth";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

function RegisterPage() {
  const initialStateErrors = {
    email: { required: false },
    password: { required: false },
    name: { required: false },
    customError: null,
    //!
    district:null,
  };

  const [errors, setErrors] = useState(initialStateErrors);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errors = initialStateErrors;
    let hasError = false;

    if (inputs.name == "") {
      errors.name.required = true;
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
      // sending register api request

      setLoading(true);
      //It returns promise so we can use then and catach blocks
      registerApi(inputs)
        .then((response) => {
          console.log(response);
          storeUserData(response.data.idToken);
        })
        .catch((err) => {
          if (err.response.data.error.message == "EMAIL_EXISTS") {
            setErrors({
              ...errors,
              customError: "Already this email has been registered",
            });
          } else if (
            err.response.data.error.message.includes("WEAK_PASSWORD")
          ) {
            setErrors({
              ...errors,
              customError: "Password should be atleast 6 characters",
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setErrors({ ...errors });
  };

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    // !
    district: "",
  });

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  //!

  if (isAuthenticated()) {
    //true or false
    //redirect to Dashboard
    console.log("Inputs:", inputs);

    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <Navbar />
      <section className="register-block">
        <div className="container text-light">
          <div className="row">
            <div className="col register-sec">
              <h2 className="text-center">Register Now</h2>
              <form className="register-form" action="" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="exampleInputEmail1"
                    className="text-uppercase"
                  >
                    Clinic Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id=""
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.name.required ? (
                    <span className="text-danger">Name is required.</span>
                  ) : null}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="text-uppercase"
                  >
                    District
                  </label>
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

                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="text-uppercase"
                  >
                    Email
                  </label>

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
                  <label
                    htmlFor="exampleInputPassword1"
                    className="text-uppercase"
                  >
                    Password
                  </label>
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
