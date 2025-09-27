import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
      console.log(err);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="card w-full max-w-md bg-gray-800 shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-400">
          {isLoginForm ? "Login" : "Sign Up"}
        </h2>

        <div className="space-y-4">
          {!isLoginForm && (
            <>
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter your last name"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-300 font-medium mb-1">Email</label>
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <div className="mt-6">
          <button
            onClick={isLoginForm ? handleLogin : handleSignUp}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            {isLoginForm ? "Login" : "Sign Up"}
          </button>
        </div>

        <p
          className="text-center text-gray-400 mt-4 cursor-pointer hover:text-green-400 transition"
          onClick={() => setIsLoginForm((prev) => !prev)}
        >
          {isLoginForm
            ? "New user? Sign up here"
            : "Existing user? Login here"}
        </p>
      </div>
    </div>
  );
};

export default Login;
