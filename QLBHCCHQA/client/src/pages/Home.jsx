import React, { useState } from "react";
import {
  User,
  Package,
  ShoppingCart,
  FileText,
  Bell,
  Warehouse,
} from "lucide-react";
import "./Home.css";

const Home = () => {
  const [activePage, setActivePage] = useState("User");

  const menuItems = [
    { name: "User", icon: User },
    { name: "Product", icon: Package },
    { name: "Order", icon: ShoppingCart },
    { name: "Invoice", icon: FileText },
    { name: "Notification", icon: Bell },
    { name: "Warehouse", icon: Warehouse },
  ];

  const renderContent = () => (
    <div className="home-flex-1 home-flex home-items-center home-justify-center home-bg-gradient">
      <div className="home-text-center home-transform">
        <div className="home-bg-white home-rounded-2xl home-shadow-2xl home-p-12 home-transform">
          <h1 className="home-text-6xl home-font-bold home-text-gray-800 home-mb-4 home-animate-pulse">
            {activePage}
          </h1>
          <div className="home-w-24 home-h-1 home-bg-gradient-bar home-mx-auto home-rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-flex home-h-screen home-bg-gray-100">
      {/* Sidebar */}
      <div className="home-w-64 home-bg-gradient-sidebar home-shadow-2xl home-flex home-flex-col">
        {/* Header */}
        <div className="home-p-6 home-border-b">
          <h2 className="home-text-2xl home-font-bold home-text-sky-800 home-text-center">
            Navigation
          </h2>
        </div>
        {/* Menu Items */}
        <nav className="home-flex-1 home-p-4">
          <ul className="home-space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActivePage(item.name)}
                    className={`home-w-full home-flex home-items-center home-px-4 home-py-3 home-rounded-xl home-font-medium home-transition-all ${
                      isActive
                        ? "home-bg-white home-text-sky-700 home-shadow-lg home-scale-105"
                        : "home-text-sky-700 home-hover-bg-sky-100"
                    }`}
                  >
                    <IconComponent className="home-mr-3" size={20} />
                    <span className="home-text-lg">{item.name}</span>
                    {isActive && (
                      <div className="home-ml-auto home-w-2 home-h-2 home-bg-sky-500 home-rounded-full home-animate-pulse"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Footer */}
        <div className="home-p-4 home-border-t">
          <div className="home-text-center home-text-sky-700 home-text-sm home-opacity-75">
            © 2024 Dashboard
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="home-flex-1 home-flex home-flex-col">
        {/* Top Bar */}
        <div className="home-bg-white home-shadow-sm home-border-b home-p-4">
          <div className="home-flex home-items-center home-justify-between">
            <h1 className="home-text-2xl home-font-semibold home-text-gray-800">
              {activePage} Management
            </h1>
            <div className="home-flex home-items-center home-space-x-2">
              <div className="home-w-3 home-h-3 home-bg-green-400 home-rounded-full home-animate-pulse"></div>
              <span className="home-text-sm home-text-gray-600">Online</span>
            </div>
          </div>
        </div>
        {/* Page Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
