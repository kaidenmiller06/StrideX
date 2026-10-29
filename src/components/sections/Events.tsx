import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'


type EventItem = {
  id: number
  title: string
  date: string // 'YYYY-MM-DD'
  lat: number
  lng: number
}

const events: EventItem[] = [
  { id: 1, title: 'Race', date: '2026-10-22', lat: 40.1510, lng: -76.5916 },
]

function Events(){
  const [date, setDate] = useState<Date>(new Date())
  const selected = date.toLocaleDateString('en-CA')
  const todaysEvents = events.filter((e) => e.date === selected)

  return(
    <>
    <div style={{ position: 'fixed', top: 30, left: 100, padding: '1rem', zIndex: 1 }}>
      <Calendar value={date} onChange={(d) => setDate(d as Date)} />
    </div>


    <MapContainer center={[40.151042, -76.591637]} zoom={13} scrollWheelZoom={true} style={{position: 'fixed', bottom: 0, left: 0, height: '50vh', width: '50vw', zIndex: 0}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[40.151042, -76.591637]}>
        <Popup>
          StrideX
        </Popup>
      </Marker>
    </MapContainer>
     <aside
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: '50vw',
          right: 0,
          padding: '1rem',
          overflowY: 'auto',
          zIndex: 1,
        }}
      >
        <h2>Events on {date.toLocaleDateString()}</h2>
        {todaysEvents.length === 0 ? (
          <p>No events on this day.</p>
        ) : (
          <ul>
            {todaysEvents.map((e) => (
              <li key={e.id}>{e.title}</li>
            ))}
          </ul>
        )}
      </aside>
    </>
    )
}


export default Events;