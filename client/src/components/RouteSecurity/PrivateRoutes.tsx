import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../Layouts/Navbar";

function PrivateRoutes() {
  let user = localStorage.getItem("user");

  if (user) {
    if (user.length > 1) {
      user = localStorage.getItem("user");
    } else user = null;
  }

  return user ? (
    <Navbar>
      <Outlet />
    </Navbar>
  ) : (
    <Navigate to="/auth" />
  );
}

export default PrivateRoutes;
