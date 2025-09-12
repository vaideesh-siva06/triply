
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css'


function Home() {

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        document.title = "Triply";
    })

  return (
    <>
    <section  className="w-full min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-center px-4 md:px-12 lg:px-32 mb-[-100px]">
        <div data-aos="fade-up" data-aos-duration="1500">
            <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-4">Welcome to Triply!</h1>
            <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover, plan, and simplify your next adventure. Triply helps you map out your journeys and keep everything organized in one place.
            </p>
            <div className="flex gap-4 justify-center">
                <Link to="/signup"><button className="cursor-pointer bg-white border border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition duration-200">Sign Up</button></Link>
                <Link to="/login"><button className="cursor-pointer bg-white border border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition duration-200">Login</button></Link>
            </div>
        </div>
      </section>

      <section data-aos="fade-up" data-aos-duration="1500" data-aos-delay="150" className="w-full py-12 md:py-16 bg-white flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 lg:gap-32 px-4 md:px-12 lg:px-32 mb-10">
        <img src="/earth.png" alt="Plan trips" className="w-[200px] md:w-[320px] lg:w-[470px] max-w-full rounded-xl mb-6 md:mb-0" />
        <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-black mb-4">All-in-One Planning</h2>
            <p className="text-lg text-gray-700 mb-4">Organize flights, stays, and activities in one place. No more juggling between apps or spreadsheets. Triply makes travel planning simple and fun.</p>
            <Link to="/signup"><button className="cursor-pointer bg-white border mt-8 border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-3 hover:gap-4 ease-in-out">Get Started <FaArrowRight/></button></Link>
        </div>
      </section>

      <section data-aos="fade-up" data-aos-duration="1500" data-aos-delay="150" className="w-full py-12 md:py-16 bg-blue-50 flex flex-col md:flex-row-reverse items-center justify-center gap-8 md:gap-20 lg:gap-32 px-4 md:px-12 lg:px-32 mb-10">
        <img src="/destination.png" alt="Collaborate" className="w-[200px] md:w-[320px] lg:w-[470px] max-w-full rounded-xl mb-6 md:mb-0" />
        <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-black mb-4 mt-20">Explore & Navigate</h2>
            <p className="text-lg text-gray-700 mb-4">Search locations, view routes, and explore destinations with interactive maps. Planning your trip has never been more visual and intuitive!</p>
            <Link to="/signup"><button className="cursor-pointer mt-8 bg-transparent border border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-3 hover:gap-4 ease-in-out mb-[150px]">Get Started <FaArrowRight/></button></Link>
        </div>
      </section>

      <section data-aos="fade-up" data-aos-duration="1500" data-aos-delay="150" className="w-full py-12 md:py-16 bg-white flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 lg:gap-32 px-4 md:px-12 lg:px-32 mb-10">
        <img src="/ai.png" alt="AI trip planning" className="w-[200px] md:w-[320px] lg:w-[470px] max-w-full rounded-xl mb-6 md:mb-0" />
        <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold text-black mb-4">AI-Powered Trip Planning</h2>
          <p className="text-lg text-gray-700 mb-4">Let Triply's smart AI, connected with Gemini, help you plan the perfect trip. Get personalized recommendations for destinations, activities, and accommodations based on your interests, budget, and travel style. Our AI takes the hassle out of planning, so you can focus on enjoying your journey.</p>
          <Link to="/signup"><button className="cursor-pointer bg-white border mt-8 border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition-all duration-200 flex items-center gap-3 hover:gap-4 ease-in-out">Get Started <FaArrowRight/></button></Link>
        </div>
      </section>

      <section data-aos="fade-up" data-aos-duration="1500" data-aos-delay="150" className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-100 text-center px-4 md:px-12 lg:px-32">
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 mt-10 md:mt-20">Ready to start your journey?</h2>
            <p className="text-lg text-gray-700 max-w-2xl text-center mb-8">Sign up now to unlock all features, or log in to continue planning your next adventure with Triply.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <Link to="/signup"><button className="cursor-pointer bg-white border border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition duration-200 w-full sm:w-auto">Sign Up</button></Link>
                <Link to="/login"><button className="cursor-pointer bg-white border border-black text-black font-semibold py-3 px-8 rounded-lg shadow hover:bg-black hover:text-white transition duration-200 w-full sm:w-auto">Login</button></Link>
            </div>
        </div>
      </section>
    </>
  );
}

export default Home