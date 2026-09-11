function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h1 className="text-3xl font-bold">
          Create account
        </h1>

        <p className="mt-2 text-slate-400">
          Register as an Admin / Lead
        </p>

        <form className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-3 font-semibold hover:bg-blue-600"
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </a>
        </p>

      </div>

    </div>
  )
}

export default Register