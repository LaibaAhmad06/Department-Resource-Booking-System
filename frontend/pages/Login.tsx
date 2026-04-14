import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Mail, Lock, ArrowRight, AlertCircle, Building2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await apiService.login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else navigate('/user');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Building2 size={600} className="text-white" />
        </div>
        <div className="relative z-10 text-white space-y-8 max-w-md">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight">ITU Resource Portal</h2>
          <p className="text-lg text-indigo-100 opacity-90 leading-relaxed font-light">
            Securely book labs and equipment for your academic sessions.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900">Sign In</h1>
            <p className="text-slate-500 mt-2 font-medium">Use your @itu.edu.pk credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Official Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;