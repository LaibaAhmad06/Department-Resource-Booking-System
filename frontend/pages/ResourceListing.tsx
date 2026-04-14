import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Resource, ResourceType } from '../../types';
import { getIcon } from '../../constants';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Info, Filter } from 'lucide-react';

const ResourceListing = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getResources();
        setResources(data);
        setFiltered(data);
      } catch (err) {
        console.error('Failed to load resources', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = resources;
    if (searchTerm) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter !== 'ALL') {
      result = result.filter(r => r.type === typeFilter);
    }
    setFiltered(result);
  }, [searchTerm, typeFilter, resources]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Resource Explorer</h1>
          <p className="text-slate-500 mt-1">Discover and book equipment for your academic needs</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-bold text-slate-700 appearance-none shadow-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value={ResourceType.LAB}>Labs</option>
              <option value={ResourceType.CLASSROOM}>Classrooms</option>
              <option value={ResourceType.MEETING_ROOM}>Meeting Rooms</option>
              <option value={ResourceType.EQUIPMENT}>Equipment</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((res) => (
            <div key={res.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col h-full shadow-sm">
              <div className="p-8 pb-4">
                 <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {getIcon(res.iconName, 28)}
                    </div>
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-full border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {res.type}
                    </span>
                 </div>
                 <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">{res.name}</h3>
                 <div className="mt-2 space-y-2">
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin size={14} className="mr-2 text-slate-400" /> {res.location}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Users size={14} className="mr-2 text-slate-400" /> Capacity: {res.capacity}
                    </div>
                 </div>
                 <p className="mt-4 text-slate-500 text-sm leading-relaxed line-clamp-3">
                   {res.description}
                 </p>
              </div>
              <div className="mt-auto p-6 pt-0 flex gap-3">
                 <Link 
                   to={`/user/resources/${res.id}`}
                   className="flex-1 py-3 bg-indigo-600 text-white text-center rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-500/20"
                 >
                   Book Now
                 </Link>
                 <Link 
                   to={`/user/resources/${res.id}`}
                   className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors border border-slate-100"
                   title="View Details"
                 >
                   <Info size={18} />
                 </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search size={32} className="text-slate-300" />
             </div>
             <p className="text-slate-900 font-black text-xl">No resources found</p>
             <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
             <button 
               onClick={() => {setSearchTerm(''); setTypeFilter('ALL');}}
               className="mt-6 text-indigo-600 font-bold hover:underline"
             >
               Clear all filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceListing;