import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { UserRole } from '../../types';
import { User, Mail, Shield, ArrowRight, AlertCircle, Building2, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.endsWith('@itu.edu.pk')) {
      setError('Registration is restricted to @itu.edu.pk email addresses.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await apiService.signup(name, email, role, password);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Building2 size={600} className="text-white" />
        </div>
        <div className="relative z-10 text-white space-y-8 max-w-md">
          <h2 className="text-5xl font-black leading-tight tracking-tight">Join the Academic Network</h2>
          <p className="text-lg text-slate-400 leading-relaxed font-light">
            Our specialized resource portal helps you collaborate and innovate by providing easy access to ITU's state-of-the-art facilities.
          </p>
          <div className="space-y-6 pt-10">
            <div className="flex items-start space-x-4">
               <div className="mt-1 p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Shield size={20} /></div>
               <div>
                  <h4 className="font-bold text-white">Identity Protection</h4>
                  <p className="text-sm text-slate-500">Secure SSO-style authentication for all members.</p>
               </div>
            </div>
            <div className="flex items-start space-x-4">
               <div className="mt-1 p-2 bg-green-500/20 text-green-400 rounded-lg"><ArrowRight size={20} /></div>
               <div>
                  <h4 className="font-bold text-white">Instant Access</h4>
                  <p className="text-sm text-slate-500">Automatic approval for standard lab equipment.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900">Create Account</h1>
            <p className="text-slate-500 mt-2 font-medium">Register for ITU Resource Access</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-3 bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-2xl animate-in fade-in zoom-in duration-300">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">ITU Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@itu.edu.pk"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Set Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Primary Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.USER)}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                    role === UserRole.USER 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.ADMIN)}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                    role === UserRole.ADMIN 
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  Admin
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 px-1">Note: Admin accounts require departmental verification after registration.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-6">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;