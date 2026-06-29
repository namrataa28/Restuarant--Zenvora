import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-gold-900/30 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-bold tracking-widest text-gold-500 font-serif">ZENVORA</h2>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              An exquisite culinary journey crafting unforgettable memories with the finest ingredients and gold-standard hospitality.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gold-500 hover:text-gold-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-white font-semibold text-lg tracking-wider font-serif mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-gold-500 transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-gold-500 transition-colors text-sm">Our Menus</Link>
              </li>
              <li>
                <Link to="/book_table" className="hover:text-gold-500 transition-colors text-sm">Book a Table</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-500 transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-500 transition-colors text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours Column */}
          <div>
            <h3 className="text-white font-semibold text-lg tracking-wider font-serif mb-4">Hours of Service</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-gold-500" />
                <div>
                  <span className="block text-gray-300">Monday - Friday</span>
                  <span className="text-gray-500">11:00 AM - 11:00 PM</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-gold-500" />
                <div>
                  <span className="block text-gray-300">Saturday - Sunday</span>
                  <span className="text-gray-500">09:00 AM - 12:00 AM</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-lg tracking-wider font-serif mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                <span>123 Restaurant Street, Your City, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <span>reservations@zenvora.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gold-900/10 mt-12 pt-8 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Zenvora Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
