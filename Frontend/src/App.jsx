import AdminDashBoard from "./pages/AdminDashBoard";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/admin" element={<AdminDashBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
