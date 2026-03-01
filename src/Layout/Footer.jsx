import React from "react";
import logo from "../assets/Group 152.png";
import {
  FaYoutube,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitter,
} from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import Digismalimg from "../assets/Group 8.png";
import { Link } from "react-router-dom";
import Playstore from "../assets/play-store.png";
import Applestore from "../assets/Apple-store.png";
export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Top section */}
      <div className="max-w-6xl mx-auto px-2 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo + Company Info */}
        <div className="space-y-3">
          <img
            src={logo}
            alt="Final Logo"
            className="h-16 w-auto object-contain"
          />
          <p className="text-xs md:text-sm text-gray-700 font-semibold">
            DIGIVAHAN DIGITAL INDIA PRIVATE LIMITED
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            CIN U62099DL2023PTC420571
          </p>
        </div>

        {/* Pages */}
        <div>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="text-gray-600 font-bold">Pages</li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about-us">About us</Link>
            </li>
            {/* <li>
              <Link to="/news-page">News</Link>
            </li> */}
            <li>
              <Link to="/updates-page">Updates</Link>
            </li>
            <li>
              <Link to="/login-page">Login</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="text-gray-600 font-bold">Support</li>
            <li>
              <Link to="/contact-page">Contact Us</Link>
            </li>
            <li>
              <Link to="/visit-us-page">Visit Us</Link>
            </li>
            <li>
              <Link to="/Raise-concern-page">Raise Concern</Link>
            </li>
            <li>
              <Link to="/Report-page">Reports</Link>
            </li>
            <li>
              <Link to="/delete-account" className="text-red-500 font-medium hover:text-red-600 transition-colors">Delete Account</Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="text-gray-600 font-bold">Company</li>
            {/* <li>About</li> */}

            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/protection-policy">Data Protection Policy</Link>
            </li>
            <li>
              <Link to="/return-refund-policy">Return & Refund Policy</Link>
            </li>

            <li>
              <Link to="/terms-and-conditions">Terms and Conditions</Link>
            </li>
          </ul>
        </div>

        {/* Available On */}
        <div className="space-y-2">
          <p className="text-gray-600 font-bold">Available on</p>
          <div className="flex flex-col gap-2">
            <Link to="https://play.google.com/store/apps/details?id=com.digivahan">
              <img
                src={Playstore}
                alt="App Download"
                className="h-8 w-auto cursor-pointer rounded-2xl"
              />
            </Link>

            <div className="relative inline-block">
              <img
                src={Applestore}
                alt="App Store"
                className="h-8 w-auto rounded-2xl opacity-60"
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white bg-black/50 rounded-2xl">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Right Part (Icons) */}
          <div className="flex items-center gap-3 text-gray-600 text-xl mt-2">
            <FaYoutube className="text-red-600 cursor-pointer" />
            <a href="https://www.facebook.com/share/1Ahif9bxWA/" target="_blank" rel="noopener noreferrer">
              <FaFacebookSquare className="text-blue-600 cursor-pointer" />
            </a>
            <FaTwitter className="text-sky-500 cursor-pointer" />
            <a href="https://www.instagram.com/digivahan?igsh=MjFjcHJ4dnRhbWkz" target="_blank" rel="noopener noreferrer">
              <FaInstagramSquare className="text-pink-500 cursor-pointer" />
            </a>
            <span className="text-blue-600 cursor-pointer">
              <FaLinkedin />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Border Line */}
      <hr />

      <div className="flex items-center justify-center gap-3">
        <img src={Digismalimg} alt="group Image" className="h-12 w-auto" />
        <p className="text-xs sm:text-sm text-gray-600">
          © 2023-2026 All rights reserved.
        </p>
      </div>
    </footer>
  );
};
