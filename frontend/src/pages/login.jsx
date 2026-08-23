import "./Login.css";

function Login() {
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

        <form className="auth-form">

          <div className="form-group">
            <label htmlFor="email">College Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your college email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
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