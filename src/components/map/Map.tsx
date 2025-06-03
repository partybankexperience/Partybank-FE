import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import DefaultButton from "../buttons/DefaultButton";

interface Suggestion {
  name: string;
  lat: number;
  lon: number;
}

interface Props {
  defaultCenter?: LatLngExpression;
  onSelect?: (location: Suggestion) => void;
}

const MapUpdater = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

export const MapWithAutocomplete: React.FC<Props> = ({
  defaultCenter = [45.4215, -75.6995], // Ottawa
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedPos, setSelectedPos] = useState<LatLngExpression>(defaultCenter);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (q: string) => {
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();

      if (!data.features) return;

      const results: Suggestion[] = data.features.map((feat: any) => ({
        name:
          feat.properties.name +
          (feat.properties.city ? `, ${feat.properties.city}` : "") +
          (feat.properties.country ? `, ${feat.properties.country}` : ""),
        lat: feat.geometry.coordinates[1],
        lon: feat.geometry.coordinates[0],
      }));

      setSuggestions(results);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // debounce delay
  }, [query]);

  const handleSelect = (suggestion: Suggestion) => {
    const newPos: LatLngExpression = [suggestion.lat, suggestion.lon];
    setSelectedPos(newPos);
    setSuggestions([]);
    setQuery(suggestion.name);
    onSelect?.(suggestion);
  };

  return (
    <div className="relative mt-[-2rem]">
  {/* Input with Suggestions */}
  <div className="relative z-50 top-[4rem]">
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for a location..."
      className="w-[calc(100%-6rem)] mx-[3rem] p-2 border bg-white border-gray-300 rounded-md"
    />
    <DefaultButton className="!w-fit absolute right-[3.3rem] !py-[.4rem] top-1 " size="small" onClick={() => {
  const selected = suggestions.find(s => s.name === query);
  if (selected) {
    handleSelect(selected);
  } else {
    setSuggestions([]);
  }
}}>
        Confirm
    </DefaultButton>
    {suggestions.length > 0 && (
      <ul className="absolute w-full bg-white border border-gray-200 shadow-md rounded-md max-h-60 overflow-auto z-50">
        {suggestions.map((s, idx) => (
          <li
            key={idx}
            onClick={() => handleSelect(s)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {s.name}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* MapContainer must have lower z-index */}
  <div className="relative z-10 mt-2">
    <MapContainer
      center={selectedPos}
      zoom={13}
      scrollWheelZoom
      style={{ height: "300px", borderRadius: "8px" }}
      className="z-10"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapUpdater position={selectedPos} />
      <Marker
        position={selectedPos}
        icon={L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      />
    </MapContainer>
  </div>
</div>

  );
};
