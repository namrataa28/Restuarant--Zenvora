import React, { useContext, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { Lock, Mail, ShieldAlert } from "lucide-react";

const AdminLogin = () => {
  const { navigate, setAdmin } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/admin/login", formData);
      if (res.data?.success) {
        const adminEmail = res.data.admin?.admin || formData.email;
        setAdmin(adminEmail);
        localStorage.setItem("adminEmail", adminEmail);
        navigate("/admin/dashboard");
      } else {
        setError(res.data?.message || "Admin login failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#0B0B0B] border border-gold-900/30 rounded-3xl p-8 shadow-2xl space-y-6 text-center"
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
            <ShieldAlert size={28} className="text-gold-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-white text-3xl font-bold font-serif">Staff Portal</h1>
          <p className="text-gray-500 text-sm">Enter administrative credentials to log in.</p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center w-full bg-[#050505] border border-gold-900/20 h-13 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-gold-500 transition-colors">
            <Mail size={16} className="text-gold-500 shrink-0" />
            <input
              type="email"
              name="email"
              placeholder="Admin email"
              className="w-full bg-transparent text-white placeholder-gray-600 border-none outline-none text-sm pr-6"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center w-full bg-[#050505] border border-gold-900/20 h-13 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-gold-500 transition-colors">
            <Lock size={16} className="text-gold-500 shrink-0" />
            <input
              type="password"
              name="password"
              placeholder="Admin password"
              className="w-full bg-transparent text-white placeholder-gray-600 border-none outline-none text-sm pr-6"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <div className="text-red-400 text-sm font-medium">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-13 rounded-full text-black bg-gold-500 hover:bg-gold-600 font-bold transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login to Control Center"}
        </button>

        <p
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gold-500 text-xs font-semibold cursor-pointer transition-colors block pt-2"
        >
          Back to Restaurant Homepage
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
