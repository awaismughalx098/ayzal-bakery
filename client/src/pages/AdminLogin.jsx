import "./AdminLogin.css";
import logo from "../assets/logo.png";
import {
  useState
}
from "react";

import {
  useNavigate
}
from "react-router-dom";

const AdminLogin = () => {

  const navigate =
  useNavigate();

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const handleLogin =
  (e)=>{

    e.preventDefault();

    if(

      email ===
      "admin@ayzal.com"

      &&

      password ===
      "123456"

    ){

      navigate("/admin");

    }

    else{

      alert(
        "Invalid Credentials"
      );

    }

  };

  return(

    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="login-logo">

         <img
  src={logo}
  alt="AYZAL"
/>

        </div>

        <h1>
          Admin Login
        </h1>

        <p>
          Welcome back to
          AYZAL Baking Studio
        </p>

        <form
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e)=>
              setEmail(
                e.target.value
              )
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <button type="submit">

            Login

          </button>

        </form>

      </div>

    </div>

  );

};

export default AdminLogin;