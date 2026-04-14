import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { apiService } from './services/api';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ResourceListing from './pages/ResourceListing';
import ResourceDetail from './pages/ResourceDetail';
import BookingHistory from './pages/BookingHistory';

// Components
import Sidebar from './components/Sidebar';
import { LogOut, Bell, User as UserIcon, Menu } from 'lucide-react';

const ProtectedRoute = ({ children, role }: { children?: React.ReactNode, role?: UserRole }) => {
  const user = apiService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = apiService.getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/login');
  };

  if (!user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        user={user} 
        currentPath={location.pathname} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm md:text-lg font-semibold text-slate-800 truncate max-w-[150px] md:max-w-none">
              {location.pathname.includes('admin') ? 'Admin Center' : 'Resource Portal'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-3 sm:pl-4 sm:border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 leading-none">{user.name}</p>
                <p className="text-xs text-slate-500 mt-1">{user.role}</p>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                <UserIcon size={20} />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium">ITU Resource System is loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute role={UserRole.ADMIN}>
            <AuthLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="resources" element={<AdminDashboard />} />
                <Route path="bookings" element={<AdminDashboard />} />
              </Routes>
            </AuthLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/user/*" element={
          <ProtectedRoute role={UserRole.USER}>
            <AuthLayout>
              <Routes>
                <Route index element={<UserDashboard />} />
                <Route path="resources" element={<ResourceListing />} />
                <Route path="resources/:id" element={<ResourceDetail />} />
                <Route path="history" element={<BookingHistory />} />
              </Routes>
            </AuthLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}