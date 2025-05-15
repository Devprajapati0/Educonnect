import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function getInstitutionAndRoleFromPath() {
    const pathname = window.location.pathname
    const parts = pathname.split("/").filter(Boolean)
  
    const institution = parts[0] || "EduConnect"
    const role = parts[1] || "guest"
  
    return { institution, role }
}

export const  InstituteProtectRoute = () => {
  const location = useLocation();
  const institute = useSelector((state) => state.institute.institute);
  const isActive = useSelector((state) => state.institute.isActive);

//   console.log("institute", institute)
//   console.log("isActive", isActive)


  const isAuthorized = institute.isAuthicated && isActive 

   
  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

const RoleProtectedRoute = () => {
  const { institution:subdomain, role } = getInstitutionAndRoleFromPath();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const userSubdomain = user?.institution?.toLowerCase();
  const userRole = user?.role?.toLowerCase();

  console.log("userSubdomain", userSubdomain)
  console.log("userRole", userRole)

  console.log("subdomain", subdomain)
  console.log("role", role)

  const isAuthorized =
    isAuthenticated &&
    userSubdomain === subdomain &&
    userRole === role;

    console.log("isAuthorized", isAuthorized)

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to={`/${subdomain}/login`} replace state={{ from: location }} />
  );
};

export default RoleProtectedRoute;