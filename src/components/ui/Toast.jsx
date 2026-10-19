import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearToast } from "../../store/slices/uiSlice";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((s) => s.ui.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => dispatch(clearToast()), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const configs = {
    success: {
      bg: "bg-[#4F8A64]",
      icon: <CheckCircle size={18} className="text-white shrink-0" />,
    },
    error: {
      bg: "bg-error",
      icon: <AlertCircle size={18} className="text-white shrink-0" />,
    },
    info: {
      bg: "bg-primary",
      icon: <Info size={18} className="text-white shrink-0" />,
    },
  };

  const config = configs[toast.type] || configs.info;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] toast-enter">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl ${config.bg} text-white min-w-[260px] max-w-sm`}
      >
        {config.icon}
        <p className="text-sm font-medium flex-1">{toast.message}</p>
        <button
          onClick={() => dispatch(clearToast())}
          className="ml-1 text-white/60 hover:text-white transition-colors hover:rotate-90 duration-200"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
