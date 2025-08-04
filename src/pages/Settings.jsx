import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, Lock, Key, Shield, ChevronRight, ArrowLeft, LogOut, Trash2, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Password Input ---
const PasswordInput = ({ value, onChange, placeholder, disabled }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative w-full">
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                disabled={disabled}
                className="w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
};


// --- Main Settings Component ---
const Settings = () => {
  const { user } = useAuth();
  const [view, setView] = useState("main");

  if (!user) {
    return <div className="text-center py-10 text-gray-600 dark:text-gray-300">Loading settings...</div>;
  }

  const renderView = () => {
    switch (view) {
      case "editProfile":
        return <EditProfileView user={user} goBack={() => setView("main")} />;
      case "changePassword":
        return <ChangePasswordView goBack={() => setView("main")} />;
      case "forgotPassword":
        return <ForgotPasswordView user={user} goBack={() => setView("main")} />;
      case "privacy":
        return <PrivacyView goBack={() => setView("main")} />;
      default:
        return <MainMenuView setView={setView} />;
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 md:p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: view === 'main' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: view === 'main' ? 50 : -50 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Main Menu View ---
const MainMenuView = ({ setView }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            await axios.delete("/users/delete-account");
            toast.success("Account deleted successfully.");
            logout();
            navigate("/signup");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account.");
        }
    };

    const menuItems = [
        { id: "editProfile", icon: <User />, label: "Edit Profile" },
        { id: "changePassword", icon: <Lock />, label: "Change Password" },
        { id: "forgotPassword", icon: <Key />, label: "Forgot Password" },
        { id: "privacy", icon: <Shield />, label: "Privacy & Security" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Settings</h1>
            <div className="space-y-3">
                {menuItems.map(item => (
                    <button key={item.id} onClick={() => setView(item.id)} className="w-full flex justify-between items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center gap-4 text-gray-800 dark:text-white">
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t dark:border-gray-700 flex justify-between items-center">
                <button onClick={logout} className="flex items-center gap-2 text-yellow-600 hover:underline"><LogOut size={18} /> Logout</button>
                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-red-600 hover:underline"><Trash2 size={18} /> Delete Account</button>
            </div>
            {showDeleteConfirm && <DeleteConfirmationModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteConfirm(false)} />}
        </div>
    );
};

// --- Edit Profile View ---
const EditProfileView = ({ user, goBack }) => {
    const { setUser } = useAuth();
    const [name, setName] = useState(user.name || "");
    const [username, setUsername] = useState(user.username || "");
    const [bio, setBio] = useState(user.bio || "");
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [preview, setPreview] = useState(user.profilePic || "/default-user.png");
    const [loading, setLoading] = useState(false);

    const [usernameStatus, setUsernameStatus] = useState({
        loading: false,
        available: true,
        message: "",
        suggestions: [],
    });

    // ✅ THE FIX: Create a handler that forces lowercase and valid characters
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        const sanitizedUsername = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
        setUsername(sanitizedUsername);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (username.trim() !== user.username && username.trim().length >= 3) {
                checkUsernameAvailability(username.trim());
            } else {
                setUsernameStatus({ loading: false, available: true, message: "", suggestions: [] });
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [username, user.username]);

    const checkUsernameAvailability = async (uname) => {
        setUsernameStatus({ loading: true, available: false, message: "", suggestions: [] });
        try {
            const res = await axios.post("/auth/check-username", { username: uname });
            setUsernameStatus({
                loading: false,
                available: res.data.available,
                message: res.data.message,
                suggestions: res.data.suggestions || [],
            });
        } catch (error) {
            setUsernameStatus({
                loading: false,
                available: false,
                message: error.response?.data?.message || "Error checking username.",
                suggestions: [],
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameStatus.available && username !== user.username) {
            return toast.error("Please choose an available username.");
        }
        setLoading(true);
        try {
            let profilePicUrl = user.profilePic;
            if (profilePicFile) {
                const formData = new FormData();
                formData.append("profilePic", profilePicFile);
                const res = await axios.post("/users/upload-profile-pic", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                profilePicUrl = res.data.profilePicUrl;
            }
            
            const resUpdate = await axios.put("/users/update", { name, username: username.trim(), bio, profilePic: profilePicUrl });
            
            setUser(resUpdate.data.user);
            toast.success("Profile updated successfully!");
            goBack();
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <button onClick={goBack} className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white"><ArrowLeft size={18} /> Back to Settings</button>
            <div className="flex flex-col items-center">
                <img src={preview} onError={(e) => { e.target.onerror = null; e.target.src='/default-user.png' }} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover mb-4 ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800" />
                <label htmlFor="profilePicInput" className="cursor-pointer text-blue-600 font-semibold text-sm hover:underline">Change Profile Photo</label>
                <input id="profilePicInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Username</label>
                    <div className="relative">
                        <input
                            type="text" 
                            value={username} 
                            onChange={handleUsernameChange} // Use the new handler here
                            required
                            className={`mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
                                username.length < 3 || username === user.username ? 'border-gray-300 dark:border-gray-600' : 
                                usernameStatus.available ? 'border-green-500' : 'border-red-500'
                            }`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {usernameStatus.loading && <Loader2 className="animate-spin text-gray-400"/>}
                            {!usernameStatus.loading && usernameStatus.available && username !== user.username && username.length >= 3 && <CheckCircle2 className="text-green-500"/>}
                            {!usernameStatus.loading && !usernameStatus.available && username.length >= 3 && <XCircle className="text-red-500"/>}
                        </div>
                    </div>
                    {!usernameStatus.loading && username !== user.username && username.length >= 3 && (
                        <div className="text-xs mt-1">
                            {!usernameStatus.available && (
                                <div>
                                    <p className="text-red-600">{usernameStatus.message}</p>
                                    {usernameStatus.suggestions.length > 0 && (
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-gray-500">Try:</span>
                                            {usernameStatus.suggestions.map(s => (
                                                <button key={s} type="button" onClick={() => setUsername(s)} className="text-blue-600 hover:underline">
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Bio</label>
                    <textarea
                        value={bio} onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell the world something about you..." maxLength="200"
                        className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 h-24 resize-none"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || (!usernameStatus.available && username !== user.username)} 
                    className="w-full mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Saving..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

// --- Change Password View ---
const ChangePasswordView = ({ goBack }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match.");
        }
        if (newPassword.length < 6) {
             return toast.error("Password must be at least 6 characters long.");
        }
        
        setLoading(true);
        try {
            const res = await axios.put("/users/change-password", { oldPassword, newPassword });
            toast.success(res.data.message);
            goBack();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <button onClick={goBack} className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white"><ArrowLeft size={18} /> Back to Settings</button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                <PasswordInput value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" />
                <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" />
                <button type="submit" disabled={loading} className="w-full px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
};

// --- Forgot Password View ---
const ForgotPasswordView = ({ user, goBack }) => {
    const [otpStep, setOtpStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await axios.post("/auth/send-otp", { mobile: user.mobile, purpose: 'forgot_password' });
            toast.success("OTP sent to your mobile number.");
            setOtpStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
             return toast.error("Password must be at least 6 characters long.");
        }
        setLoading(true);
        try {
            await axios.post("/auth/forgot-password", { mobile: user.mobile, otp, newPassword });
            toast.success("Password has been reset successfully!");
            goBack();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <button onClick={goBack} className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white"><ArrowLeft size={18} /> Back to Settings</button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Forgot Password</h2>
            {otpStep === 1 ? (
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">We'll send a verification code to your registered mobile: <strong>{user?.mobile}</strong></p>
                    <button onClick={handleSendOtp} disabled={loading} className="w-full px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                        {loading ? "Sending..." : "Send Verification Code"}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" />
                    <button type="submit" disabled={loading} className="w-full px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
};


// --- Privacy View (Blocked Users) ---
const PrivacyView = ({ goBack }) => {
    const { setUser } = useAuth();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlockedUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get("/users/blocked");
            setBlockedUsers(res.data.blocked || []);
        } catch (error) {
            toast.error("Failed to fetch blocked users.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);

    const handleUnblock = async (userId) => {
        try {
            await axios.post(`/users/block/${userId}`);
            
            setBlockedUsers(prev => prev.filter(user => user._id !== userId));

            setUser(prevUser => {
                const updatedBlockedUsers = prevUser.blockedUsers.filter(blockedId => blockedId !== userId);
                return { ...prevUser, blockedUsers: updatedBlockedUsers };
            });

            toast.success("User unblocked.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unblock user.");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <button onClick={goBack} className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white"><ArrowLeft size={18} /> Back to Settings</button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Blocked Users</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">They won't be able to find your profile, posts or story. BlinkVault won't let them know you've blocked them.</p>
            <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">
                {loading ? <p className="text-center text-gray-500">Loading...</p> : blockedUsers.length > 0 ? blockedUsers.map(user => (
                    <div key={user._id} className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                        <div className="flex items-center gap-3">
                            <img src={user.profilePic || '/default-user.png'} onError={(e) => { e.target.onerror = null; e.target.src='/default-user.png' }} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-medium">@{user.username}</span>
                        </div>
                        <button onClick={() => handleUnblock(user._id)} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Unblock</button>
                    </div>
                )) : <p className="text-sm text-center text-gray-500 py-4">You haven't blocked any users.</p>}
            </div>
        </div>
    );
};


// --- Delete Confirmation Modal ---
const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{scale: 0.7, opacity: 0}} animate={{scale: 1, opacity: 1}} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
                <h3 className="text-lg font-bold text-red-600">Are you absolutely sure?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">This action cannot be undone. All your data will be permanently deleted.</p>
                <div className="flex gap-4 mt-6">
                    <button onClick={onCancel} className="w-full py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={onConfirm} className="w-full py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Yes, delete it</button>
                </div>
            </motion.div>
        </div>
    );
};

export default Settings;
