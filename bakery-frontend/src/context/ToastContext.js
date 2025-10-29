import React, { createContext, useContext, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const iconStyle = { marginRight: "0.5rem", verticalAlign: "middle" };
  
  // Check if current path is an admin page using window.location
  const isAdminPage = window.location.pathname.startsWith('/admin');

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            // Customer: Solid pink with sharp corners
            // Admin: Solid blue with sharp corners
            background: toast.type === "error" 
              ? (isAdminPage 
                  ? "#f44336" // Admin error: solid red
                  : "#f44336") // Customer error: solid red
              : (isAdminPage 
                  ? "#5f72e4" // Admin success: solid blue
                  : "#e91e63"), // Customer success: solid pink
            color: "#fff",
            padding: "1rem 1.5rem",
            borderRadius: "0", // Sharp corners for both
            boxShadow: isAdminPage 
              ? "0 8px 24px rgba(72, 52, 223, 0.35), 0 2px 8px rgba(0,0,0,0.2)" // Admin: blue shadow
              : "0 8px 24px rgba(255, 64, 129, 0.35), 0 2px 8px rgba(0,0,0,0.15)", // Customer: pink shadow
            zIndex: 9999,
            minWidth: "280px",
            maxWidth: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "0.95rem",
            backdropFilter: "blur(10px)",
            border: isAdminPage 
              ? "2px solid rgba(255,255,255,0.2)" // Admin: thicker border
              : "1px solid rgba(255,255,255,0.3)", // Customer: subtle border
            animation: "slideDown 0.3s ease-out",
            letterSpacing: "0.3px",
          }}
        >
          {toast.type === "success" ? (
            <CheckCircleIcon style={{
              ...iconStyle,
              fontSize: "1.4rem",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }} />
          ) : (
            <ErrorIcon style={{
              ...iconStyle,
              fontSize: "1.4rem",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            }} />
          )}
          {toast.message}
        </div>
      )}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};
