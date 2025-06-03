import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Edit3,
  Save,
  X,
  UserCheck,
  Crown,
} from "lucide-react";
import "./Account.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/me")
      .then((res) => res.json())
      .then((user) => {
        setUserInfo({
          name: user.name,
          email: user.email,
          role: user.role || "user",
        });
        setEditForm({ name: user.name, email: user.email });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditForm({ name: userInfo.name, email: userInfo.email });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ name: userInfo.name, email: userInfo.email });
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    await fetch("http://localhost:5000/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setUserInfo({ ...userInfo, ...editForm });
    setIsEditing(false);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? (
      <Crown className="w-5 h-5 text-yellow-500" />
    ) : (
      <UserCheck className="w-5 h-5 text-blue-500" />
    );
  };

  const getRoleBadge = (role) => {
    const baseClasses =
      "px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2";
    if (role === "admin") {
      return `${baseClasses} bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200`;
    }
    return `${baseClasses} bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 text-lg">
              Đang tải thông tin tài khoản...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-bg">
      <div className="account-container">
        {/* Header */}
        <div className="account-header">
          <h1 className="account-title">Thông tin tài khoản</h1>
          <p className="account-subtitle">Quản lý thông tin cá nhân của bạn</p>
        </div>

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 animate-bounce z-50">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              <span>Thông tin đã được cập nhật thành công!</span>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="account-card">
          <div className="account-card-header">
            <div className="account-avatar">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{userInfo.name}</h2>
              <p className="text-blue-100 text-lg">{userInfo.email}</p>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={handleStartEdit}
                className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="account-card-content">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="account-label">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="account-input"
                    />
                  ) : (
                    <div className="account-info">{userInfo.name}</div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="account-label">Địa chỉ email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="account-input"
                    />
                  ) : (
                    <div className="account-info">{userInfo.email}</div>
                  )}
                </div>
              </div>

              {/* Role Field */}
              <div className="group">
                <label className="account-label">Vai trò</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <div className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl flex items-center">
                    <span className="account-role-badge">
                      {getRoleIcon(userInfo.role)}
                      {userInfo.role === "admin"
                        ? "Quản trị viên"
                        : "Người dùng"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="account-btn account-btn-save"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang lưu...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        <span>Lưu thay đổi</span>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="account-btn account-btn-cancel"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-5 h-5" />
                      <span>Hủy</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
