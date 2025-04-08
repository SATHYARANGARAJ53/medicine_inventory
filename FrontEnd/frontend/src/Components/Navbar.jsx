import { Link } from "react-router-dom";
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
                Purchases
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