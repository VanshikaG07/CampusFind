import "./navbar.css";

function Navbar() {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

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
        {token && user && (
          <>
            <a href="/profile">Profile</a>
            <a href="/create-resource">Post Resource</a>
            <a href="/requests/create">Post Request</a>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {token && user ? (
          <>
            <span className="user-name">
              👤 {user.full_name}
            </span>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="login-link">
              Login
            </a>

            <a href="/register" className="register-button">
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;