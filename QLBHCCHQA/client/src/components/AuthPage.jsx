import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { ShoppingBag, Sparkles } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      {/* Animated background elements */}
      <div className="background-overlay">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Floating fashion icons */}
      <div className="floating-icons">
        <Sparkles className="floating-icon icon-1" size={24} />
        <ShoppingBag className="floating-icon icon-2" size={20} />
        <Sparkles className="floating-icon icon-3" size={16} />
      </div>

      <div className="auth-wrapper">
        {/* Logo/Brand section */}
        <div className="brand-section">
          <div className="logo-container">
            <ShoppingBag className="logo-icon" size={28} />
          </div>
          <h1 className="brand-title">Nhóm 3</h1>
          <p className="brand-subtitle">
            Hệ thống Quản lý bán hàng cho cửa hàng quần áo
          </p>
        </div>
        <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
        <p className="terms-text">
          By continuing, you agree to our{" "}
          <a href="/terms" className="terms-link">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/terms" className="terms-link">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
