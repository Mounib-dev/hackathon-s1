/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { socket } from "../socketConfig";
// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const storedNotifications =
    JSON.parse(localStorage.getItem("notifications")) || [];
  const storedUnreadCount = parseInt(localStorage.getItem("unreadCount")) || 0;

  const [notifications, setNotifications] = useState(storedNotifications);
  const [unreadCount, setUnreadCount] = useState(storedUnreadCount);

  useEffect(() => {
    // const socket = io("http://localhost:3000"); // Ensure the URL matches your backend

    socket.on("new-alert", (data) => {
      console.log("New alert received:", data);
      // setNotifications((prev) => [...prev, data.content]);
      // setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => {
        const updatedNotifications = [...prev, data.content];
        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications),
        ); // Save to localStorage
        return updatedNotifications;
      });

      setUnreadCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("unreadCount", newCount); // Save to localStorage
        return newCount;
      });
    });

    return () => {
      socket.off("new-alert"); // Correct cleanup (instead of disconnecting the socket)
    };
  }, []);
  // const addNotification = (message) => {
  //   setNotifications((prev) => [...prev, message.content]);
  //   setUnreadCount((prev) => prev + 1);
  // };

  const markAllAsRead = () => {
    setUnreadCount(0);
    localStorage.setItem("unreadCount", "0");
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
