import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationTracker = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routingControl = useRef(null);
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationStr, setDestinationStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Default to India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(L.latLng(latitude, longitude));
          setLoading(false);
          
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 13);
            
            // Add a marker for current location if routing is not active
            if (!routingControl.current) {
              L.marker([latitude, longitude], { icon: DefaultIcon })
                .addTo(mapInstance.current)
                .bindPopup('Your Current Location')
                .openPopup();
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Please ensure location services are enabled.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!currentLocation) {
      setError("Please get your current location first.");
      return;
    }
    if (!destinationStr.trim()) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setError(null);

    const destLatLng = await geocodeAddress(destinationStr);

    if (!destLatLng) {
      setError("Could not find the destination address. Please try a different one.");
      setLoading(false);
      return;
    }

    if (routingControl.current) {
      mapInstance.current.removeControl(routingControl.current);
    }

    routingControl.current = L.Routing.control({
      waypoints: [
        currentLocation,
        destLatLng
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#f97316', weight: 4 }] // Orange color
      },
      show: true,
      createMarker: function(i, wp, nWps) {
        return L.marker(wp.latLng, {
          draggable: true,
          icon: DefaultIcon
        });
      }
    }).addTo(mapInstance.current);

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-2">
        <Navigation className="text-primary" />
        Track Location
      </h1>

      <div className="bg-dark-lighter rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[700px] border border-gray-800">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 p-6 bg-dark border-r border-gray-800 flex flex-col">
          <h2 className="text-xl font-bold text-gray-200 mb-6">Find Your Route</h2>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-dark-lighter border border-gray-700 hover:border-primary text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              {loading && !currentLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
              {currentLocation ? "Location Acquired" : "Get Current Location"}
            </button>
            {currentLocation && (
              <p className="text-xs text-green-400 font-medium text-center">
                Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
              </p>
            )}
          </div>

          <form onSubmit={handleTrack} className="flex flex-col flex-1">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Destination Address
              </label>
              <input
                type="text"
                value={destinationStr}
                onChange={(e) => setDestinationStr(e.target.value)}
                placeholder="e.g. 123 Main St, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-dark-lighter text-light focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-400 text-sm rounded-lg border border-red-900">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !currentLocation || !destinationStr}
              className="mt-auto w-full bg-primary hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading && currentLocation && destinationStr ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
              Track Route
            </button>
          </form>
        </div>

        {/* Map Container */}
        <div className="w-full md:w-2/3 h-[400px] md:h-full relative">
          <div ref={mapRef} className="absolute inset-0 z-0 bg-gray-900" />
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;
