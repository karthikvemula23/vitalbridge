import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Github,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    url: "https://github.com/karthikvemula23",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/vemula-karthik-4a3309363/",
  },
  {
    icon: Twitter,
    label: "X",
    url: "https://x.com/Karthik_v07",
  },
  {
    icon: Mail,
    label: "Email",
    url: "mailto:thekarthikvemula@gmail.com",
  },
];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo */}
          <div className="text-center md:text-left">
            <Link to="/" className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  VitalBridge
                </h2>

                <p className="text-sm text-gray-400">
                  Blood Bank Management Platform
                </p>
              </div>
            </Link>

            <p className="text-gray-400 mt-4 max-w-md">
              A modern MERN application for managing blood donors,
              inventory, hospitals, and emergency blood requests.
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-lg bg-slate-800 hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} VitalBridge. Built with React, Express.js, MongoDB &
            Tailwind CSS.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              to="/"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              to="/auth"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Login
            </Link>

            <a
              href="https://github.com/karthikvemula23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Source
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;