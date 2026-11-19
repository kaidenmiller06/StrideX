import Header from './Header';
import type {FormEvent} from 'react'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {authClient} from '../../lib/authClient'

type StoreItem = {id: number, image: string, caption: string, userID: string};

function Store(){
  const {data: session} = authClient.useSession();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  

  useEffect(() => {
    fetch('/api/store')
    .then((r) => (r.ok ? r.json() : {items: []}))
    .then(({items}) => setItems(items))
    .catch(() => {}) 
  }, [])


  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; 
    if (!file)
      return;
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
      setFile(null);
      setCaption('');
      form.reset();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);

    }
  }


  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 bg-stridex-grey p-4 text-white">
        <div className="mx-auto max-w-7xl">
          {session && (
            <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption (optional)"
                maxLength={200}
                className="rounded border border-stridex-lightgrey bg-white px-3 py-2 text-black"
              />
              <button
                type="submit"
                disabled={saving || !file}
                className="rounded-full border border-white px-4 py-2 hover:bg-stridex-lightgrey disabled:opacity-50"
              >
                {saving ? 'Uploading…' : 'Add to store'}
              </button>
              {error && <p className="w-full text-red-400">{error}</p>}
            </form>
          )}

          {items.length === 0 ? (
            <p>Nothing here yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {items.map((item) => (
                <li key={item.id}>
                  <Link to={`/profile/${item.userID}`} className="block">
                    <img
                      src={item.image}
                      alt={item.caption || 'Store item'}
                      loading="lazy"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    {item.caption && <p className="mt-1 text-sm">{item.caption}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default Store;