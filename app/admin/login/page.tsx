"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Static credentials
    if (email === "admin@gmail.com" && password === "admin@2026") {
      setError("");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
      <form
        onSubmit={handleLogin}
        className="glass-card p-10 rounded-2xl w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center">
          Trade Circle
        </h1>
        <h2 className="text-xl font-semibold text-center">
          Admin Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border border-white/20 bg-transparent p-3 rounded-lg focus:outline-none focus:border-white/40 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password with Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-white/20 bg-transparent p-3 pr-12 rounded-lg focus:outline-none focus:border-white/40 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full gold-gradient py-3 cursor-pointer rounded-lg text-black font-semibold hover:opacity-90 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}