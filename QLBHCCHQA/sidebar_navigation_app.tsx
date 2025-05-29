import React, { useState } from 'react';
import { User, Package, ShoppingCart, FileText, Bell, Warehouse } from 'lucide-react';

const App = () => {
  const [activePage, setActivePage] = useState('User');

  const menuItems = [
    { name: 'User', icon: User },
    { name: 'Product', icon: Package },
    { name: 'Order', icon: ShoppingCart },
    { name: 'Invoice', icon: FileText },
    { name: 'Notification', icon: Bell },
    { name: 'Warehouse', icon: Warehouse }
  ];

  const renderContent = () => {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-500 ease-in-out">
        <div className="text-center transform transition-all duration-700 ease-out">
          <div className="bg-white rounded-2xl shadow-2xl p-12 transform hover:scale-105 transition-all duration-300">
            <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-pulse">
              {activePage}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-sky-200 to-sky-300 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-sky-400/30">
          <h2 className="text-2xl font-bold text-sky-800 text-center">
            Navigation
          </h2>
        </div>
        
        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.name;
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActivePage(item.name)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      isActive
                        ? 'bg-white text-sky-700 shadow-lg scale-105'
                        : 'text-sky-700 hover:bg-sky-100/50 hover:shadow-md'
                    }`}
                  >
                    <IconComponent 
                      className={`mr-3 transition-all duration-300 ${
                        isActive ? 'text-sky-600' : 'text-sky-600'
                      }`} 
                      size={20} 
                    />
                    <span className="text-lg">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-sky-400/30">
          <div className="text-center text-sky-700 text-sm opacity-75">
            © 2024 Dashboard
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activePage} Management
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default App;