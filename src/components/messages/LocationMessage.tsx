import React from 'react';
import { LocationData } from '../../types';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationMessageProps {
  location: LocationData;
}

export const LocationMessage: React.FC<LocationMessageProps> = ({ location }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

  return (
    <div className="rounded-xl overflow-hidden max-w-sm border border-[#e9edef] dark:border-[#2a3942] bg-white dark:bg-[#182229]">
      {/* Map Thumbnail Graphic */}
      <div className="relative h-36 bg-[#e5e3df] dark:bg-[#202c33] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Animated Map Pin */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-white">
            <MapPin className="w-4 h-4 fill-current" />
          </div>
          <div className="w-2.5 h-1 bg-black/40 rounded-full mt-0.5 blur-2xs" />
        </div>

        <span className="absolute bottom-1 right-2 text-[9px] text-[#8696a0] font-mono">
          Google Maps
        </span>
      </div>

      {/* Address Details */}
      <div className="p-3">
        <h4 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] truncate">
          {location.name}
        </h4>
        <p className="text-xs text-[#667781] dark:text-[#8696a0] mt-0.5 line-clamp-2">
          {location.address}
        </p>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-wa-green hover:underline"
        >
          <span>View in Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
