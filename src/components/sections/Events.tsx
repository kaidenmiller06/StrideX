import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {useEffect, useRef, useState} from 'react'
import type {FormEvent} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import AddressToCoords from '../../scripts/AddressToCoords'
import Header from './Header'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import {authClient} from '../../lib/authClient'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

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

type EventFormData = {
  title: string
  address: string
  date: string // 'YYYY-MM-DD'
  description: string
  tags: string[]
}

const events: EventItem[] = [
  {id: 1, title: 'Elizabethtown 5k', date: '2026-11-12', lat: 40.1510, lng: -76.5916, desc: 'Casual Race', tags: ['XC', 'Casual'], creatorId: 't'},
]

const CENTERED_MAP: [number, number] = [40.1510, -76.5916]

function Recenter({position}: {position: [number, number]}) {
  const map = useMap()
  useEffect(() => {
    map.setView(position)
  }, [map, position])
  return null
}

/**
 * Pop-up form for creating events
 */
type EventFormProps = {
  defaultDate: string // 'YYYY-MM-DD'
  onSave: (values: EventFormData) => void | Promise<void>
  onCancel: () => void
  error?: string | null
  saving?: boolean
}

function EventForm({defaultDate, onSave, onCancel, error, saving}: EventFormProps) {

  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')

  const [date, setDate] = useState(defaultDate)
  const [desc, setDesc] = useState('')
  const [tags, setTags] = useState('') 

  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      title: title.trim(),
      address: address.trim(),
      date,
      description: desc.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    })
  }

  const inputClass =
    'w-full rounded border border-stridex-lightgrey bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-stridex-green'

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="m-auto w-full max-w-md rounded-2xl border border-stridex-lightgrey bg-stridex-black p-6 text-white backdrop:bg-black/60"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Create Event</h2>

        <label className="flex flex-col gap-1 text-sm">
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Address
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Elizabethtown, PA"
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Description
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className={inputClass} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tags (comma separated)
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="XC, Casual" className={inputClass} />
        </label>

        {error && <p className="text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-full px-4 py-2 hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !title.trim() || !address.trim()}
            className="rounded-full border border-white px-4 py-2 hover:bg-stridex-lightgrey disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

function Events() {
  const {data: session} = authClient.useSession()
  const [hasProfile, setHasProfile] = useState(false)

  const [eventList, setEventList] = useState<EventItem[]>(events)

  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [date, setDate] = useState<Date>(new Date())
  const [activeStart, setActiveStart] = useState<Date>(new Date())

  const selected = date.toLocaleDateString('en-CA')
  const todaysEvents = eventList.filter((e) => e.date === selected)
  const monthLabel = activeStart.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})

  const mapCenter: [number, number] =
    todaysEvents.length > 0 ? [todaysEvents[0].lat, todaysEvents[0].lng] : CENTERED_MAP

  const shiftMonth = (n: number) =>
    setActiveStart((prev) => new Date(prev.getFullYear(), prev.getMonth() + n, 1))

  useEffect(() => {
    if (!session) {
      setHasProfile(false)
      return
    }

    let cancelled = false
    fetch('/api/profile/me')
      .then((r) => (r.ok ? r.json() : {profile: null}))
      .then(({profile}) => {
        if (!cancelled) setHasProfile(!!profile)
      })
      .catch(() => {
        if (!cancelled) setHasProfile(false)
      })

    return () => {
      cancelled = true
    }
  }, [session])

  const closeForm = () => {
    setCreating(false)
    setError(null)
  }

  /**
   * AddressToCoords and Adds the New Event
   */
  const handleSave = async (values: EventFormData) => {
    setSaving(true)
    setError(null)
    try {
      const coords = await AddressToCoords(values.address)
      if (!coords) {
        setError('No locations found for that address.')
        return
      }
      setEventList((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: values.title,
          date: values.date,
          lat: coords.lat,
          lng: coords.lng,
          desc: values.description || coords.displayName,
          tags: values.tags,
          creatorId: session?.user.id ?? 't',
        },
      ])

      const [y, m, d] = values.date.split('-').map(Number)
      setDate(new Date(y, m - 1, d))
      setActiveStart(new Date(y, m - 1, 1))
      closeForm()
    } catch {
      setError('Failed to get coordinates. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex h-dvh flex-col">
        <Header />
        <main className="flex-1 bg-stridex-grey">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-2">
            {/* Calendar + Map with Marker */}
            <section className="flex flex-col gap-4">
              <div className="shrink-0">
                <Calendar
                  value={date}
                  onChange={(d) => setDate(d as Date)}
                  activeStartDate={activeStart}
                  onActiveStartDateChange={({activeStartDate}) =>
                    activeStartDate && setActiveStart(activeStartDate)
                  }
                  showNavigation={false}
                  className="!w-full !max-w-full"
                />
              </div>

              <div className="h-[30vh] md:h-[50vh]">
                <MapContainer center={CENTERED_MAP} zoom={14} scrollWheelZoom className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Recenter position={mapCenter} />
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

            {/* Month Navbar + Create Event + Event List */}
            <section className="p-4 text-white md:overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="rounded px-3 py-1 text-2xl hover:bg-white/10"
                >
                  ‹
                </button>
                <h2 className="text-2xl font-bold">{monthLabel}</h2>
                <button
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="rounded px-3 py-1 text-2xl hover:bg-white/10"
                >
                  ›
                </button>
                {session && hasProfile && (
                  <button
                    onClick={() => setCreating(true)}
                    aria-label="Create event"
                    className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
                  >
                    +
                  </button>
                )}
              </div>

              <h3 className="mb-2 text-xl font-semibold">
                Events on {date.toLocaleDateString()}
              </h3>

              {todaysEvents.length === 0 ? (
                <p>No Events Today</p>
              ) : (
                <ul className="list-disc pl-5">
                  {todaysEvents.map((event) => (
                    <li key={event.id}>{event.title}</li>
                  ))}
                </ul>
              )}

              {creating && (
                <EventForm
                  defaultDate={selected}
                  onSave={handleSave}
                  onCancel={closeForm}
                  error={error}
                  saving={saving}
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default Events