import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

// PropTypes for AuthForm
import PropTypes from "prop-types";

const AuthForm = ({ isLogin, setIsLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <form
      className="auth-form-container bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:scale-105"
      onSubmit={handleSubmit}
    >
      <div className="auth-toggle flex mb-8 bg-white/5 rounded-xl p-1">
        <button
          type="button"
          className={`toggle-btn flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            isLogin
              ? "bg-white text-purple-900 shadow-lg"
              : "text-white hover:bg-white/10"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          className={`toggle-btn flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            !isLogin
              ? "bg-white text-purple-900 shadow-lg"
              : "text-white hover:bg-white/10"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Đăng ký
        </button>
      </div>
      <div className="form-fields">
        {!isLogin && (
          <div className="input-group">
            <label className="input-label" htmlFor="name">
              Tên người dùng
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Tên người dùng"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
        )}
        <div className="input-group">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Mật khẩu
          </label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {!isLogin && (
          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">
              Nhập lại mật khẩu
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="login-options" style={{ marginTop: "1.5rem" }}>
        <label className="remember-me">
          <input type="checkbox" className="checkbox" />
          <span className="checkbox-text">Ghi nhớ đăng nhập</span>
        </label>
        <button type="button" className="forgot-password">
          Quên mật khẩu?
        </button>
      </div>
      <button
        type="submit"
        className="submit-btn"
        style={{ marginTop: "1.5rem" }}
      >
        {isLogin ? "Đăng nhập" : "Đăng ký"}
      </button>
      <div className="auth-switch">
        {isLogin ? (
          <>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              className="switch-btn"
              onClick={toggleAuthMode}
            >
              Đăng ký
            </button>
          </>
        ) : (
          <>
            Đã có tài khoản?{" "}
            <button
              type="button"
              className="switch-btn"
              onClick={toggleAuthMode}
            >
              Đăng nhập
            </button>
          </>
        )}
      </div>
    </form>
  );
};

AuthForm.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  setIsLogin: PropTypes.func.isRequired,
};

export default AuthForm;
