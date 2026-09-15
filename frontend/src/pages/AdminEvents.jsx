import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

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

  const handleCreateEvent = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Event name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      await apiRequest("/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      setName("");
      setDescription("");

      await loadEvents();
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Link
            to="/admin/dashboard"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            Events
          </h1>

          <p className="text-gray-600 mt-1">
            Create and manage your photo-sharing events.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Event */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Create Event
            </h2>

            <form
              onSubmit={handleCreateEvent}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Annual College Event"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event description"
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>

          {/* Event List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Events
                </h2>

                <span className="text-sm text-gray-500">
                  {events.length} event{events.length !== 1 ? "s" : ""}
                </span>
              </div>

              {loading ? (
                <p className="text-gray-500 mt-6">
                  Loading events...
                </p>
              ) : events.length === 0 ? (
                <p className="text-gray-500 mt-6">
                  No events created yet.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="border rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.name}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            {event.description || "No description"}
                          </p>

                          <p className="text-sm text-gray-500 mt-3">
                            Team members:{" "}
                            {event.teamMembers?.length || 0}
                          </p>
                        </div>

                        <Link
                          to={`/admin/events/${event._id}`}
                          className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminEvents;