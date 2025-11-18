"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const loginSuccess = login(email, password);

    if (loginSuccess) {
      router.push('/dashboard');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm w-full max-w-md mx-4 sm:mx-0">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">PT Kharisma Radja</h1>
          <p className="text-gray-600 text-sm sm:text-base">Management Stock LPG</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
