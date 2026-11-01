import React, { useEffect } from "react";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, XIcon } from "lucide-react";

const ICONS = { success: CircleCheckIcon, error: CircleAlertIcon, info: InfoIcon };
const AUTO_DISMISS_MS = 5000;

export function Notice({ text, type = "info", onClose }) {
  useEffect(() => {
    if (!text || !onClose || type === "error") return undefined;
    const t = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [text, type, onClose]);

  if (!text) return null;
  const Icon = ICONS[type] || InfoIcon;

  return (
    <div className="toast-region">
      <div className={`notice notice-${type} toast`} role={type === "error" ? "alert" : "status"}>
        <Icon size={18} className="toast-icon" />
        <div className="toast-text">{text}</div>
        {onClose && (
          <button onClick={onClose} className="toast-close" aria-label="Dismiss notification">
            <XIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
