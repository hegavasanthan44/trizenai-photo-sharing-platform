import { Link } from "react-router-dom";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              TrizenAI
            </h1>
            <p className="text-sm text-gray-500">
              Photo Sharing Platform
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500">
              Admin
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your events, team members, photos and galleries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/events"
            className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
          >
            <div className="text-3xl mb-4">📅</div>

            <h3 className="text-xl font-semibold text-gray-900">
              Events
            </h3>

            <p className="mt-2 text-gray-600">
              Create events and assign team members.
            </p>
          </Link>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="text-3xl mb-4">📸</div>

            <h3 className="text-xl font-semibold text-gray-900">
              Photos
            </h3>

            <p className="mt-2 text-gray-600">
              Review and select uploaded photos.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="text-3xl mb-4">🖼️</div>

            <h3 className="text-xl font-semibold text-gray-900">
              Galleries
            </h3>

            <p className="mt-2 text-gray-600">
              Create and publish customer galleries.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;