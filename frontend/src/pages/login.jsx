import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice'; // Import loginSuccess action

function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get the redirect URL from the query params
  const query = new URLSearchParams(location.search);
  const redirectUrl = query.get('redirect') || '/';

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = { email, password };

    try {
      const response = await axios.post(`${apiUrl}/api/login`, loginData);

      // Dispatch login success with user and token to Redux
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user,
      }));

      // Store token and user in cookies
      Cookies.set('token', response.data.token, { expires: 1 });
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 });

      navigate(redirectUrl); // On successful login, navigate to the redirect URL
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const registerData = {
      name: username,
      email,
      password,
    };

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/register`, registerData);

      // Dispatch login success after registration
      dispatch(loginSuccess({
        token: response.data.token,
        user: response.data.user,
      }));

      // Store token and user in cookies
      Cookies.set('token', response.data.token, { expires: 1 });
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 1 });

      setIsLogin(true); // Switch to login mode
      navigate(redirectUrl); // Navigate to redirect URL
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Registration failed.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg max-w-4xl w-full">
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center">
          <img
            src="/image/login.jpg"
            alt="Login"
            className="w-full h-auto max-h-full object-cover rounded-t-lg md:rounded-l-lg"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 h-full p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <button
              className={`mr-4 p-2 text-lg font-bold ${isLogin ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`p-2 text-lg font-bold ${!isLogin ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <div className="flex-grow flex flex-col justify-between">
            {isLogin ? (
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="flex-grow">
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    {loading ? 'Loading...' : 'Login'}
                  </button>
                  {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
                </form>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleRegister} className="flex-grow">
                  <div className="mb-4">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your Full Name"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    {loading ? 'Loading...' : 'Register'}
                  </button>
                  {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
