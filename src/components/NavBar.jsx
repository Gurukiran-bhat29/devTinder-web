import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + '/logout', {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <div>
      {" "}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to='/' className="btn btn-ghost text-xl">Dev Tinder🧑‍💻</Link>
        </div>
        <div className="flex-none gap-2">
          <button onClick={toggleTheme} className="btn btn-circle btn-ghost">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {user && (
            <div className="dropdown dropdown-end mx-5">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <p>Welcome, {user.firstName}</p>

                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user.photoUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to='/profile' className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to='/connections'>Connections</Link>
                </li>
                <li>
                  <Link to='/requests'>Requests</Link>
                </li>
                <li>
                  <Link to='/premium'>Premium</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
