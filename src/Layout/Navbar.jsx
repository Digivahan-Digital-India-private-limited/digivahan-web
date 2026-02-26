import React, { useState } from "react";
import logo from "../assets/Group 8.png";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = Cookies.get("admin_token");

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
              className="h-12 sm:h-14 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-5 text-gray-700 font-medium">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/news-page">News</Link>
            </li>
            <li>
              <Link to="/updates-page">Updates</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Right Side Buttons */}
        {token !== undefined ? (
          <div className="hidden md:flex items-center">
            <Link
              to="/admin-panel"
              className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center">
            <Link
              to="/login-page"
              className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600 transition"
            >
              Login
            </Link>
          </div>
        )}

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
        <div className="md:hidden bg-white shadow-lg px-6 py-6 space-y-3 absolute top-18 left-0 w-full">
          <ul className="flex flex-col gap-3 text-gray-700 font-medium text-base">
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/news-page" onClick={() => setIsOpen(false)}>
                News
              </Link>
            </li>
            <li>
              <Link to="/updates-page" onClick={() => setIsOpen(false)}>
                Updates
              </Link>
            </li>
            <li>
              <Link to="/about-us" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-4">
            <Link
              to="/login-page"
              onClick={() => setIsOpen(false)}
              className="bg-yellow-500 text-white px-4 py-2 rounded text-center hover:bg-yellow-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
