// import { useState } from 'react';

// export default function AddressToCoords({address} : {address: String}){

//   interface coords{
//     lat: number;
//     lng: number;
//     displayName: String;
//   } 

//   const [coordinates, setCoordinates] = useState<coords | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<String | null>(null);

//   const handleGeocode = async(e: { preventDefault: () => void; }) => {
//     e.preventDefault()
//     if(!address) return;

//     setLoading(true);
//     setError(null);
//     setCoordinates(null);

//     try {
//       const url = `https://openstreetmap.org{encodeURIComponent(address)}&limit=1`;

//       const response = await fetch(url, {
//         headers: {
//           'Accept-Language': 'en'
//         }
//       });
      
//       const data = await response.json();
      
//         if (data && data.length > 0) {
//         setCoordinates({
//           lat: data[0].lat,
//           lng: data[0].lon,
//           displayName: data[0].display_name
          
//         });
//         } else {
//           setError('No locations found for that address.');
//         }
//         } catch (err) {
//           setError('Failed to fetch coordinates. Please try again.');
//         } finally {
//           setLoading(false);
//           return coordinates;
//         }
//       };

  
//   }