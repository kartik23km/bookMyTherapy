import React from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#24332F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lgbg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">bm</span>
              </div>
              <span className="font-semibold text-white text-base">
                bookMy<span className="text-primary">Therapy</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Discover therapy and mental wellness sessions based on what you're
              going through. Finding the right support shouldn't be hard.
            </p>
            <p className="mt-6 text-text-secondary text-xs">
              This platform is for discovering and booking sessions only.
              Sessions are not intended to replace emergency or crisis support.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/sessions", label: "All Sessions" },
                { to: "/sessions?tag=anxiety", label: "Anxiety" },
                { to: "/sessions?tag=stress", label: "Stress" },
                { to: "/sessions?tag=burnout", label: "Burnout" },
                { to: "/sessions?tag=sleep", label: "Sleep" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "How It Works" },
                { to: "/", label: "FAQs" },
                { to: "/", label: "Contact Us" },
                { to: "/", label: "Privacy Policy" },
                { to: "/", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-muted text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#2E403B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            © 2026 bookMyTherapy. All rights reserved.
          </p>
          <p className="text-text-secondary text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-[#E9A58A]" /> for better
            mental wellbeing
          </p>
        </div>
      </div>
    </footer>
  );
}
