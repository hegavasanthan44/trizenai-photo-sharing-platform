import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function AdminEventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Load event details
  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvent(data.event);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load photos
  const loadPhotos = async () => {
    try {
      setPhotoLoading(true);

      const data = await apiRequest(`/photos/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPhotos(data.photos);
    } catch (error) {
      setError(error.message);
    } finally {
      setPhotoLoading(false);
    }
  };

  // Load event and photos when page opens
  useEffect(() => {
    loadEvent();
    loadPhotos();
  }, [id]);

  // Add team member
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("Team member User ID is required");
      return;
    }

    try {
      setAdding(true);
      setError("");

      await apiRequest(`/events/${id}/members`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      });

      setUserId("");

      await loadEvent();
    } catch (error) {
      setError(error.message);
    } finally {
      setAdding(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">
          {error || "Event not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <Link
            to="/admin/events"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Events
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            {event.name}
          </h1>

          <p className="text-gray-600 mt-1">
            {event.description || "No description"}
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Event + Add Member */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Event Information */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Event Information
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Event Name
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {event.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Description
                </p>

                <p className="text-gray-900 mt-1">
                  {event.description || "No description"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Team Members
                </p>

                <p className="font-medium text-gray-900 mt-1">
                  {event.teamMembers?.length || 0}
                </p>
              </div>

            </div>
          </div>

          {/* Add Team Member */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Add Team Member
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Enter the User ID of a registered team member.
            </p>

            <form
              onSubmit={handleAddMember}
              className="mt-5 space-y-4"
            >

              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Team member User ID"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={adding}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Team Member"}
              </button>

            </form>
          </div>

        </div>

        {/* Assigned Team Members */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Assigned Team Members
          </h2>

          {event.teamMembers?.length === 0 ? (

            <p className="text-gray-500 mt-5">
              No team members assigned yet.
            </p>

          ) : (

            <div className="mt-5 space-y-3">

              {event.teamMembers.map((member) => (

                <div
                  key={member._id}
                  className="border rounded-xl p-4"
                >

                  <p className="font-semibold text-gray-900">
                    {member.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {member.email}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 break-all">
                    ID: {member._id}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Photo Management */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Uploaded Photos
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Review and select photos for the customer gallery.
              </p>

            </div>

            <span className="text-sm text-gray-500">
              {photos.length} photo
              {photos.length !== 1 ? "s" : ""}
            </span>

          </div>

          {/* Loading photos */}
          {photoLoading ? (

            <p className="text-gray-500 mt-6">
              Loading photos...
            </p>

          ) : photos.length === 0 ? (

            <p className="text-gray-500 mt-6">
              No photos uploaded yet.
            </p>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

              {photos.map((photo) => (

                <div
                  key={photo._id}
                  className="border rounded-xl overflow-hidden"
                >

                  {/* Photo */}
                  <img
                    src={photo.storageUrl}
                    alt={photo.filename}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-4">

                    {/* Filename */}
                    <p className="font-medium text-gray-900 truncate">
                      {photo.filename}
                    </p>

                    {/* Uploaded by */}
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded by:{" "}
                      {photo.uploadedBy?.name || "Unknown"}
                    </p>

                    {/* Selection status */}
                    <div className="mt-4 flex items-center justify-between">

                      <span
                        className={`text-sm font-semibold ${
                          photo.selected
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {photo.selected
                          ? "Selected"
                          : "Not selected"}
                      </span>
                      <button
    onClick={async () => {
      try {
        setError("");

        await apiRequest(`/photos/${photo._id}/select`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selected: !photo.selected,
          }),
        });

        await loadPhotos();
      } catch (error) {
        setError(error.message);
      }
    }}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
      photo.selected
        ? "bg-gray-600 hover:bg-gray-700"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    {photo.selected ? "Unselect" : "Select"}
  </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminEventDetails;