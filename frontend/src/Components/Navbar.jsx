import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/Auth";
import "./Navbar.css";
export default function Navbar(props) {
  return (
    <nav className="navbar bg-dark pt-4 pb-4">
      <div>
        <Link className="navbar-brand" to="/">
          <span style={{ fontSize: "1.5em" }}>
            <span style={{ fontWeight: 500, color: "red" }}>MED</span><span className="text-primary">VAULT</span>
          </span>
        </Link>
      </div>

      <div>
        <ul className="navbar">
          {!isAuthenticated() ? (
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>
          ) : null}
          {!isAuthenticated() ? (
            <li>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          ) : null}
          {isAuthenticated() ? (
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
          ) : null}
          {isAuthenticated() ? (
            <li>
              <a
                className="nav-link"
                onClick={props.logoutUser}
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}
