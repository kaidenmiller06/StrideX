import Header from './Header';

function Store(){
  return(
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 bg-stridex-grey">
        <div className="mx-auto grid max-w-7xl grid-cols-1 p-4 gap-4 md:grid-cols-2">
          {/* Store Section */}
          Store
        </div>
      </main>
    </div>
  )
}

export default Store;