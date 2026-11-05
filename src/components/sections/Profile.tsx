import { Person, PlusLg } from 'react-bootstrap-icons';
import Header from './Header';

function Profile() {
  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1 bg-stridex-grey">
          <div className="mx-auto grid max-w-7xl grid-cols-1 p-4 gap-4 md:grid-cols-2">
            {/* Profile Section */}
            <section className="min-w-0 overflow-y-auto">
              <div className="flex flex-row gap-4 mb-4">
                <div className="flex flex-col items-center">
                  {/* <img src="path/to/image.jpg" alt="Profile Image" /> */}
                  <Person size={150} className="text-stridex-lightgrey mb-2" />

                  <div className="flex flex-row gap-2">
                    <button className="px-4 py-2 text-white rounded-full border border-white hover:bg-stridex-lightgrey focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-white transition-colors duration-300">
                      Connect
                    </button>

                    <button className="aspect-square inline-flex items-center justify-center p-2 text-white rounded-full border border-white hover:bg-stridex-lightgrey focus:border-stridex-darkgreen focus:ring-2 focus:ring-stridex-green focus:ring-opacity-50 active:bg-white transition-colors duration-300">
                      <PlusLg size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-bold text-white">John Doe</h1>
                  <p className="mb-2 text-stridex-lightgrey">@johndoe</p>

                  <p className="text-white">Cross Country | Track and Field</p>
                  <p className="mb-2 text-white">Elizabethtown College '28</p>

                  <p className="mb-2 text-white">Its clobberin' time!</p>

                  <p className="mb-2 text-white">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-stridex-black rounded-full">
                      DIII XC | TF
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-stridex-black rounded-full">
                      10 K
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-stridex-black rounded-full">
                      5 K
                    </span>
                  </div>
                </div>
              </div>

              {/* Posts Section */}
              <div className="flex flex-row w-full gap-4">
                <div className="aspect-square flex flex-col w-1/3 p-4 bg-stridex-black border border-stridex-lightgrey rounded-2xl text-white">Post</div>
                <div className="aspect-square flex flex-col w-1/3 p-4 bg-stridex-black border border-stridex-lightgrey rounded-2xl text-white">Post</div>
                <div className="aspect-square flex flex-col w-1/3 p-4 bg-stridex-black border border-stridex-lightgrey rounded-2xl text-white">Post</div>
              </div>
            </section>

            {/* Events Section */}
            <section className="min-w-0">
              <div className="flex flex-col w-full p-2 bg-stridex-black border border-stridex-lightgrey rounded-full text-white">Event</div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Profile;