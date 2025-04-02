import { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { FaLock } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function LoginPage() {
  const initialStateErrors = {
    email: { required: false },
    password: { required: false },
    customError: null,
  };

  const [errors, setErrors] = useState(initialStateErrors);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 
  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = initialStateErrors;
    let hasError = false;

    if (inputs.email.trim() === "") {
      errors.email.required = true;
      hasError = true;
    }
    if (inputs.password.trim() === "") {
      errors.password.required = true;
      hasError = true;
    }

    if (!hasError) {
      try {
        setLoading(true);
        const response = await axios.post("http://127.0.0.1:8000/api/login/", inputs);
        const token = response.data.token;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("clinicId", response.data.clinic_id);

        navigate("/admin");
      } catch (error) {
        console.error("Login failed", error);
        setErrors({
          ...errors,
          customError: "Invalid login credentials. Please try again.",
        });
        setLoading(false);
      }
    }

    setErrors({ ...errors });
  };

  return (
    <>
      <Navbar />
      <section className="login-block">
        <div className="container text-primary" style={{backgroundColor:"#fff"}}>
          <div className="row ">
            <div className="col login-sec">
              <h2 className="text-center">Login Now</h2>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="text-uppercase d-flex"><SiGmail className="mb-1 h6 text-primary"/>&nbsp;&nbsp;Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="email"
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.email.required && (
                    <span className="text-danger">Email is required.</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="text-uppercase d-flex"><FaLock className="mb-1 h6"/>&nbsp;&nbsp;Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="password"
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.password.required && (
                    <span className="text-danger">Password is required.</span>
                  )}
                </div>
                <div className="form-group">
                  {loading && (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  {errors.customError && (
                    <span className="text-light">
                      <p>{errors.customError}</p>
                    </span>
                  )}
                  <input
                    type="submit"
                    className="btn btn-login float-right"
                    value="Login"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  Create new account?{" "}
                  <Link
                    to="/register"
                    style={{ color: "#ff0000", fontSize: "1.2em", fontWeight: "900" }}
                  >
                    Register
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

















