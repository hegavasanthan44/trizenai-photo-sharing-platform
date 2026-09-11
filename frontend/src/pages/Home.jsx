function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          
          <h1 className="text-2xl font-bold">
            Trizen<span className="text-blue-400">Gallery</span>
          </h1>

          <div className="flex gap-4">
            <a
              href="/login"
              className="rounded-lg px-4 py-2 text-slate-300 hover:text-white"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-lg bg-blue-500 px-4 py-2 font-medium hover:bg-blue-600"
            >
              Get Started
            </a>
          </div>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Photo Sharing Platform
          </p>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Capture.
            <br />
            Collaborate.
            <br />
            Share.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            A collaborative platform for photography teams to upload,
            organize, select and securely share event photos with customers.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/register"
              className="rounded-lg bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600"
            >
              Create Account
            </a>

            <a
              href="/login"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
            >
              Login
            </a>
          </div>

        </div>
      </main>

    </div>
  )
}

export default Home