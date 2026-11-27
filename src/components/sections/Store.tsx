import Header from './Header';
import type {FormEvent} from 'react'
import {useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {authClient} from '../../lib/authClient'

type StoreItem = {id: number, image: string, caption: string, userID: string};

type StoreFormData = {
  file: File
  caption: string
}

type StoreFormProps = {
  onSave: (values: StoreFormData) => void | Promise<void>
  onCancel: () => void
  error?: string | null
  saving?: boolean
}

function StoreForm({onSave, onCancel, error, saving}: StoreFormProps){
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(!file)
      return;
    onSave({file, caption: caption.trim()})
  }

  const inputClass = 'w-full rounded border border-stridex-lightgrey bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-stridex-green'

  return(
     <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="m-auto w-full max-w-md rounded-2xl border border-stridex-lightgrey bg-stridex-black p-6 text-white backdrop:bg-black/60"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Add to Store</h2>

        <label className="flex flex-col gap-1 text-sm">
          Image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Caption (optional)
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            className={inputClass}
          />
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
            disabled={saving || !file}
            className="rounded-full border border-white px-4 py-2 hover:bg-stridex-lightgrey disabled:opacity-50"
          >
            {saving ? 'Uploading…' : 'Add'}
          </button>
        </div>
      </form>
    </dialog>
  )
}


function Store(){
  const {data: session} = authClient.useSession();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/store')
      .then((r) => (r.ok ? r.json() : {items: []}))
      .then(({items}) => setItems(items))
      .catch(() => {});
  }, []);

  const closeForm = () => {
    setCreating(false);
    setError(null);
  }

  const handleSave = async({file, caption}: StoreFormData) => {
    setSaving(true);
    setError(null);
    try{
      const body = new FormData();
      body.append('image', file);
      body.append('caption', caption);

      const res = await fetch('/api/store', {method: 'POST', body})
      if(!res.ok){
        const data = await res.json().catch(() => null);
        setError(data?.error ?? 'Upload Error');
        return;
      }
      const {item} = await res.json();
      setItems((prev) => [item, ...prev])
      closeForm();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);

    }
  }



  // Asks the server to delete one item
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this image?')) return
    try {
      const res = await fetch(`/api/store/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch {
      // network error: server leaves the item alone
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 bg-stridex-grey p-4 text-white">
        <div className="mx-auto max-w-7xl">
          {session && (
            <button
              onClick={() => setCreating(true)}
              className="mb-6 rounded-full border border-white px-4 py-2 hover:bg-stridex-lightgrey"
            >
              Add to Store
            </button>
          )}

          {items.length === 0 ? (
            <p>Nothing here yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {items.map((item) => (
                <li key={item.id}>
                  {/* Clicking the image opens the owner's profile */}
                  <Link to={`/profile/${item.userID}`} className="block">
                    <img
                      src={item.image}
                      alt={item.caption || 'Store item'}
                      loading="lazy"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    {item.caption && <p className="mt-1 text-sm">{item.caption}</p>}
                  </Link>

                  {/* Only the user who posted it sees this button.*/}
                  {session?.user.id === item.userID && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.caption || 'image'}`}
                      className="mt-1 rounded-full border border-red-400 px-3 py-1 text-sm text-red-400 hover:bg-white/10"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {creating && (
            <StoreForm onSave={handleSave} onCancel={closeForm} error={error} saving={saving} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Store;