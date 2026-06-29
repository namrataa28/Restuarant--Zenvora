import React, { useContext, useState } from "react";
import api from "../lib/api";
import { AppContext } from "../context/AppContext";
import { Mail, Lock, User } from "lucide-react";

const Signup = () => {
  const { navigate, setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const res = await api.post("/auth/register", formData);
      if (res.data?.success) {
        // Auto-login after signup
        const loginRes = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        if (loginRes.data?.success) {
          setUser(loginRes.data.user);
        }
        navigate("/menu");
      } else {
        setError(res.data?.message || "Signup failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] py-16 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center bg-[#0B0B0B]/90 border border-gold-900/20 rounded-3xl px-8 py-10 shadow-2xl space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-white text-3xl md:text-4xl font-bold font-serif">Create Account</h1>
          <p className="text-gray-500 text-sm">Sign up to enjoy custom table reservations & fast ordering.</p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center w-full bg-[#050505] border border-gold-900/20 h-13 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-gold-500 transition-colors">
            <User size={16} className="text-gold-500 shrink-0" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="w-full bg-transparent text-white placeholder-gray-600 border-none outline-none text-sm pr-6"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center w-full bg-[#050505] border border-gold-900/20 h-13 rounded-full overflow-hidden pl-6 gap-3 focus-within:border-gold-500 transition-colors">
            <Mail size={16} className="text-gold-500 shrink-0" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
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
              placeholder="Choose password"
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
          {loading ? "Registering..." : "Sign up"}
        </button>

        <p className="text-gray-500 text-xs mt-2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-gold-500 hover:underline cursor-pointer font-semibold ml-1"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
