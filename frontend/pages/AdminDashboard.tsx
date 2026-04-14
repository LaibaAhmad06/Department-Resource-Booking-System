import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Booking, Resource, BookingStatus, UserRole, ResourceType } from '../../types';
import { getIcon } from '../../constants';
import { 
  BarChart3, 
  Package, 
  CalendarCheck, 
  Users, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  Settings2,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'approvals'>('overview');
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState<Omit<Resource, 'id'>>({
    name: '',
    type: ResourceType.LAB,
    capacity: 0,
    location: '',
    description: '',
    availabilityHours: '09:00 - 18:00',
    iconName: 'Package'
  });

  const loadData = async () => {
    try {
      const [s, b, r] = await Promise.all([
        apiService.getStats(),
        apiService.getBookings(),
        apiService.getResources()
      ]);
      setStats(s);
      setBookings(b.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setResources(r);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await apiService.updateBookingStatus(id, status);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.addResource(newResource);
      setShowAddResource(false);
      await loadData();
      setNewResource({
        name: '',
        type: ResourceType.LAB,
        capacity: 0,
        location: '',
        description: '',
        availabilityHours: '09:00 - 18:00',
        iconName: 'Package'
      });
    } catch (err) {
      alert('Failed to add resource');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await apiService.deleteResource(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete resource');
      }
    }
  };

  if (!stats) return <div className="p-8 text-center text-slate-500 font-bold">Loading system statistics...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Institutional Oversight & Resource Orchestration</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {(['overview', 'resources', 'approvals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Resources', value: stats.totalResources, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Pending Requests', value: stats.pendingRequests, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Active Bookings', value: stats.activeBookings, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center space-x-6 shadow-sm hover:shadow-md transition-shadow">
                 <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon size={28} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                 </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900">Incoming Requests</h3>
                  <button onClick={() => setActiveTab('approvals')} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-4 text-xs font-black text-slate-400 uppercase tracking-widest px-4">User</th>
                        <th className="text-left py-4 text-xs font-black text-slate-400 uppercase tracking-widest px-4">Resource</th>
                        <th className="text-left py-4 text-xs font-black text-slate-400 uppercase tracking-widest px-4">Date/Slot</th>
                        <th className="text-right py-4 text-xs font-black text-slate-400 uppercase tracking-widest px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bookings.filter(b => b.status === BookingStatus.PENDING).slice(0, 5).map(book => (
                        <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-5 px-4">
                            <div className="font-bold text-slate-900 text-sm">{book.userName}</div>
                          </td>
                          <td className="py-5 px-4 font-medium text-slate-600 text-sm">{book.resourceName}</td>
                          <td className="py-5 px-4">
                            <div className="text-xs font-bold text-slate-900">{book.date}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{book.slot}</div>
                          </td>
                          <td className="py-5 px-4 text-right">
                             <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleStatusChange(book.id, BookingStatus.APPROVED)}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all" title="Approve">
                                   <Check size={16} />
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(book.id, BookingStatus.REJECTED)}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Reject">
                                   <X size={16} />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {bookings.filter(b => b.status === BookingStatus.PENDING).length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">Queue is empty. Everything processed!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <h3 className="text-xl font-black">Quick Actions</h3>
                  <div className="space-y-4">
                     <button 
                       onClick={() => {setActiveTab('resources'); setShowAddResource(true);}}
                       className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl flex items-center justify-center font-bold transition-all"
                     >
                       <Plus className="mr-2" size={20} /> Add New Resource
                     </button>
                     <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center font-bold transition-all">
                       <Settings2 className="mr-2" size={20} /> System Config
                     </button>
                     <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center font-bold transition-all">
                       <Users className="mr-2" size={20} /> Audit Logs
                     </button>
                  </div>
                  <div className="pt-10 border-t border-slate-800">
                     <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">System Health</p>
                     <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium">Backend Sync Online</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">Manage Infrastructure</h2>
            <button 
              onClick={() => setShowAddResource(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center shadow-lg hover:bg-slate-800 transition-all"
            >
              <Plus className="mr-2" size={20} /> Add Resource
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {resources.map(res => (
              <div key={res.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    {getIcon(res.iconName, 24)}
                  </div>
                  <button onClick={() => handleDeleteResource(res.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">{res.name}</h4>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{res.description}</p>
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">{res.type}</span>
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-full">Cap: {res.capacity}</span>
                </div>
              </div>
            ))}
          </div>

          {showAddResource && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
               <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                  <form onSubmit={handleAddResource}>
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                       <h3 className="text-2xl font-black text-slate-900">New Resource</h3>
                       <button type="button" onClick={() => setShowAddResource(false)}><X size={24} className="text-slate-400" /></button>
                    </div>
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                          <input 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            placeholder="e.g. Quantum Computing Lab"
                            value={newResource.name}
                            onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                          <select 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none font-medium"
                            value={newResource.type}
                            onChange={(e) => setNewResource({...newResource, type: e.target.value as ResourceType})}
                          >
                             {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
                          <input 
                            type="number"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            value={newResource.capacity}
                            onChange={(e) => setNewResource({...newResource, capacity: parseInt(e.target.value)})}
                          />
                       </div>
                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                          <input 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                            placeholder="e.g. Block C, Floor 2"
                            value={newResource.location}
                            onChange={(e) => setNewResource({...newResource, location: e.target.value})}
                          />
                       </div>
                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                          <textarea 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium h-24"
                            value={newResource.description}
                            onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="p-8 bg-slate-50 flex space-x-4">
                       <button 
                         type="button" 
                         onClick={() => setShowAddResource(false)}
                         className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                       >
                         Cancel
                       </button>
                       <button 
                         type="submit"
                         className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all"
                       >
                         Create Resource
                       </button>
                    </div>
                  </form>
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900">All Booking Requests</h2>
              <p className="text-sm text-slate-500 font-medium">Full history of department resource usage</p>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left py-4 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                    <th className="text-left py-4 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Resource</th>
                    <th className="text-left py-4 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                    <th className="text-left py-4 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="text-right py-4 px-8 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {bookings.map(book => (
                     <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-6 px-8">
                         <div className="font-bold text-slate-900">{book.userName}</div>
                         <div className="text-[10px] text-slate-400 font-medium">UID: {book.userId.split('-')[1]}</div>
                       </td>
                       <td className="py-6 px-8">
                         <div className="font-bold text-slate-700">{book.resourceName}</div>
                       </td>
                       <td className="py-6 px-8">
                         <div className="text-sm font-bold text-slate-900">{book.date}</div>
                         <div className="text-[10px] text-slate-500 font-medium">{book.slot}</div>
                       </td>
                       <td className="py-6 px-8">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                            book.status === BookingStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-100' :
                            book.status === BookingStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {book.status}
                          </span>
                       </td>
                       <td className="py-6 px-8 text-right">
                          {book.status === BookingStatus.PENDING && (
                            <div className="flex justify-end space-x-2">
                               <button 
                                 onClick={() => handleStatusChange(book.id, BookingStatus.APPROVED)}
                                 className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                               >
                                 Approve
                               </button>
                               <button 
                                 onClick={() => handleStatusChange(book.id, BookingStatus.REJECTED)}
                                 className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50"
                               >
                                 Reject
                               </button>
                            </div>
                          )}
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;