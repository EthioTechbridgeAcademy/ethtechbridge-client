import { useState, useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import Alert from "../components/Alert.jsx";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    bio: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getStudentProfile();
        if (res.profile) {
          setProfileForm({
            fullName: res.profile.full_name || "",
            phone: res.profile.phone || "",
            bio: res.profile.bio || ""
          });
        }
      } catch (err) {
        console.error("Profile load error:", err.message);
      }
    }
    load();
  }, []);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setProfileLoading(true);

    try {
      const res = await api.updateStudentProfile(profileForm);
      setProfileMsg({ type: "success", text: res.message || "Profile updated." });
      updateUser({ name: profileForm.fullName, phone: profileForm.phone, bio: profileForm.bio });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.changePassword(passwordForm);
      setPasswordMsg({ type: "success", text: res.message || "Password updated successfully." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.profileHeading}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t.profileHeadingSub}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-blue-900 text-cyan-300 rounded-2xl flex items-center justify-center font-bold text-lg">
              {profileForm.fullName ? profileForm.fullName[0].toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">{profileForm.fullName || user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {profileMsg.text && <Alert type={profileMsg.type} message={profileMsg.text} />}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.fullNameLabel}
              </label>
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.phoneLabel}
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="0911223344"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.bioLabel}
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Share your goals and interests..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shadow disabled:opacity-50"
            >
              {profileLoading ? "Saving..." : t.saveChangesBtn}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" /> {t.changePasswordTitle}
            </h2>

            {passwordMsg.text && <Alert type={passwordMsg.type} message={passwordMsg.text} />}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.currentPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.newPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.confirmPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow disabled:opacity-50 mt-2"
              >
                {passwordLoading ? t.updatingPassword : t.updatePasswordBtn}
              </button>
            </form>
          </div>

          {/* Account Details Box */}
          <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t.securityStatusTitle}
            </div>
            <p>{t.roleLabel} <strong className="uppercase">{user?.role || "student"}</strong></p>
            <p>{t.emailAddressLabel}: <strong>{user?.email}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}