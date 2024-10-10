import React, { useState } from 'react';

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-row bg-white rounded-lg shadow-lg max-w-4xl w-full">
        {/* Image Section */}
        <div className="w-1/2 h-full flex items-center justify-center"> {/* Added flex properties */}
          <img
            src="/image/login.jpg"
            alt="Login"
            className="w-full h-auto max-h-full object-cover rounded-l-lg"
          />
        </div>

        {/* Login and Registration Form Section */}
        <div className="w-1/2 h-full p-8 flex flex-col justify-center">
          {/* Toggle Buttons */}
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
                <form action="/login" method="POST" className="flex-grow">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Login
                  </button>
                  <p className="mt-4 text-center text-red-500"></p>
                </form>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form action="/register" method="POST" className="flex-grow">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="Your First Name"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Your Last Name"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Register
                  </button>
                  <p className="mt-4 text-center text-red-500"></p>
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
