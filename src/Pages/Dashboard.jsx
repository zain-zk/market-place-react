import React from "react";
import { FaWrench, FaUsers, FaClipboardList } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import ThemeLight from "../Components/ThemeLight";

export default function LandingPage() {
  return (
    <div className="bg-black loginbglight text-white min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex  justify-center gap-240 loginbglight  px-8 py-5 bg-black border-b border-green-800 sticky top-0 z-50">
        <div>
        <h1 className="text-3xl font-extrabold text-green-500 tracking-wide cursor-pointer hover:scale-105 transition">
          FixItNow
        </h1>
        </div>
        <div className="flex justify-end gap-5">
        <Link to={'/login'} className="flex bg-green-600 px-6 py-2 rounded-full text-lg font-medium hover:bg-green-500 hover:scale-105 transition">Get Started</Link>
        <ThemeLight  />
      </div>
      </nav>
      <div >
    </div>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row  items-center justify-between px-10 py-20 bg-gradient-to-r from-black via-green-950 to-black">
        <div className="max-w-xl">
          <h2 className="text-5xl font-extrabold leading-tight text-green-400 drop-shadow-lg">
            Find Trusted Experts for Every Job
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed">
            Post a job in minutes, get multiple bids from service providers, and hire with confidence.  
            From plumbing to electrical to home repairs — we’ve got your back.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-500 hover:scale-105 transition">
              Post a Job
            </button>
            <button className="border border-green-500 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white hover:scale-105 transition">
              Become a Provider
            </button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
          alt="Home Repair Service"
          className="rounded-2xl shadow-2xl mt-12 md:mt-0 md:ml-12 w-full md:w-1/2 hover:scale-105 transition"
        />
      </section>

      {/* Features */}
      <section className="py-20 px-10 bg-black">
        <h3 className="text-3xl font-bold text-center text-green-400 mb-14">
          Why Choose FixItNow?
        </h3>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-green-950 rounded-xl shadow hover:scale-105 hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"

              alt="Verified Experts"
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <FaWrench className="text-5xl text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">Verified Experts</h4>
            <p className="text-gray-400 mt-3">Hire from a pool of trusted service providers near you.</p>
          </div>
          <div className="p-8 bg-green-950 rounded-xl shadow hover:scale-105 hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
              alt="Quick Job Posting"
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <FaClipboardList className="text-5xl text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">Quick Job Posting</h4>
            <p className="text-gray-400 mt-3">Post your requirements and get bids within minutes.</p>
          </div>
          <div className="p-8 bg-green-950 rounded-xl shadow hover:scale-105 hover:shadow-lg transition">
            <img
              src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop"
              alt="Secure Payments"
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <AiOutlineCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">Safe & Secure</h4>
            <p className="text-gray-400 mt-3">Payments are only released once the job is completed.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-10 bg-gradient-to-r from-green-950 via-black to-green-950">
        <h3 className="text-3xl font-bold text-center text-green-400 mb-14">
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Post a Job"
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <MdWork className="text-5xl text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">1. Post a Job</h4>
            <p className="text-gray-300 mt-2">Describe your task, budget, and location.</p>
          </div>
          <div className="p-6 hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=800&q=80"
              alt="Get Bids"
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <FaUsers className="text-5xl text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">2. Get Bids</h4>
            <p className="text-gray-300 mt-2">Receive offers from providers with prices & availability.</p>
          </div>
          <div className="p-6 hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
              alt="Hire & Relax"
              className="h-40 w-full object-cover rounded-lg mb-4"
            />
            <AiOutlineCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold">3. Hire & Relax</h4>
            <p className="text-gray-300 mt-2">Choose the best provider and track progress easily.</p>
          </div>
        </div>
      </section>

    {/* Footer */}
<footer className="bg-black border-t border-green-800 text-gray-400 py-10 px-6">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
    {/* Branding */}
    <div>
      <h2 className="text-2xl font-bold text-green-400 mb-2">FixItNow</h2>
      <p className="text-gray-500 text-sm">
        Connecting clients and service providers seamlessly.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="font-semibold text-green-400 mb-2">Quick Links</h3>
      <ul className="space-y-1">
        
        <li>
          <a href="/register-role" className="hover:text-green-300 transition">
            Register
          </a>
        </li>
        <li>
          <a href="/login" className="hover:text-green-300 transition">
            Login
          </a>
        </li>
      </ul>
    </div>

    {/* Contact / Social */}
    <div>
      <h3 className="font-semibold text-green-400 mb-2">Contact Us</h3>
      <p className="text-gray-500 text-sm">support@fixitnow.com</p>
      <div className="flex justify-center md:justify-start mt-2 space-x-4">
        <a href="#" className="text-gray-400 hover:text-green-300 transition">FB</a>
        <a href="#" className="text-gray-400 hover:text-green-300 transition">TW</a>
        <a href="#" className="text-gray-400 hover:text-green-300 transition">IG</a>
      </div>
    </div>
  </div>

  <div className="mt-8 border-t border-green-800 pt-4 text-center text-gray-500 text-sm">
    &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
  </div>
</footer>

    </div>
  );
}
