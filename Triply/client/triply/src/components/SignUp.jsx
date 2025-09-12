import React, { useContext, useEffect, useState } from 'react';
// Add custom keyframes for fade-up and fade-down
const fadeUpDownStyles = `
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(32px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes fadeDown {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(32px); }
}
`;
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SubmitContext } from '../context/SubmitProvider';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Signup() {

  const { handleSubmit, handleInput, errors, success, setSuccess } = useContext(SubmitContext);
  const [showBanner, setShowBanner] = useState(false);
  const [fadeState, setFadeState] = useState(''); // '' | 'up' | 'down'
  const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        document.title = "Sign Up";
    }, []);

    useEffect(() => {
      if (success) {
        setShowBanner(true);
        setFadeState('up');
        const timer = setTimeout(() => {
          setFadeState('down');
          setTimeout(() => {
            setShowBanner(false);
            if (typeof setSuccess === 'function') setSuccess(false);
          }, 400); // match transition duration
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        setShowBanner(false);
        setFadeState('');
      }
    }, [success, setSuccess]);
    

  return (
    <section data-aos="fade-up" data-aos-duration="1000" className="flex flex-col items-center justify-center min-h-[70vh] bg-white px-4">
      {/* Inject custom keyframes for fade up/down */}
      <style>{fadeUpDownStyles}</style>
      {showBanner && (
        <div
          className={`absolute -top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-200 text-green-900 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold mt-6
            ${fadeState === 'up' ? 'animate-[fadeUp_0.4s_ease-in-out]' : ''}
            ${fadeState === 'down' ? 'animate-[fadeDown_0.4s_ease-in-out] pointer-events-none' : ''}`}
        >
          <img src="/plane.png" alt="Success" className="w-8 h-8" />
          Sign Up Successful
        </div>
      )}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8" style={{ boxShadow: '0 -4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src='/plane.png' className='w-[60px]' alt="Plane icon" />
          <h2 className="text-2xl font-bold text-black text-center">Sign Up</h2>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate id="signup">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
            <input type="text" id="name" onChange={handleInput} name="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
            {errors.name && <span className='text-red-500 block mt-2'>{errors.name}</span>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input type="email" id="email" onChange={handleInput} name="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
            {errors.email && <span className='text-red-500 block mt-2'>{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={handleInput}
                name="password"
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
            {errors.password && <span className='text-red-500 block mt-2'>{errors.password}</span>}
          </div>
          <button type="submit" className="mt-4 bg-transparent text-black border-2 cursor-pointer hover:bg-black hover:text-white font-semibold py-2 rounded-lg transition duration-200">Sign Up</button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">Already have an account? <Link to={'/login'} className="text-blue-600 hover:underline">Login</Link></p>
      </div>
    </section>
  );
}

export default Signup;