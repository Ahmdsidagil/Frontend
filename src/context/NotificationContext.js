// src/context/NotificationContext.js
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Selamat Datang!",
      description: "Anda berhasil masuk ke sistem.",
    },
  ]);

  const toggleNotification = (enabled) => {
    setNotifEnabled(enabled);

    if (!enabled) {
      console.log("🔕 Notifikasi dimatikan");
      setNotifications([]);
    } else {
      console.log("🔔 Notifikasi diaktifkan");
      setNotifications([
        {
          id: 1,
          title: "Notifikasi Dihidupkan",
          description: "Anda akan kembali menerima pemberitahuan.",
        },
      ]);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifEnabled,
        toggleNotification,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
