import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🔎</span>
        <span>CampusFind</span>
      </div>

      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="/browse">Browse</a>
        <a href="/rent">Rent</a>
        <a href="/requests">Requests</a>
      </div>

      <div className="navbar-actions">
        <a href="/login" className="login-link">
          Login
        </a>

        <a href="/register" className="register-button">
          Sign Up
        </a>
      </div>
    </nav>
  );
}

export default Navbar;