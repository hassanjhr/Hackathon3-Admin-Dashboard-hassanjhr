
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "hassanjhr09@gmail.com" && password === "hassanjhr09") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
       
        <h2 className="text-2xl font-bold text-[#151875] text-center">Hekto - Admin Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7E33E0] focus:border-[#7E33E0] outline-none transition duration-200"
              value={email}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#7E33E0] focus:border-[#7E33E0] outline-none transition duration-200"
              value={password}
            />
          </div>
        
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7E33E0] to-[#FB2E86] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center">
          Forgot password? <a href="#" className="text-[#FB2E86] hover:underline">Reset here</a>
        </p>
      </div>
    </div>
  );
}
