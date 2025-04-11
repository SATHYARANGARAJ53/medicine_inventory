import { Link } from "react-router-dom";
import "./Navbar.css";
import Orders from "../pages/Orders"
import icon from '../assets/R.png';

export default function Navbar(props) {

 let len=props.clinic;

  return (
    <nav className="navbar bg-dark pt-4 pb-4">
      <div>
        <Link className="navbar-brand" to="/">
          <span style={{ fontSize: "1.5em" }}>
            <span style={{ fontWeight: 500, color: "red" }}>MED</span><img src={icon} alt="icon" id="icon" /><span className="text-primary">VAULT</span>
          </span>
        </Link>
      </div>

      <div>
        <ul className="navbar">
          
            <li className="nav-item">
              <Link className="nav-link text-primary" to="/">
                Home
              </Link>
            </li>
          
           
            <li>
              <Link className="nav-link text-primary" to="/dashboard">
                DashBoard
              </Link>
            </li>

            <li>
              <Link className="nav-link text-primary" to="/orders">
                Notifications<span className="position-absolute top-0 start-100 translate-middle badge rounded-pi bg-danger text-light rounded-circle">{props.clinic}</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-primary" to="/reports">
                Reports
              </Link>
            </li>
          
          
            <li>
              <a
                className="nav-link text-primary"
                onClick={props.logoutUser}
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </li>
          
        </ul>
      </div>
    </nav>
  );
}
