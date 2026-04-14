import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Booking, BookingStatus } from '../../types';
import { Calendar, Clock, ArrowRight, ShieldCheck, Timer, XCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const user = apiService.getCurrentUser();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getBookings();
        setBookings(data.filter(b => b.userId === user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error('Failed to load history', err);
      }
    };
    load();
  }, [user]);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED: return <ShieldCheck className="text-green-500" size={24} />;
      case BookingStatus.PENDING: return <Timer className="text-amber-500" size={24} />;
      case BookingStatus.REJECTED: return <XCircle className="text-red-500" size={24} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Bookings</h1>
          <p className="text-slate-500 mt-1">Track your resource reservation status</p>
        </div>
        <Link to="/user/resources" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center shadow-lg hover:bg-indigo-700 transition-all">
          New Booking <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>

      <div className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((book) => (
            <div key={book.id} className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all shadow-sm">
               <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    book.status === BookingStatus.APPROVED ? 'bg-green-50' : 
                    book.status === BookingStatus.PENDING ? 'bg-amber-50' : 
                    'bg-red-50'
                  }`}>
                    {getStatusIcon(book.status)}
                  </div>
                  <div>
                     <h3 className="text-xl font-extrabold text-slate-900">{book.resourceName}</h3>
                     <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm font-medium text-slate-500">
                          <Calendar size={14} className="mr-1.5 text-indigo-500" /> {book.date}
                        </div>
                        <div className="flex items-center text-sm font-medium text-slate-500">
                          <Clock size={14} className="mr-1.5 text-indigo-500" /> {book.slot}
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center justify-between md:justify-end md:space-x-12 px-2 md:px-0">
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                     <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${
                       book.status === BookingStatus.APPROVED ? 'bg-green-100 text-green-700 border-green-200' :
                       book.status === BookingStatus.PENDING ? 'bg-amber-100 text-amber-700 border-amber-200' :
                       'bg-red-100 text-red-700 border-red-200'
                     }`}>
                        {book.status}
                     </span>
                  </div>
                  <div className="hidden lg:block text-right">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Applied On</p>
                     <p className="text-sm font-bold text-slate-600">{new Date(book.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/user/resources/${book.resourceId}`} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors border border-slate-100">
                    <ArrowRight size={20} />
                  </Link>
               </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Calendar size={32} className="text-slate-300" />
             </div>
             <p className="text-slate-900 font-black text-xl">No bookings yet</p>
             <p className="text-slate-500 mt-2">Your history will appear here once you request a resource.</p>
             <Link 
               to="/user/resources"
               className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20"
             >
               Browse Available Resources
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;