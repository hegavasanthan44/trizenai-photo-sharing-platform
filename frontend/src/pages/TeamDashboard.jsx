import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function TeamDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(data.events);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Team Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user.name || "Team Member"}
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Page heading */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Assigned Events
          </h2>

          <p className="text-gray-600 mt-2">
            View your assigned events and upload photos.
          </p>

        </div>

        {/* Events */}
        {events.length === 0 ? (

          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">

            <h3 className="text-xl font-semibold text-gray-900">
              No events assigned
            </h3>

            <p className="text-gray-500 mt-2">
              You don't have any events assigned to you yet.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {events.map((event) => (

              <div
                key={event._id}
                className="bg-white rounded-2xl border shadow-sm p-6"
              >

                <h3 className="text-xl font-semibold text-gray-900">
                  {event.name}
                </h3>

                <p className="text-gray-600 mt-2 line-clamp-3">
                  {event.description || "No description"}
                </p>

                <Link
                  to={`/team/events/${event._id}`}
                  className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Open Event
                </Link>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default TeamDashboard;