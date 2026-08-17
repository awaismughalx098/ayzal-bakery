import { useContext } from "react";

import {
  Navigate,
  useLocation
} from "react-router-dom";

import { AuthContext } from "../../context/contexts";

import "./ProtectedRoute.css";

/* ============================================
   PROTECTED ROUTE
   --------------------------------------------
   Typing /admin in the URL does not open the page.
   The token is verified with the server first,
   otherwise the user is sent to /adminlogin.

   NOTE: this is only a UI guard. The real security
   is server side — every admin API route sits behind
   the protect middleware, so no data comes back
   without a valid token.
   ============================================ */

const ProtectedRoute = ({ children }) => {

  const {
    isLoggedIn,
    checking
  } = useContext(AuthContext);

  const location = useLocation();

  /* Still verifying the token */

  if(checking){

    return (

      <div className="auth-checking">

        <div className="auth-spinner"></div>

        <p>Checking access...</p>

      </div>

    );

  }

  /* Not signed in — send to login and remember
     where they were trying to go */

  if(!isLoggedIn){

    return (
      <Navigate
        to="/adminlogin"
        state={{ from: location.pathname }}
        replace
      />
    );

  }

  return children;

};

export default ProtectedRoute;
