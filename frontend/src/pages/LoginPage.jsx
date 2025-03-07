import { useState } from "react";
import "./LoginPage.css";
import { loginApi } from "../services/Api";
import { storeUserData } from "../services/Storage";
import { isAuthenticated } from "../services/Auth";
import { Link,Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function LoginPage() {
  const initialStateErrors = {
    email: { required: false },
    password: { required: false },
    customError: null,
  };

  const [errors, setErrors] = useState(initialStateErrors);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    console.log(inputs);

    e.preventDefault();

    let errors = initialStateErrors;
    let hasError = false;

    if (inputs.email == "") {
      errors.email.required = true;
      hasError = true;
    }
    if (inputs.password == "") {
      errors.password.required = true;
      hasError = true;
    }
    if (!hasError) {
      // sending login api request

      setLoading(true);
      //It returns promise so we can use then and catach blocks
      loginApi(inputs)
        .then((response) => {
          storeUserData(response.data.idToken);
        })
        .catch((err) => {
          if (err.code == "ERR_BAD_REQUEST") {
            setErrors({ ...errors, customError: "Invalid Credentials" });
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
  });

  const handleInputs = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  if (isAuthenticated()) {
    //true or false
    //redirect to Dashboard
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
     <Navbar/>
      <section className="login-block">
        <div className="container bg-dark text-light">
          <div className="row ">
            <div className="col login-sec">
              <h2 className="text-center">Login Now</h2>
              <form className="login-form" action="" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="text-uppercase"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id=""
                    placeholder="email"
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.email.required ? (
                    <span className="text-light">Email is required.</span>
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
                    placeholder="password"
                    id=""
                    onChange={handleInputs}
                  />
                  <br />
                  {errors.password.required ? (
                    <span className="text-light">Password is required.</span>
                  ) : null}
                </div>
                <div className="form-group">
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
                  {errors.customError ? (
                    <span className="text-light">
                      <p>{errors.customError}</p>
                    </span>
                  ) : null}
                  <input
                    type="submit"
                    className="btn btn-login float-right"
                    value="Login"
                    disabled={loading}
                  />
                </div>
                <div className="clearfix"></div>
                <div className="form-group">
                  Create new account ? Please{" "}
                  <Link to="/register"  style={{color:"#ff0000",fontSize:"1.2em",fontWeight:"900"}}>Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
