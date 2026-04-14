import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Booking, Resource, BookingStatus } from '../../types';
import { getIcon } from '../../constants';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, Zap } from 'lucide-react';

const UserDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const user = apiService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.getResources();
        const allBooks = await apiService.getBookings();
        setResources(res.slice(0, 4));
        setMyBookings(allBooks.filter(b => b.userId === user?.id).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, [user]);

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED: return 'bg-green-100 text-green-700 border-green-200';
      case BookingStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case BookingStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="relative overflow-hidden bg-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
         <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-indigo-100 text-lg opacity-90 max-w-xl">
               Manage your resource requests and discover available labs for your research projects.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link to="/user/resources" className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                Book a New Resource
              </Link>
              <Link to="/user/history" className="px-6 py-3 bg-indigo-600 border border-indigo-400 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors">
                View My History
              </Link>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Popular Labs</h2>
              <p className="text-slate-500 text-sm">Recommended for your department</p>
            </div>
            <Link to="/user/resources" className="text-indigo-600 font-bold text-sm flex items-center hover:translate-x-1 transition-transform">
              Explore All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <Link 
                key={res.id} 
                to={`/user/resources/${res.id}`}
                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {getIcon(res.iconName, 24)}
                  </div>
                  <div className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full tracking-wider">
                    {res.type}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{res.name}</h3>
                <div className="flex items-center text-slate-400 text-xs mb-4">
                  <MapPin size={12} className="mr-1" /> {res.location}
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center">
                     <Zap size={12} className="mr-1" /> Instant Book
                   </span>
                   <span className="text-xs font-medium text-slate-400">Cap: {res.capacity}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h2>
                <p className="text-slate-500 text-sm">Your booking updates</p>
              </div>
           </div>

           <div className="space-y-4">
              {myBookings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                  <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} />
                  </div>
                  <p className="text-slate-400 font-medium">No recent bookings</p>
                </div>
              ) : (
                myBookings.map((book) => (
                  <div key={book.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${getStatusStyle(book.status)}`}>
                        {book.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(book.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{book.resourceName}</h4>
                    <div className="mt-3 flex flex-col space-y-1">
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar size={12} className="mr-2 text-indigo-500" /> {book.date}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Clock size={12} className="mr-2 text-indigo-500" /> {book.slot}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {myBookings.length > 0 && (
                <Link to="/user/history" className="block w-full text-center py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-600 font-bold text-sm transition-colors border border-slate-100">
                  Manage All Bookings
                </Link>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;