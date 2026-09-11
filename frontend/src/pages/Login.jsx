function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h1 className="text-3xl font-bold">
          Welcome back
        </h1>

        <p className="mt-2 text-slate-400">
          Login to your account
        </p>

        <form className="mt-8 space-y-5">

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
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-3 font-semibold hover:bg-blue-600"
          >
            Login
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300">
            Register
          </a>
        </p>

      </div>

    </div>
  )
}

export default Login