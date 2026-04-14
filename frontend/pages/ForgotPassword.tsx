import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.endsWith('@itu.edu.pk')) {
      setSent(true);
    } else {
      alert('Password recovery is only available for @itu.edu.pk email addresses.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="p-8 sm:p-12">
          {sent ? (
            <div className="text-center space-y-6 py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Email Sent!</h2>
              <p className="text-slate-500 leading-relaxed font-medium">
                We've sent a recovery link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                Back to Login
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <Link to="/login" className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors group">
                <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-900">Reset Password</h1>
                <p className="text-slate-500 mt-2 font-medium">Enter your ITU email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Institutional Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="name@itu.edu.pk"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-2 group"
                >
                  <span>Send Recovery Link</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;