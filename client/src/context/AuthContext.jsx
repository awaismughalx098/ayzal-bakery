import {
  useState,
  useEffect,
  useCallback
} from "react";

import {
  api,
  getToken,
  setToken,
  setUnauthorizedHandler,
  errorMessage
} from "../api";

import { AuthContext } from "./contexts";

const AuthProvider = ({ children }) => {

  const [admin, setAdmin] = useState(null);

  /* checking = we do not know yet whether the user
     is signed in. Without it ProtectedRoute would
     bounce to login on every page load, even with a
     perfectly valid token. */

  const [checking, setChecking] = useState(true);

  /* LOGOUT */

  const logout = useCallback(() => {

    setToken(null);
    setAdmin(null);

  }, []);

  /* Axios triggers a logout here whenever it sees a 401 */

  useEffect(() => {

    setUnauthorizedHandler(() => {
      setAdmin(null);
    });

  }, []);

  /* ON LOAD — verify the token with the server.
     A token sitting in localStorage does not mean
     it is actually valid. */

  useEffect(() => {

    let cancelled = false;

    const verify = async () => {

      const token = getToken();

      if(!token){

        if(!cancelled)
          setChecking(false);

        return;

      }

      try{

        const res = await api.get("/admin/me");

        if(!cancelled)
          setAdmin(res.data.admin);

      }

      catch{

        /* Expired or tampered token */

        setToken(null);

        if(!cancelled)
          setAdmin(null);

      }

      finally{

        if(!cancelled)
          setChecking(false);

      }

    };

    verify();

    return () => {
      cancelled = true;
    };

  }, []);

  /* LOGIN */

  const login = async (email, password) => {

    try{

      const res = await api.post("/admin/login", {
        email,
        password
      });

      const { token, admin: adminData } = res.data;

      if(!token){

        return {
          ok:false,
          message:"Login failed. Please try again."
        };

      }

      setToken(token);
      setAdmin(adminData);

      return { ok:true };

    }

    catch(error){

      return {
        ok:false,
        message: errorMessage(
          error,
          "Login failed. Check your connection and try again."
        )
      };

    }

  };

  return (

    <AuthContext.Provider
      value={{
        admin,
        isLoggedIn: Boolean(admin),
        checking,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export default AuthProvider;
