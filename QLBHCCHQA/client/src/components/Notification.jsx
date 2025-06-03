import React from "react";
import { useOrders } from "../context/OrderContext";

const Notification = () => {
  const { notifications } = useOrders();

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications &&
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-2 p-4 rounded-lg shadow-lg flex items-center ${
              notification.type === "warning" ? "bg-red-100" : "bg-white"
            }`}
          >
            <span
              className={`${
                notification.type === "warning"
                  ? "text-red-600"
                  : "text-gray-800"
              }`}
            >
              {notification.message}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Notification;
