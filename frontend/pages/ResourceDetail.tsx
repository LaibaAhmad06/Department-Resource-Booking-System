import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Resource, TimeSlot } from '../../types';
import { getIcon, TIME_SLOTS } from '../../constants';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (id) {
        try {
          const data = await apiService.getResourceById(id);
          if (data) setResource(data);
        } catch (err) {
          console.error('Failed to load resource details', err);
        }
      }
    };
    load();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiService.createBooking(resource!.id, resource!.name, selectedDate, selectedSlot);
      setSuccess(true);
      setTimeout(() => navigate('/user/history'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!resource) return <div className="p-8 text-center text-slate-500 font-bold">Resource not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-500 pb-20">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold group">
        <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Listing
      </button>

      {success ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-6 shadow-2xl animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
             <CheckCircle2 size={48} />
           </div>
           <h2 className="text-3xl font-black text-slate-900">Request Submitted!</h2>
           <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
             Your booking request for <strong>{resource.name}</strong> has been sent to the department admin for approval.
           </p>
           <p className="text-indigo-600 font-bold text-sm">Redirecting to your booking history...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
               <div className="flex items-start justify-between mb-10">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    {getIcon(resource.iconName, 40)}
                  </div>
                  <span className="px-5 py-2 bg-indigo-600 text-white text-xs font-black uppercase rounded-full shadow-lg shadow-indigo-500/30">
                    {resource.type}
                  </span>
               </div>
               
               <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">{resource.name}</h1>
               <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl text-slate-600 text-sm font-bold border border-slate-100">
                     <MapPin size={16} className="mr-2 text-indigo-500" /> {resource.location}
                  </div>
                  <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl text-slate-600 text-sm font-bold border border-slate-100">
                     <Users size={16} className="mr-2 text-indigo-500" /> Max Cap: {resource.capacity}
                  </div>
                  <div className="flex items-center px-4 py-2 bg-slate-50 rounded-xl text-slate-600 text-sm font-bold border border-slate-100">
                     <Clock size={16} className="mr-2 text-indigo-500" /> {resource.availabilityHours}
                  </div>
               </div>

               <div className="prose prose-slate">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About this Resource</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {resource.description}
                  </p>
               </div>

               <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <h4 className="flex items-center font-bold text-slate-900">
                    <ShieldAlert size={18} className="mr-2 text-amber-500" /> Resource Usage Rules
                  </h4>
                  <ul className="space-y-3 text-sm text-slate-500 font-medium">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      Prioritized for final year project research and faculty-led initiatives.
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      Maximum booking duration is one time-slot per day for students.
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      Unauthorized removal of equipment will result in account suspension.
                    </li>
                  </ul>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 md:p-10 sticky top-24">
              <h2 className="text-2xl font-black text-slate-900 mb-8">Schedule Booking</h2>
              
              <div className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center space-x-2">
                    <ShieldAlert size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">1. Select Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">2. Select Time Slot</label>
                  <div className="grid grid-cols-1 gap-3">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.label)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all group ${
                          selectedSlot === slot.label 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-bold">{slot.label}</span>
                        <Clock size={16} className={selectedSlot === slot.label ? 'text-indigo-200' : 'text-slate-300 group-hover:text-slate-400'} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-3 disabled:opacity-50 group"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-center text-slate-400 text-xs font-medium">
                  Requests are subject to faculty approval within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetail;