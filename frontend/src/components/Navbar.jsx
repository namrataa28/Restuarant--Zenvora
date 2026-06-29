import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useLocation } from "react-router-dom";
import { Calendar, LogOut, Package, ShoppingCart, UserCircle, Menu as MenuIcon, X } from "lucide-react";
import api from "../lib/api";

const Navbar = () => {
  const { navigate, user, setUser } = useContext(AppContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        if (!user) {
          setCartCount(0);
          return;
        }
        const res = await api.get("/cart/get");
        const items = res.data?.cart?.items || [];
        const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    loadCartCount();
  }, [user]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#050505]/90 text-white border-b border-gold-900/20 sticky top-0 z-50 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-widest text-gold-500 font-serif">ZENVORA</span>
            </Link>
          </div>

          {/* Center - Menu items (desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isActive("/") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isActive("/menu") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"
              }`}
            >
              Menus
            </Link>
            <Link
              to="/book_table"
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isActive("/book_table") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"
              }`}
            >
              Book Table
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isActive("/about") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isActive("/contact") ? "text-gold-500" : "text-gray-300 hover:text-gold-500"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right - Cart & Login/Profile */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full text-gray-300 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-300"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 p-1 rounded-full text-gray-300 hover:text-gold-500 transition-colors duration-300"
                >
                  <UserCircle size={28} className="text-gold-500" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {isProfileOpen && (
                  <div
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                    className="absolute right-0 w-48 bg-[#0B0B0B] border border-gold-900/30 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 z-50 animate-fade-in"
                  >
                    <Link
                      to="/my-bookings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gold-500/10 hover:text-gold-500 transition-all"
                    >
                      <Calendar size={16} className="mr-3 text-gold-500" />
                      My Bookings
                    </Link>
                    <Link
                      to="/my-orders"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gold-500/10 hover:text-gold-500 transition-all"
                    >
                      <Package size={16} className="mr-3 text-gold-500" />
                      My Orders
                    </Link>
                    <div className="border-t border-gold-900/10 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gold-500 text-black px-6 py-2 rounded-full hover:bg-gold-600 transition-all duration-300 font-semibold cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full text-gray-300 hover:text-gold-500"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-gold-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gold-900/10 bg-[#050505] animate-slide-down">
          <div className="flex flex-col space-y-3 px-4 py-6">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-gold-500 transition-all font-medium py-1"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-gold-500 transition-all font-medium py-1"
            >
              Menus
            </Link>
            <Link
              to="/book_table"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-gold-500 transition-all font-medium py-1"
            >
              Book Table
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-gold-500 transition-all font-medium py-1"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-gold-500 transition-all font-medium py-1"
            >
              Contact
            </Link>

            <div className="border-t border-gold-900/10 my-2 pt-4"></div>

            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gold-500 font-medium py-1">
                  <UserCircle size={24} />
                  <span>{user.name}</span>
                </div>
                <Link
                  to="/my-bookings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center text-gray-300 hover:text-gold-500 py-1"
                >
                  <Calendar size={18} className="mr-3" />
                  My Bookings
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center text-gray-300 hover:text-gold-500 py-1"
                >
                  <Package size={18} className="mr-3" />
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center w-full text-red-400 hover:text-red-300 py-1"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full bg-gold-500 text-black px-6 py-2.5 rounded-full hover:bg-gold-600 transition-all font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
