import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Info, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Unit {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'booked' | 'reserved';
  price?: string;
  area?: string;
}

const CompoundPlanMap = () => {
  const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null);

  // Mock units data
  const units: Unit[] = Array.from({ length: 48 }, (_, i) => ({
    id: `unit-${i + 1}`,
    number: `${Math.floor(i / 12) + 1}0${(i % 12) + 1}`,
    type: i % 5 === 0 ? 'Penthouse' : i % 3 === 0 ? 'Duplex' : 'Standard',
    status: i % 7 === 0 ? 'reserved' : i % 3 === 0 ? 'booked' : 'available',
    price: `${(Math.random() * 5 + 2).toFixed(1)}M SAR`,
    area: `${Math.floor(Math.random() * 100 + 150)} sqm`
  }));

  const stats = {
    total: units.length,
    available: units.filter(u => u.status === 'available').length,
    booked: units.filter(u => u.status === 'booked').length,
    reserved: units.filter(u => u.status === 'reserved').length
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/20 shadow-2xl overflow-hidden relative min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Compound Interactive Plan
          </h3>
          <p className="text-sm text-gray-400">Select a unit to view details and availability</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span className="text-xs font-medium text-emerald-400">{stats.available} Available</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <div className="w-2 h-2 bg-rose-400 rounded-full" />
            <span className="text-xs font-medium text-rose-400">{stats.booked} Booked</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            <span className="text-xs font-medium text-amber-400">{stats.reserved} Reserved</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-3">
        {units.map((unit) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: parseInt(unit.id.split('-')[1]) * 0.01 }}
            whileHover={{ scale: 1.1, zIndex: 20 }}
            className={`
              aspect-square rounded-lg flex items-center justify-center cursor-pointer relative group
              ${unit.status === 'available' ? 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/40' : 
                unit.status === 'booked' ? 'bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/40' : 
                'bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/40'}
            `}
            onMouseEnter={() => setHoveredUnit(unit)}
            onMouseLeave={() => setHoveredUnit(null)}
          >
            <span className="text-[10px] font-bold text-white/50 group-hover:text-white transition-colors">
              {unit.number}
            </span>
            
            {/* Status indicator mini-dot */}
            <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
              unit.status === 'available' ? 'bg-emerald-400' : 
              unit.status === 'booked' ? 'bg-rose-400' : 
              'bg-amber-400'
            }`} />
          </motion.div>
        ))}
      </div>

      {/* Tooltip detail overlay */}
      <AnimatePresence>
        {hoveredUnit && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-6 right-6 w-64 bg-gray-950/90 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold">Unit {hoveredUnit.number}</h4>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                hoveredUnit.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : 
                hoveredUnit.status === 'booked' ? 'bg-rose-500/20 text-rose-400' : 
                'bg-amber-500/20 text-amber-400'
              }`}>
                {hoveredUnit.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Type:</span>
                <span className="text-white font-medium">{hoveredUnit.type}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Area:</span>
                <span className="text-white font-medium">{hoveredUnit.area}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Price:</span>
                <span className="text-white font-bold text-emerald-400">{hoveredUnit.price}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-800">
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                {hoveredUnit.status === 'available' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Instant Booking Available</span>
                  </>
                ) : hoveredUnit.status === 'booked' ? (
                  <>
                    <XCircle className="w-3 h-3 text-rose-400" />
                    <span>Unit Sold</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Pending Transaction</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
      </div>
    </div>
  );
};

export default CompoundPlanMap;
