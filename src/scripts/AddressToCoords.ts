import { useState } from 'react';

export interface Coords{
    lat: number;
    lng: number;
    displayName: String;
} 

interface Props{
  address: string;
  onResult?: (coords: Coords) => void;
}

export default function AddressToCoords({address, onResult} : Props){
  const [coordinates, setCoordinates] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const handleGeocode = async() => {
    if(!address.trim()) return;

    setLoading(true);
    setError(null);
    setCoordinates(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

      const response = await fetch(url, {
        headers: {'Accept-Language': 'en'}
      });
      if(!response.ok) throw new Error('Error');
      
      const data = await response.json();

      if (data.length > 0) {
        const result: Coords={
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name  
        };
        setCoordinates(result);
        onResult?.(result);
      } else {
        setError('No locations found for that address.');
      }
      } catch (err) {
        setError('Failed to fetch coordinates. Please try again.');
      } finally {
        setLoading(false);
      } 
    };
}