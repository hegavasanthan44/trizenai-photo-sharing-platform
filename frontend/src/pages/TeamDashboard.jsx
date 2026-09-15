import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function TeamDashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load events"
          );
        }

        setEvents(data.events || []);
      } catch (error) {
        console.error("Fetch events error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEvents();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              TrizenAI PhotoShare
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Team Member Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">

          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {user.name || "Team Member"} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            View your assigned events and upload photos.
          </p>

        </div>

        {/* Assigned Events */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Assigned Events
              </h2>

              <p className="text-gray-500 mt-1">
                Events assigned to you by an admin.
              </p>
            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
              {events.length} Events
            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Loading your events...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* No Events */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">

              <div className="text-5xl mb-4">
                📅
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                No events assigned
              </h3>

              <p className="text-gray-500 mt-2">
                Ask an admin to assign you to an event.
              </p>

            </div>
          )}

          {/* Events */}
          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {events.map((event) => (
                <div
                  key={event._id}
                  className="border rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition"
                >

                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                    📸
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-4">
                    {event.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    {event.description ||
                      "No description provided."}
                  </p>

                  {event.createdBy && (
                    <p className="text-sm text-gray-500 mt-4">
                      Created by:{" "}
                      <span className="font-medium text-gray-700">
                        {event.createdBy.name}
                      </span>
                    </p>
                  )}

                  <Link
                    to={`/team/events/${event._id}`}
                    className="block text-center mt-5 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Open Event →
                  </Link>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Permissions */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-10">

          <h2 className="text-xl font-bold text-gray-900">
            Your Permissions
          </h2>

          <div className="mt-5 space-y-3">

            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">
                ✓
              </span>

              <p className="text-gray-700">
                View assigned events
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">
                ✓
              </span>

              <p className="text-gray-700">
                Upload photos to assigned events
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">
                ✓
              </span>

              <p className="text-gray-700">
                View your uploaded photos
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">
                ✕
              </span>

              <p className="text-gray-700">
                Cannot select photos
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">
                ✕
              </span>

              <p className="text-gray-700">
                Cannot publish galleries
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default TeamDashboard;