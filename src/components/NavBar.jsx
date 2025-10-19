import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.user);
  console.log("Current user:", user);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

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
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
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
