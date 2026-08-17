import "./AdminLogin.css";

import logo from "../assets/logo.png";

import {
  useState,
  useContext,
  useEffect
} from "react";

import {
  useNavigate,
  useLocation,
  Link
} from "react-router-dom";

import {
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaArrowLeft
} from "react-icons/fa";

import { AuthContext } from "../context/contexts";
import { BRAND } from "../data/menu";
import Seo from "../seo/Seo";

const AdminLogin = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isLoggedIn,
    checking
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  /* Send the user back where they came from */

  const from =
  location.state?.from || "/admin";

  /* Already signed in — go straight to the dashboard */

  useEffect(() => {

    if(!checking && isLoggedIn){
      navigate(from, { replace:true });
    }

  }, [checking, isLoggedIn, from, navigate]);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setBusy(true);

    const result = await login(
      email.trim(),
      password
    );

    setBusy(false);

    if(result.ok){

      navigate(from, { replace:true });

    }

    else{

      setError(result.message);
      setPassword("");

    }

  };

  return (

    <div className="admin-login-page">

      <Seo page="adminlogin" />


      <Link to="/" className="login-back">
        <FaArrowLeft />
        Back to site
      </Link>

      <div className="admin-login-card">

        <div className="login-logo">

          <img
            src={logo}
            alt={BRAND.name}
          />

        </div>

        <h1>Admin Login</h1>

        <p className="login-sub">
          {BRAND.name} dashboard
        </p>

        <form onSubmit={handleLogin}>

          {
            error && (

              <div
                className="login-error"
                role="alert"
              >
                {error}
              </div>

            )
          }

          <div className="login-field">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

          </div>

          <div className="login-field">

            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="login-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );

};

export default AdminLogin;
