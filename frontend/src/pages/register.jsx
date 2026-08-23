import "./Register.css";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-logo">🔎</div>
          <h1>CampusFind</h1>
          <p>Find what you need, right on campus.</p>
        </div>

        <div className="auth-title">
          <h2>Create an account</h2>
          <p>Join your campus marketplace</p>
        </div>

        <form className="auth-form">

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">College Email</label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your college email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?
          <a href="/login"> Log in</a>
        </p>

      </div>
    </div>
  );
}

export default Register;