import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function AdminGallery() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState(null);
  const [pin, setPin] = useState("");

  const token = localStorage.getItem("token");

  // Load existing gallery
  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/gallery/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGallery(data.gallery);
    } catch (error) {
      // 404 simply means a gallery has not been created yet
      if (error.message === "Gallery not found") {
        setGallery(null);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create gallery
  const createGallery = async () => {
    try {
      setCreating(true);
      setError("");

      const data = await apiRequest(`/gallery/events/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGallery(data.gallery);
      setPin(data.pin);
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };
  const publishGallery = async () => {
  try {
    setError("");

    const data = await apiRequest(
      `/gallery/${gallery.slug}/publish`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setGallery(data.gallery);
  } catch (error) {
    setError(error.message);
  }
};
const regeneratePin = async () => {
  try {
    setError("");

    const data = await apiRequest(
      `/gallery/${gallery.slug}/regenerate-pin`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPin(data.pin);
  } catch (error) {
    setError(error.message);
  }
};

  useEffect(() => {
    loadGallery();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-5">

          <Link
            to={`/admin/events/${id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Event
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            Customer Gallery
          </h1>

          <p className="text-gray-600 mt-1">
            Create and publish the gallery for your customer.
          </p>

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* No Gallery */}
        {!gallery && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">

            <h2 className="text-xl font-semibold text-gray-900">
              Create Customer Gallery
            </h2>

            <p className="text-gray-600 mt-2">
              The gallery will contain all photos that you selected
              for this event.
            </p>

            <button
              onClick={createGallery}
              disabled={creating}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? "Creating Gallery..." : "Create Gallery"}
            </button>

          </div>
        )}

        {/* Gallery Exists */}
        {gallery && (
          <div className="bg-white rounded-2xl shadow-sm border p-8">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-gray-900">
                Gallery Details
              </h2>

              <p className="text-gray-600 mt-2">
                Your gallery has been created successfully.
              </p>

            </div>

            {/* Gallery Slug */}
            <div className="border rounded-xl p-5 mb-5">

              <p className="text-sm text-gray-500">
                Gallery Slug
              </p>

              <p className="font-mono font-semibold text-gray-900 mt-2 break-all">
                {gallery.slug}
              </p>

            </div>

            {/* Gallery URL */}
            <div className="border rounded-xl p-5 mb-5">

              <p className="text-sm text-gray-500">
                Gallery URL
              </p>

              <p className="font-mono text-blue-600 mt-2 break-all">
                {window.location.origin.replace(
                  ":5173",
                  ":5173"
                )}/gallery/{gallery.slug}
              </p>

            </div>

            {/* PIN */}
            <div className="border rounded-xl p-5 mb-5">

  <p className="text-sm text-gray-500">
    Customer PIN
  </p>

  {pin ? (
    <>
      <p className="text-3xl font-bold tracking-widest text-gray-900 mt-2">
        {pin}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Use this PIN to access the customer gallery.
      </p>
    </>
  ) : (
    <p className="text-gray-500 mt-2">
      PIN is hidden because it was generated previously.
    </p>
  )}

  <button
    onClick={regeneratePin}
    className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
  >
    Regenerate PIN
  </button>

</div>


            {/* Selected Photos */}
            <div className="border rounded-xl p-5">

              <p className="text-sm text-gray-500">
                Selected Photos
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {gallery.selectedPhotoCount}
              </p>

            </div>

            {/* Publish Status */}

<div className="mt-6 flex items-center gap-4">

  <span
    className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
      gallery.published
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {gallery.published
      ? "Published"
      : "Not Published"}
  </span>

  {!gallery.published && (
    <button
      onClick={publishGallery}
      className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
    >
      Publish Gallery
    </button>
  )}

</div>

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminGallery;