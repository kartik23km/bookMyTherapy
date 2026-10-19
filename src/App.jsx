import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  loginAsAdmin,
  logout,
  toggleAdmin,
} from "./store/slices/authSlice";
import { showToast } from "./store/slices/uiSlice";
import { MOCK_USER } from "./data/mockData";

// Client pages
import HomePage from "./pages/client/HomePage";
import SessionsPage from "./pages/client/SessionsPage";
import SessionDetailPage from "./pages/client/SessionDetailPage";
import BookingPage from "./pages/client/BookingPage";
import BookingSuccessPage from "./pages/client/BookingSuccessPage";
import MyBookingsPage from "./pages/client/MyBookingsPage";
import BookingDetailPage from "./pages/client/BookingDetailPage";
import LoginPage from "./pages/client/LoginPage";
import ProfilePage from "./pages/client/ProfilePage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSessionsPage from "./pages/admin/AdminSessionsPage";
import AdminSessionFormPage from "./pages/admin/AdminSessionFormPage";
import AdminTagsPage from "./pages/admin/AdminTagsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

// Admin route guard — in this prototype, auto-elevates to admin if not already
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  // Prototype shortcut: navigating directly to /admin auto-signs you in as admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      dispatch(loginAsAdmin());
    }
  }, [isAuthenticated, isAdmin, dispatch]);

  // Show nothing briefly while we elevate
  if (!isAuthenticated || !isAdmin) return null;

  return children;
}

// Dev prototype switcher bar
function DevBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useSelector((s) => s.auth);
  const [open, setOpen] = React.useState(false);

  const handleLoginUser = () => {
    dispatch(login(MOCK_USER));
    dispatch(
      showToast({ message: `Signed in as ${MOCK_USER.name}`, type: "success" }),
    );
    setOpen(false);
  };

  const handleLoginAdmin = () => {
    dispatch(loginAsAdmin());
    dispatch(showToast({ message: "Switched to Admin mode", type: "success" }));
    navigate("/admin");
    setOpen(false);
  };

  const handleToggleAdmin = () => {
    dispatch(toggleAdmin());
    dispatch(
      showToast({
        message: isAdmin ? "Switched to user view" : "Switched to admin view",
        type: "info",
      }),
    );
    if (isAdmin) navigate("/");
    else navigate("/admin");
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: "Signed out", type: "info" }));
    navigate("/");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#24332F] text-white text-xs font-semibold shadow-xl hover:bg-[#356B5F] transition-colors"
        title="Prototype navigation"
      >
        <span className="w-2 h-2 rounded-fullbg-primary animate-pulse" />
        Prototype
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl border border-border shadow-2xl p-4 w-56">
          <p className="text-xs font-bold text-muted uppercase tracking-wide mb-3">
            Dev Switcher
          </p>
          {isAuthenticated ? (
            <>
              <p className="text-xs text-text-secondary mb-3 truncate">
                {isAdmin ? "🔧 Admin: " : "👤 User: "}
                {user?.name}
              </p>
              <div className="space-y-1.5">
                <button
                  onClick={handleToggleAdmin}
                  className="w-full text-left text-xs px-3 py-2 rounded-xl bg-[#EBF2F0] text-primary font-semibold hover:bg-[#D5E8E3] transition-colors"
                >
                  {isAdmin ? "← Switch to User" : "→ Switch to Admin"}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-xs px-3 py-2 rounded-xl border border-border text-[#C96A6A] font-medium hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <button
                onClick={handleLoginUser}
                className="w-full text-left text-xs px-3 py-2 rounded-xl bg-[#EBF2F0] text-primary font-semibold hover:bg-[#D5E8E3]"
              >
                Sign in as User
              </button>
              <button
                onClick={handleLoginAdmin}
                className="w-full text-left text-xs px-3 py-2 rounded-xl bg-[#24332F] text-white font-semibold hover:bg-[#356B5F]"
              >
                Sign in as Admin
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Client routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <AdminRoute>
              <AdminSessionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sessions/create"
          element={
            <AdminRoute>
              <AdminSessionFormPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sessions/:id/edit"
          element={
            <AdminRoute>
              <AdminSessionFormPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tags"
          element={
            <AdminRoute>
              <AdminTagsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Prototype dev switcher */}
      <DevBar />
    </>
  );
}
