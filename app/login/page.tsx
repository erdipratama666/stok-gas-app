"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      if (!name || !email || !password || !confirmPassword) {
        setError('Semua field harus diisi');
        return;
      }

      if (password !== confirmPassword) {
        setError('Password dan konfirmasi password tidak sama');
        return;
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter');
        return;
      }

      const registerSuccess = register(name, email, password);
      
      if (registerSuccess) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setIsRegister(false);
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Email sudah terdaftar');
      }
    } else {
      if (!email || !password) {
        setError('Email dan password harus diisi');
        return;
      }

      const loginSuccess = login(email, password);
      
      if (loginSuccess) {
        router.push('/dashboard');
      } else {
        setError('Email atau password salah');
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm w-full max-w-md mx-4 sm:mx-0">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">PT Kharisma Radja</h1>
          <p className="text-gray-600 text-sm sm:text-base">Management Stock LPG</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => !isRegister || toggleMode()}
              className={`flex-1 py-2 text-center font-medium text-sm transition ${
                !isRegister
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => isRegister || toggleMode()}
              className={`flex-1 py-2 text-center font-medium text-sm transition ${
                isRegister
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Daftar
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="Masukkan nama lengkap"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="nama@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-gray-700 mb-2 font-medium text-sm">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 pr-10"
                  placeholder="••••••••"
                  required={isRegister}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold shadow-md"
          >
            {isRegister ? 'Daftar' : 'Login'}
          </button>
        </form>
        
        {!isRegister && (
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-green-600 hover:text-green-700"
              onClick={() => alert('Fitur lupa password belum tersedia')}
            >
              Lupa password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;