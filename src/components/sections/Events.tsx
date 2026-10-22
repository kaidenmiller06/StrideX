import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'




function Events(){
  const [date, setDate] = useState<Date>(new Date())


  return(
    <>
    <div style={{ position: 'fixed', top: 0, left: 115, padding: '1rem', zIndex: 1 }}>
      <Calendar value={date} onChange={(d) => setDate(d as Date)} />
    </div>


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
    </>
    )
}


export default Events;