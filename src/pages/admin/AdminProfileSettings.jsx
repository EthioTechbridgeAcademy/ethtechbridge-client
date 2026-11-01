import { useState, useEffect } from "react";
import {
  User, ShieldCheck, Lock, Mail, Phone, Key,
  CheckCircle2, AlertCircle, Save, Eye, EyeOff,
  Sparkles, Award, FileText, Clock
} from "lucide-react";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import Alert from "../../components/Alert.jsx";

export default function AdminProfileSettings() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'security'
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    role: "admin",
    status: "active",
    createdAt: ""
  });

  const [stats, setStats] = useState({
    applicationsReviewed: 0,
    enrolledStudents: 0
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await api.getAdminProfile();
        if (res.admin) {
          setProfileData({
            fullName: res.admin.full_name || "",
            email: res.admin.email || "",
            phone: res.admin.phone || "",
            bio: res.admin.bio || "",
            role: res.admin.role || "admin",
            status: res.admin.status || "active",
            createdAt: res.admin.created_at || ""
          });
        }
        if (res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error("Failed to load admin profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);

    try {
      const res = await api.updateAdminProfile({
        fullName: profileData.fullName,
        phone: profileData.phone,
        bio: profileData.bio
      });
      if (res.success) {
        setProfileMsg({ type: "success", text: "Administrator profile updated successfully." });
        updateUser({ name: profileData.fullName, phone: profileData.phone });
      }
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordMsg({ type: "error", text: "Please enter both current and new passwords." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      if (res.success) {
        setPasswordMsg({ type: "success", text: "Administrator password changed successfully." });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-3xl border border-slate-200" />
        <div className="h-80 bg-white rounded-3xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1A30] text-amber-400 border border-slate-800 flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
            {profileData.fullName?.charAt(0) || "A"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-semibold text-slate-900 font-sans tracking-tight">
                {profileData.fullName || "Administrator"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                School Administrator
              </span>
            </div>
            <p className="text-xs text-slate-500">{profileData.email}</p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reviewed</span>
            <span className="font-extrabold text-slate-900 text-sm">{stats.applicationsReviewed}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled</span>
            <span className="font-extrabold text-emerald-600 text-sm">{stats.enrolledStudents}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
            activeTab === "general"
              ? "bg-[#1E3A8A] text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-[#1E3A8A] text-white"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* TAB 1: GENERAL PROFILE */}
      {activeTab === "general" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">Administrator Information</h2>
            <p className="text-xs text-slate-500">
              Manage your verified administrator details, institutional phone, and signature bio.
            </p>
          </div>

          {profileMsg.text && (
            <Alert
              type={profileMsg.type}
              message={profileMsg.text}
              onClose={() => setProfileMsg({ type: "", text: "" })}
            />
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Email modifications require system console authentication.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+251 911 234 567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  System Role & Authority
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Administrator (Full Academy Permissions)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Bio / Notes
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Institutional profile notes and administrative responsibilities..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-900"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? "Saving..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight">Password & Account Security</h2>
            <p className="text-xs text-slate-500">
              Ensure your administrator account is protected with a strong, distinct password.
            </p>
          </div>

          {passwordMsg.text && (
            <Alert
              type={passwordMsg.type}
              message={passwordMsg.text}
              onClose={() => setPasswordMsg({ type: "", text: "" })}
            />
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Minimum 8 characters.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showNewPass ? "text" : "password"}
                required
                minLength={8}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#1E3A8A] text-slate-900"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                <span>{savingPassword ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>

          {/* Session Security Overview */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Session & Access Safeguards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Session Expiry</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1E3A8A]" /> 8 Hours Active JWT
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">RBAC Enforcement</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Database-Authoritative
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Password Hashing</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" /> bcrypt (10 rounds)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

