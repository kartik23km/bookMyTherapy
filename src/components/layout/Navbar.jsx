import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { setMobileMenuOpen } from "../../store/slices/uiSlice";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isAdmin } = useSelector((s) => s.auth);
  const mobileMenuOpen = useSelector((s) => s.ui.mobileMenuOpen);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    dispatch(setMobileMenuOpen(false));
    setUserMenuOpen(false);
  }, [location.pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { to: "/sessions", label: "Explore Sessions" },
    { to: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 navbar-blur transition-all duration-400 ${
        scrolled
          ? "bg-white/96 shadow-[0_2px_24px_-4px_rgba(79,138,122,0.12)] border-b border-border"
          : "bg-white/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lgbg-primary flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-200">
              <span className="text-white font-bold text-sm">bm</span>
            </div>
            <span className="font-semiboldtext-text-primary text-base tracking-tight">
              bookMy<span className="text-primary">Therapy</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors duration-150 hover:text-primary group/nav ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-text-secondary"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5bg-primary rounded-full transition-all duration-300 ${
                    location.pathname === link.to
                      ? "w-full"
                      : "w-0 group-hover/nav:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/bookings"
                  className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  <Calendar size={16} />
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </Link>
                )}
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-border hover:border-[#4F8A7A] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-fullbg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-mediumtext-text-primary">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-muted" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-smtext-text-primary hover:bg-[#F5F8F7] transition-colors"
                      >
                        <User size={14} /> Profile
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#C96A6A] hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-fullbg-primary text-white text-sm font-medium hover:bg-[#356B5F] transition-colors"
              >
                <LogIn size={15} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-[#F5F8F7] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-3 py-2.5 rounded-lg text-sm font-mediumtext-text-primary hover:bg-[#F5F8F7] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-border" />
          {isAuthenticated ? (
            <>
              <Link
                to="/bookings"
                className="block px-3 py-2.5 rounded-lg text-sm font-mediumtext-text-primary hover:bg-[#F5F8F7] transition-colors"
              >
                My Bookings
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2.5 rounded-lg text-sm font-mediumtext-text-primary hover:bg-[#F5F8F7] transition-colors"
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2.5 rounded-lg text-sm font-mediumtext-text-primary hover:bg-[#F5F8F7] transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#C96A6A] hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2.5 rounded-lg text-sm font-mediumbg-primary text-white text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
