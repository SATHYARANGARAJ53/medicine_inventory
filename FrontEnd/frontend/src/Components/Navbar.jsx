import { Link } from "react-router-dom";
import "./Navbar.css";
import icon from "../assets/R.png"
export default function Navbar(props) {
  return (
    <nav className="nav navbar bg-dark pt-4 pb-4">
      <div>
        <Link className="navbar-brand" to="/">
          <span style={{ fontSize: "1.5em" }} className="spanImg">
            <span style={{ fontWeight: 500, color: "red" }}>MED</span><img src={icon} alt="navbarIcon" /><span className="text-light">VAULT</span>
          </span>
        </Link>
      </div>

      <div>
        <ul className="navbar">
          
            <li className="nav-item">
              <Link className="nav-link text-light" to="/">
                Home
              </Link>
            </li>
          
           
            <li>
              <Link className="nav-link text-light" to="/dashboard">
                DashBoard
              </Link>
            </li>

            <li>
              <Link className="nav-link text-light" to="/orders">
                Purchases
              </Link>
            </li>

            <li className="nav-item text-light">
              <Link className="nav-link text-light" to="/reports">
                Reports
              </Link>
            </li>
          
          
            <li>
              <a
                className="nav-link text-light"
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