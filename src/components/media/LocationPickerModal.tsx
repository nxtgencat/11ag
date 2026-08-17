import React, { useState } from 'react';
import { LocationData } from '../../types';
import { MapPin, Navigation, Search, X } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendLocation: (location: LocationData) => void;
}

const NEARBY_PLACES: LocationData[] = [
  {
    name: 'Central Park Cafe & Bistro',
    address: '5th Ave & E 72nd St, New York, NY 10021',
    latitude: 40.7712,
    longitude: -73.9742,
  },
  {
    name: 'Metropolitan Tech Center',
    address: '100 Broadway, New York, NY 10005',
    latitude: 40.7075,
    longitude: -74.0113,
  },
  {
    name: 'Grand Central Terminal',
    address: '89 E 42nd St, New York, NY 10017',
    latitude: 40.7527,
    longitude: -73.9772,
  },
  {
    name: 'Hudson River Waterfront Park',
    address: 'Pier 45, Hudson River Greenway, NY 10014',
    latitude: 40.7335,
    longitude: -74.0119,
  },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSendLocation,
}) => {
  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<LocationData>(NEARBY_PLACES[0]);

  if (!isOpen) return null;

  const handleSendCurrent = () => {
    onSendLocation({
      name: 'Current Location',
      address: 'Accurate to 12 meters · 40.7128° N, 74.0060° W',
      latitude: 40.7128,
      longitude: -74.0060,
    });
    onClose();
  };

  const filteredPlaces = NEARBY_PLACES.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#111b21] rounded-2xl shadow-wa-modal border border-[#e9edef] dark:border-[#222d34] overflow-hidden flex flex-col max-h-[85vh] animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e9edef] dark:border-[#222d34] bg-[#f0f2f5] dark:bg-[#202c33]">
          <h3 className="font-semibold text-[#111b21] dark:text-[#e9edef] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-wa-green" />
            <span>Send Location</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#54656f] dark:text-[#aebac1] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Simulator Preview */}
        <div className="relative h-48 bg-[#e5e3df] dark:bg-[#1c272e] flex items-center justify-center overflow-hidden border-b border-[#e9edef] dark:border-[#222d34]">
          {/* Map Grid Graphic */}
          <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Road markings */}
          <div className="absolute w-full h-8 bg-white/70 dark:bg-[#2a3942]/60 rotate-[-12deg]" />
          <div className="absolute h-full w-8 bg-white/70 dark:bg-[#2a3942]/60 rotate-[25deg]" />

          {/* Pin Marker */}
          <div className="relative z-10 flex flex-col items-center animate-bounce">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <div className="w-3 h-1 bg-black/40 rounded-full mt-1 blur-xs" />
          </div>

          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md">
            {selectedPlace.name}
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#e9edef] dark:border-[#222d34]">
          <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#8696a0] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search for nearby places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] dark:text-[#e9edef] outline-none"
            />
          </div>
        </div>

        {/* Actions & Place List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f2f5] dark:divide-[#202c33]">
          {/* Send Current Location */}
          <button
            onClick={handleSendCurrent}
            className="w-full flex items-center gap-3.5 p-4 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-wa-green/15 text-wa-green flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-wa-green-deep dark:text-wa-green">
                Send your current location
              </div>
              <div className="text-xs text-[#8696a0]">
                Accurate to 12 meters
              </div>
            </div>
          </button>

          {/* Nearby places */}
          <div className="px-4 py-2 text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider bg-[#fafafa] dark:bg-[#182229]">
            Nearby Places
          </div>

          {filteredPlaces.map((place, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPlace(place);
                onSendLocation(place);
                onClose();
              }}
              className="w-full flex items-center gap-3.5 p-3.5 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#f0f2f5] dark:bg-[#2a3942] text-[#54656f] dark:text-[#aebac1] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate">
                  {place.name}
                </div>
                <div className="text-xs text-[#8696a0] truncate">
                  {place.address}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
