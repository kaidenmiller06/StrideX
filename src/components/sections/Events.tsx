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
    <div className='grid grid-cols-1 md:h-screen md:grid-cols-2 md:grid-rows-[minmax(0,1fr)]'>
      
      <div className='flex min-h-0 flex-col'>
        <div className='shrink-0 p-4'>
          <Calendar
            value={date}
            onChange={(d) => setDate(d as Date)}
            className='!w-full !max-w-full' 
          />
    </div>

    <div className="h-[50vh] md:h-auto md:min-h-0 md:flex-1"></div>
      <MapContainer center={[40.151042, -76.591637]} zoom={13} scrollWheelZoom className='h-full w-full'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[40.151042, -76.591637]}>
          <Popup>Race Location</Popup>
        </Marker>
      </MapContainer>
    </div>

  
    <aside className='p-4 md:overflow-y-auto'>
        <h2 className='mb-2 text-xl font-semibold'>
          Events on {date.toLocaleDateString()}
        </h2>
        {todaysEvents.length === 0 ? (
          <p className='text-black-500'>Conference 8k</p>
        ) : (
          <ul className='list-disc pl-5'>
            {todaysEvents.map((e) => (
              <li key={e.id}>{e.title}</li>
            ))}
          </ul>
        )}
      </aside>
    </div>
    )
}


export default Events;