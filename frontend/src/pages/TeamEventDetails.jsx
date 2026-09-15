import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function TeamEventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const loadEvent = async () => {
    try {
      const data = await apiRequest(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvent(data.event);
    } catch (error) {
      setError(error.message);
    }
  };

  const loadMyPhotos = async () => {
    try {
      const data = await apiRequest("/photos/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const eventPhotos = data.photos.filter(
        (photo) => photo.eventId === id
      );

      setPhotos(eventPhotos);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([loadEvent(), loadMyPhotos()]);

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(
        `http://localhost:5000/api/photos/events/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Photo upload failed");
      }

      setSuccess("Photo uploaded successfully!");
      setFile(null);

      document.getElementById("photoInput").value = "";

      await loadMyPhotos();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          {error || "Event not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <Link
            to="/team/dashboard"
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {event.name}
          </h1>

          <p className="text-gray-600 mt-2">
            {event.description || "No description provided."}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            Upload Photo
          </h2>

          <form onSubmit={handleUpload}>
            <input
              id="photoInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full border border-gray-300 rounded-lg p-3 mb-4"
            />

            <p className="text-sm text-gray-500 mb-4">
              Allowed formats: JPEG, PNG, WebP. Maximum size: 10 MB.
            </p>

            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-semibold"
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            My Uploaded Photos
          </h2>

          {photos.length === 0 ? (
            <p className="text-gray-500">
              You have not uploaded any photos yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  className="border rounded-xl overflow-hidden"
                >
                  <img
                    src={photo.storageUrl}
                    alt={photo.filename}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {photo.filename}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {photo.selected
                        ? "Selected by Admin"
                        : "Uploaded"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default TeamEventDetails;