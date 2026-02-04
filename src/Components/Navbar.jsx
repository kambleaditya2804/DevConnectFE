import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { useState } from "react";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      navigate("/login");
      setDropdownOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-gray-100 shadow-md z-50">
      <div className="navbar px-5 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-400 hover:text-green-300 transition pl-3"
        >
          DevConnect
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            {/* Welcome Message */}
            <div className="bg-gray-800 text-green-400 font-semibold px-4 py-2 rounded-lg shadow-sm text-center">
              Welcome, {user.firstName}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-ghost btn-circle avatar hover:bg-gray-700 transition"
              >
                <div className="w-10 h-10 rounded-full border border-gray-500 overflow-hidden">
                  <img alt="User Photo" src={user.photoURL} />
                </div>
              </div>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-52 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg shadow-lg p-2 z-50">
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {/* Profile Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connections"
                      className="flex items-center gap-3 hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {/* Connections Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2h5m5-16a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Connections
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requests"
                      className="flex items-center gap-3 hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {/* Requests Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Requests
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/premium"
                      className="flex items-center gap-3 hover:bg-gray-700 rounded-md p-2 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {/* Premium Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z"
                        />
                      </svg>
                      Premium
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-400 hover:bg-gray-700 w-full p-2 rounded-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
