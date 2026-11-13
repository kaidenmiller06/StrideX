export interface Coords {
  lat: number
  lng: number
  displayName: string
}


export default async function AddressToCoords(address: string): Promise<Coords | null> {
  const query = address.trim();
  if (!query) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {headers: {'Accept-Language': 'en'}});
  if (!response.ok) throw new Error(`Error (${response.status})`);

  const data = await response.json();
  console.log(data);
  if (data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
