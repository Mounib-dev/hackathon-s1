/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message.content]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
