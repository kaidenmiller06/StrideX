import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {useState} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
// import AddressToCoords from '../../scripts/AddressToCoords'
import Header from './Header'


type EventItem = {
  id: number
  title: string
  date: string // 'YYYY-MM-DD'
  lat: number
  lng: number
  desc: string
  tags: Array<string>
  creatorId: string
}

const events: EventItem[] = [
  {id: 1, title: 'Elizabethtown 5k', date: '2026-11-05', lat: 40.1510, lng: -76.5916, desc: 'Casual Race', tags: ['XC', 'Casual'], creatorId: 't'},
]


function Events(){
  const [date, setDate] = useState<Date>(new Date())
  const selected = date.toLocaleDateString('en-CA')
  const todaysEvents = events.filter((e) => e.date === selected)


  return(
    <>
      <div className="flex h-dvh flex-col">
        <Header />
        <main className="flex-1 bg-stridex-grey">
          <div className="mx-auto grid max-w-7xl grid-cols-1 p-4 gap-4 md:grid-cols-2">
            {/* Map and Calendar Section */}
            <section className='flex flex-col gap-4'>
              <div className='shrink-0'>
                <Calendar
                  value={date}
                  onChange={(d) => setDate(d as Date)}
                  className='!w-full !max-w-full'
                />
              </div>

              <div className='h-[50vh] md:h-[60vh]'>
                <MapContainer
                  center={[40.151042, -76.591637]}
                  zoom={13}
                  scrollWheelZoom
                  className='h-full w-full'
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {todaysEvents.map((event) => (
                    <Marker key={event.id} position={[event.lat, event.lng]}>
                      <Popup>
                        <strong>{event.title}</strong>
                        <br />
                        {event.desc}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </section>

  
            {/* Event's List */}
            <section className='p-4 md:overflow-y-auto'>
              <h2 className='mb-2 text-xl font-semibold'>
                Events on {date.toLocaleDateString()}
              </h2>
              {todaysEvents.length === 0 ? (
                <p className='text-black-500'>No Events</p>
              ) : (
                <ul className='list-disc pl-5'>
                  {todaysEvents.map((event) => (
                  <li key={event.id}>{event.title}</li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  ) 
}

export default Events;