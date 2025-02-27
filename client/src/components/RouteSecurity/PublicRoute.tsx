import { Navigate, Outlet } from "react-router-dom";

function PublicRoutes() {
  let user = localStorage.getItem("user");

  if (user) {
    if (user.length < 1) {
      user = null;
    } else user = localStorage.getItem("user");
  }

  return !user ? <Outlet /> : <Navigate to="/" />;
}

export default PublicRoutes;
