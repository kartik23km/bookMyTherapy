import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  LayoutDashboard,
  CalendarDays,
  Tag,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";
import Toast from "../ui/Toast";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/sessions", label: "Sessions", icon: CalendarDays },
  { to: "/admin/tags", label: "Tags & Concerns", icon: Tag },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#2E403B]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lgbg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">bm</span>
          </div>
          <span className="font-semibold text-white text-sm">
            bookMy<span className="text-primary">Therapy</span>
          </span>
        </Link>
        <div className="mt-2">
          <span className="text-xs text-primary font-mediumbg-primary/10 px-2 py-0.5 rounded-full">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            location.pathname === to ||
            (to !== "/admin" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-[#2E403B] hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User & logout */}
      <div className="px-3 py-4 border-t border-[#2E403B]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-fullbg-primary flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-[#2E403B] hover:text-white transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5F8F7] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#24332F] shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-60 bg-[#24332F] flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-text-secondary hover:bg-[#F5F8F7] transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm font-semiboldtext-text-primary">
                {navItems.find(
                  (n) =>
                    n.to === location.pathname ||
                    (n.to !== "/admin" && location.pathname.startsWith(n.to)),
                )?.label || "Admin"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-text-secondary hover:bg-[#F5F8F7] transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#E9A58A]" />
            </button>
            <Link
              to="/"
              className="text-xs font-medium text-primary hover:underline"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
      <Toast />
    </div>
  );
}
