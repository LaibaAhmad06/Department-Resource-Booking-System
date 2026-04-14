import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Shield, Clock, Search, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Building2 size={24} />
          </div>
          <span className="text-2xl font-bold text-slate-900">ITU Portal</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2 text-slate-600 font-medium hover:text-indigo-600 transition-colors">Login</Link>
          <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-semibold">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Now Live for Academic Session 2024
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            Seamless Resource <br />
            <span className="text-indigo-600">Booking Solution</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            Reserve labs, equipment, and meeting rooms across the department with real-time availability and smart conflict prevention.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/signup" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center group shadow-xl">
              Start Booking Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">AI Robotics Lab</p>
                        <p className="text-xs text-slate-500">Floor 3, Block A</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Available</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-400 rounded-xl"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">GPU Workstation 04</p>
                        <p className="text-xs text-slate-500">Cloud Center</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">Booked</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for Efficiency</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Manage your departmental resources with precision using our advanced platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Search, title: 'Smart Search', desc: 'Find labs, rooms, or specific hardware by type and availability instantly.' },
              { icon: Shield, title: 'Conflict Prevention', desc: 'No more double bookings. Our system handles time-slot validation automatically.' },
              { icon: CheckCircle, title: 'Admin Approval', desc: 'Secure workflow ensures high-value resources are used appropriately.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">ITU RESOURCE PORTAL</span>
          </div>
          <div className="flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact IT</a>
          </div>
          <p className="text-sm">© 2024 Information Technology University. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;