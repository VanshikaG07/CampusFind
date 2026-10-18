import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const path = window.location.pathname;

  if (path === "/login") {
    return <Login />;
  }

  if (path === "/register") {
    return <Register />;
  }

  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

export default App;