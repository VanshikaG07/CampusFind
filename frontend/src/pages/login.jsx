import { useState } from "react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Login failed");
        return;
      }

      setMessage("Login successful!");

      console.log("Logged in user:", data.user);

      // We can redirect to the home page later
      // window.location.href = "/";
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to the backend.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-logo">🔎</div>
          <h1>CampusFind</h1>
          <p>Find what you need, right on campus.</p>
        </div>

        <div className="auth-title">
          <h2>Welcome back!</h2>
          <p>Log in to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="email">College Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="auth-button">
            Log In
          </button>

          {message && (
            <p style={{ marginTop: "12px", textAlign: "center" }}>
              {message}
            </p>
          )}

        </form>

        <p className="auth-switch">
          Don't have an account?
          <a href="/register"> Sign up</a>
        </p>

      </div>
    </div>
  );
}

export default Login;