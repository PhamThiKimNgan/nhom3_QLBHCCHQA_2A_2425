import React, { useState } from "react";
import {
  User,
  Package,
  ShoppingCart,
  FileText,
  Bell,
  Warehouse,
  Users,
} from "lucide-react";
import "./Home.css";
import Account from "./Account";
import Product from "./Product";
import Order from "./Order";
import Invoice from "./Invoice";
import Notification from "./Notification";
import WarehousePage from "./Warehouse";
import Customer from "./Customer";

const Home = () => {
  const [activePage, setActivePage] = useState("Tài khoản");

  const menuItems = [
    { name: "Tài khoản", icon: User },
    { name: "Sản phẩm", icon: Package },
    { name: "Đặt hàng", icon: ShoppingCart },
    { name: "Hóa đơn", icon: FileText },
    { name: "Thông báo", icon: Bell },
    { name: "Kho hàng", icon: Warehouse },
    { name: "Customer", icon: Users },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "Tài khoản":
        return <Account />;
      case "Sản phẩm":
        return <Product />;
      case "Đặt hàng":
        return <Order />;
      case "Hóa đơn":
        return <Invoice />;
      case "Thông báo":
        return <Notification />;
      case "Kho hàng":
        return <WarehousePage />;
      case "Customer":
        return <Customer />;
      default:
        return null;
    }
  };

  return (
    <div className="home-flex home-h-screen home-bg-gray-100">
      {/* Sidebar */}
      <div className="home-w-64 home-bg-gradient-sidebar home-shadow-2xl home-flex home-flex-col home-flex-shrink-0">
        {/* Header */}
        <div className="home-p-6 home-border-b">
          <h2 className="home-text-2xl home-font-bold home-text-sky-800 home-text-center">
            Quản lý Cửa Hàng Quần Áo
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
            Make by Nhom3
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="home-flex-1 home-h-screen home-overflow-y-auto">
        {/* Top Bar */}
        <div className="home-bg-white home-shadow-sm home-border-b home-p-4">
          <div className="home-flex home-items-center home-justify-between">
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
