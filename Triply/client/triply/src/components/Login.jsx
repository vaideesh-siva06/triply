import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SubmitContext } from '../context/SubmitProvider';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
        const { handleSubmit, values, setValues, handleInput, errors, success, setErrors } = useContext(SubmitContext);
        const navigate = useNavigate();
        const [showPassword, setShowPassword] = useState(false);

        useEffect(() => {
                AOS.init({ duration: 800, once: true });
                document.title = "Login";
                setErrors({});
        }, []);

        useEffect(() => {
            if (success) {
                navigate("/", { replace: true });
            }
        }, [success, navigate]);

    return (
    <section className="flex min-h-screen">

      {/* Right side: Branding */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500" data-aos="fade-right">
        <h1 className="text-white text-6xl font-extrabold select-none">
          Triply
        </h1>
      </div>

       {/* Left side: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white px-4" data-aos="fade-up">
        <div
          className="w-full max-w-2xl h-[700px] bg-white rounded-xl shadow-md p-10"
          style={{
            boxShadow: '0 -4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex flex-col items-center gap-2 mb-6">
            <img src="/plane.png" className="w-[60px]" alt="Plane icon" />
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Login</h2>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
            id="login"
          >
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={handleInput}
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              {errors.email && (
                <span className="text-red-500 block mt-2">{errors.email}</span>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={handleInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-10"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <span className="text-red-500 block mt-2">{errors.password}</span>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 bg-transparent text-black border-2 cursor-pointer hover:bg-black hover:text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>

  );
}

export default Login