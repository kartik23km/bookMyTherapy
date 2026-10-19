import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { showToast } from "../../store/slices/uiSlice";
import { MOCK_USER } from "../../data/mockData";
import { Shield, Heart, Sparkles } from "lucide-react";

const SOCIAL_PROOF = [
  { emoji: "🌿", text: "Anxiety session helped me finally breathe." },
  { emoji: "💛", text: "Found a group I actually relate to." },
  { emoji: "✨", text: "The burnout session changed how I work." },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = () => {
    dispatch(login(MOCK_USER));
    dispatch(
      showToast({
        message: `Welcome back, ${MOCK_USER.name.split(" ")[0]}! 👋`,
        type: "success",
      }),
    );
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex overflow-hidden">
      {/* ── Left panel (decorative, desktop only) ── */}
      <div className="hidden lg:flex w-[45%] bg-[#24332F] relative flex-col justify-between p-12 overflow-hidden">
        {/* Animated blobs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-fullbg-primary/20 animate-blob"
          style={{ filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#E9A58A]/15 animate-blob"
          style={{ filter: "blur(60px)", animationDelay: "-4s" }}
        />

        <div className="relative z-10 animate-fade-right">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-9 h-9 rounded-xlbg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">bm</span>
            </div>
            <span className="text-white font-semibold">bookMyTherapy</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
            It's okay to need
            <br />a little support.
          </h2>
          <p className="text-muted text-base leading-relaxed">
            Discover sessions designed around what you're going through. No
            pressure. At your own pace.
          </p>
        </div>

        {/* Social proof cards */}
        <div className="relative z-10 space-y-3 animate-fade-right delay-200">
          {SOCIAL_PROOF.map((item, i) => (
            <div
              key={i}
              className="bg-[#2E403B] rounded-2xl px-4 py-3 flex items-center gap-3 reveal visible"
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              <span className="text-xl">{item.emoji}</span>
              <p className="text-muted text-sm">{item.text}</p>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex -space-x-2">
              {["#4F8A7A", "#E9A58A", "#356B5F"].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#24332F] flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  <span className="text-white text-[10px] font-bold">
                    {["K", "A", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-text-secondary text-xs">
              150+ people supported this month
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-fullbg-primary/5 animate-blob"
            style={{ filter: "blur(50px)" }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#E9A58A]/8 animate-blob"
            style={{ filter: "blur(40px)", animationDelay: "-3s" }}
          />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-down">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xlbg-primary flex items-center justify-center">
                <span className="text-white font-bold">bm</span>
              </div>
            </div>
            <h1 className="text-xl font-boldtext-text-primary">
              bookMy<span className="text-primary">Therapy</span>
            </h1>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-8 animate-fade-up">
            <h2 className="text-2xl font-boldtext-text-primary mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-text-secondary mb-8">
              Find sessions that support what you're going through.
            </p>

            {/* Google button */}
            <button
              id="google-login-btn"
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl border border-border bg-whitetext-text-primary font-medium text-sm hover:border-[#4F8A7A] hover:bg-[#F5F8F7] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-muted">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Email/password */}
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl border border-border text-smtext-text-primary placeholder:text-muted outline-none focus:border-[#4F8A7A] transition-all hover:border-[#C8DDD8] bg-[#F9FAFA]"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-border text-smtext-text-primary placeholder:text-muted outline-none focus:border-[#4F8A7A] transition-all hover:border-[#C8DDD8] bg-[#F9FAFA]"
              />
              <button
                onClick={handleLogin}
                className="w-full py-3.5 rounded-xlbg-primary text-white font-semibold text-sm hover:bg-[#356B5F] active:scale-[0.99] transition-all shadow-md shadow-[#4F8A7A]/20 hover:shadow-[#4F8A7A]/30"
              >
                Sign In
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-[#F0F4F2]">
              <div className="flex items-center gap-1 text-xs text-muted">
                <Shield size={11} className="text-primary" />
                Private & secure
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Heart size={11} className="text-[#E9A58A]" />
                No pressure
              </div>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Sparkles size={11} className="text-primary" />
                Your pace
              </div>
            </div>

            <p className="text-xs text-center text-muted mt-4">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms
              </a>{" "}
              &{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy
              </a>
              .
            </p>
          </div>

          <p className="text-center text-xs text-muted mt-4 opacity-60">
            Prototype — login is simulated
          </p>
        </div>
      </div>
    </div>
  );
}
