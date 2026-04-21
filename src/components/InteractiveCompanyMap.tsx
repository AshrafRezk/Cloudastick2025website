import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Globe, Phone } from 'lucide-react';

interface InteractiveCompanyMapProps {
  companyName?: string;
  location?: string;
}

const InteractiveCompanyMap = ({ companyName = 'Real Estate Project', location = 'Riyadh, Saudi Arabia' }: InteractiveCompanyMapProps) => {
  // Generate a Google Maps embed URL based on the location
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSy...&q=${encodeURIComponent(location + ' ' + companyName)}`;
  
  // Since I don't have a real API key, I'll use a standard search embed which is free
  const searchEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(location + ' ' + companyName)}&output=embed`;

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20 shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Project Location
          </h3>
          <p className="text-sm text-gray-400">{companyName} Headquarters & Site</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Get Directions
          </button>
        </div>
      </div>

      <div className="flex-grow rounded-2xl overflow-hidden border border-gray-700/50 relative group bg-black/40">
        <iframe
          title="Company Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, minHeight: '350px' }}
          src={searchEmbedUrl}
          allowFullScreen
          className="grayscale invert brightness-90 contrast-125 opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert-0 transition-all duration-700"
        />
        
        {/* Overlay Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between pointer-events-none sm:pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{companyName}</div>
              <div className="text-gray-400 text-xs">{location}</div>
            </div>
          </div>
          
          <div className="hidden sm:flex gap-4">
            <div className="flex flex-col items-center">
              <Globe className="w-4 h-4 text-gray-500 mb-1" />
              <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Visit Site</span>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-4 h-4 text-gray-500 mb-1" />
              <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Call Agent</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Proximity', value: 'Prime District' },
          { label: 'Access', value: 'Main Highway' },
          { label: 'Amenities', value: '5 Star Hub' },
          { label: 'Security', value: 'Gated Entry' }
        ].map((item, i) => (
          <div key={i} className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">{item.label}</div>
            <div className="text-sm text-white font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveCompanyMap;
