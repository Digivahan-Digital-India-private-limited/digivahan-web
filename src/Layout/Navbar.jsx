import React, { useState } from "react";
import logo from "../assets/Group 8.png";
import { Link } from "react-router-dom";
import { FaBars, FaStore, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const adminToken = Cookies.get("admin_token");
  const userToken = Cookies.get("user_token");

  return (
    <header className="w-full bg-white shadow-lg mb-1 z-50">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
        {/* Left + Center (Logo + Pages) */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img
              src={logo}
              alt="Digivahan Logo"
              className="h-14 sm:h-16 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-5 text-gray-700 font-medium">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/order-qr">Order QR</Link>
            </li>
            <li>
              <Link to="/visit-us-page">Visit Us</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {adminToken ? (
            <Link
              to="/admin-panel"
              className="text-yellow-500 font-semibold hover:text-yellow-600 transition"
            >
              Dashboard
            </Link>
          ) : userToken ? (
            <Link
              to="/dashboard"
              className="text-sky-600 font-semibold hover:text-sky-700 transition"
            >
              My Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sky-600 font-semibold hover:text-sky-700 transition"
            >
              User Login
            </Link>
          )}
          {!adminToken && !userToken && (
            <Link
              to="/login-page"
              className="text-yellow-500 font-semibold hover:text-yellow-600 transition"
            >
              Admin Login
            </Link>
          )}

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-300 via-yellow-400 to-orange-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_0_0_1px_rgba(251,191,36,0.55),0_0_20px_rgba(251,191,36,0.5)] ring-1 ring-amber-200/70 transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(251,191,36,0.7),0_0_28px_rgba(251,191,36,0.65)]"
          >
            <FaStore className="text-[13px]" />
            <span>Open Marketplace</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-3 border-t border-gray-100">
          <ul className="flex flex-col gap-3 text-gray-700 font-medium text-base">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/order-qr" onClick={() => setIsOpen(false)}>
                Order QR
              </Link>
            </li>
            <li>
              <Link to="/visit-us-page" onClick={() => setIsOpen(false)}>
                Visit Us
              </Link>
            </li>
            <li>
              <Link to="/about-us" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-4">
            {adminToken ? (
              <Link
                to="/admin-panel"
                onClick={() => setIsOpen(false)}
                className="text-yellow-500 font-semibold text-center hover:text-yellow-600 transition"
              >
                Dashboard
              </Link>
            ) : userToken ? (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-sky-600 font-semibold text-center hover:text-sky-700 transition"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-sky-600 font-semibold text-center hover:text-sky-700 transition"
                >
                  User Login
                </Link>
                <Link
                  to="/login-page"
                  onClick={() => setIsOpen(false)}
                  className="text-yellow-500 font-semibold text-center hover:text-yellow-600 transition"
                >
                  Admin Login
                </Link>
                <Link
                  to="/visit-us-page"
                  onClick={() => setIsOpen(false)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md text-center hover:bg-yellow-600 transition font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}

            <Link
              to="/marketplace"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-300 via-yellow-400 to-orange-300 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_0_1px_rgba(251,191,36,0.55),0_0_20px_rgba(251,191,36,0.5)] ring-1 ring-amber-200/70 transition"
            >
              <FaStore className="text-[13px]" />
              <span>Open Marketplace</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
