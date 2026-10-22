import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


function Events(){
  return(
    <MapContainer center={[40.151042, -76.591637]} zoom={13} scrollWheelZoom={false} style={{position: 'fixed', bottom: 0, left: 0, height: '50vh', width: '50vw', zIndex: 0}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[40.151042, -76.591637]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
    )
}


export default Events;