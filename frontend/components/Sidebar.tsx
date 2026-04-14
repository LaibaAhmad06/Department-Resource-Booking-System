import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Settings, 
  Package, 
  Users as UsersIcon,
  CalendarCheck,
  Building2,
  X
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface SidebarProps {
  user: User;
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentPath, isOpen, onClose }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const userLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/user' },
    { name: 'Browse Resources', icon: Search, path: '/user/resources' },
    { name: 'My Bookings', icon: History, path: '/user/history' },
  ];

  const adminLinks = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manage Resources', icon: Package, path: '/admin/resources' },
    { name: 'Approval Queue', icon: CalendarCheck, path: '/admin/bookings' },
    { name: 'Manage Users', icon: UsersIcon, path: '/admin/users' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <button 
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="p-6 flex items-center space-x-3 mb-8">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Building2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ITU</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Resource Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => onClose()}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <link.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center">
          <p className="text-xs text-slate-500 mb-2">Need assistance?</p>
          <button className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">Contact IT Support</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;