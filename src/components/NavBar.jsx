import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { YOUTUBE_SEARCH_SUGGESTIONS_API } from "../utils/videoConstants";
import { cacheResults } from "../utils/searchSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const searchCache = useSelector((store) => store.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoverSuggestion, setHoverSuggestion] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      if (searchCache[searchQuery]) {
        setSuggestions(searchCache[searchQuery]);
      } else {
        getSearchSuggestions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getSearchSuggestions = async () => {
    try {
      const data = await fetch(
        YOUTUBE_SEARCH_SUGGESTIONS_API + encodeURIComponent(searchQuery)
      );
      const jsonData = await data.json();
      setSuggestions(jsonData[1]);
      dispatch(cacheResults({ [searchQuery]: jsonData[1] }));
    } catch {
      // suggestion fetch failed silently
    }
  };

  const handleSearch = (query) => {
    const term = query || searchQuery;
    if (!term) return;
    setSearchQuery(term);
    setShowSuggestions(false);
    navigate({
      pathname: "/results",
      search: createSearchParams({ search_query: term }).toString(),
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      return navigate("/login");
    } catch (err) {
      // Error logic maybe redirect to error page
      console.log(err);
    }
  };

  return (
    <div className="bg-base-300 relative flex flex-wrap items-center px-4 py-2 gap-y-2">
      {/* Row 1 – Left: Logo */}
      <div className="flex-1 order-1">
        {user ? (
          <Link to="/" className="btn btn-ghost text-xl">
            👩‍💻 DevTinder
          </Link>
        ) : (
          <span className="btn btn-ghost text-xl cursor-default">
            👩‍💻 DevTinder
          </span>
        )}
      </div>

      {/* Row 1 – Right: Welcome + Avatar (always visible) */}
      {user && (
        <div className="flex-none flex items-center gap-2 order-2 md:order-3 md:flex-1 md:justify-end self-center md:self-auto">
          <div className="form-control hidden sm:block">
            Welcome, {user.firstName}
          </div>
          <div className="dropdown dropdown-end mx-2 sm:mx-5 flex">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-8 sm:w-10 rounded-full">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <Link to="/premium">Premium</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Row 2 on small / inline on md+: Videos button + Search bar */}
      {user && (
        <div className="order-3 md:order-2 w-full md:w-auto flex items-center gap-2 justify-start md:flex-1 md:justify-center">
          <Link to="/videos" className="btn btn-ghost btn-sm text-sm whitespace-nowrap">
            🎬 Videos
          </Link>

          {/* Search Bar */}
          <div className="relative">
            <form
              className="flex"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <input
                value={searchQuery}
                placeholder="Search videos"
                className="input input-bordered input-sm w-44 sm:w-52 md:w-44 lg:w-64 rounded-r-none"
                type="text"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => !hoverSuggestion && setShowSuggestions(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-sm bg-white text-black border border-base-300 rounded-l-none hover:bg-gray-100"
              >
                🔍
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="absolute z-50 bg-base-100 shadow-lg rounded-lg mt-1 w-full max-h-60 overflow-y-auto"
                onMouseOver={() => setHoverSuggestion(true)}
                onMouseOut={() => setHoverSuggestion(false)}
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion + index}
                    className="px-4 py-2 cursor-pointer hover:bg-base-200 text-sm"
                    onClick={() => handleSearch(suggestion)}
                  >
                    🔍 {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NavBar;
