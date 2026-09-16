import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function AdminGallery() {
  const { id } = useParams();

  const [gallery, setGallery] = useState(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // ============================================
  // LOAD GALLERY
  // ============================================

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
      if (error.message === "Gallery not found") {
        setGallery(null);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [id]);

  // ============================================
  // CREATE GALLERY
  // ============================================

  const handleCreateGallery = async () => {
    try {
      setCreating(true);
      setError("");
      setSuccess("");
      setPin("");

      const data = await apiRequest(`/gallery/events/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGallery(data.gallery);
      setPin(data.pin);

      setSuccess(
        "Gallery created successfully. Save the PIN because it will only be shown now."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  // ============================================
  // UPDATE GALLERY
  // ============================================

  const handleUpdateGallery = async () => {
    if (!gallery) {
      return;
    }

    const confirmed = window.confirm(
      "Update this gallery with the photos currently selected for the event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const data = await apiRequest(
        `/gallery/${gallery.slug}/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGallery(data.gallery);

      setSuccess(
        gallery.published
          ? "Published gallery updated successfully."
          : "Gallery updated successfully."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // ============================================
  // REGENERATE PIN
  // ============================================

  const handleRegeneratePin = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to regenerate the gallery PIN?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRegenerating(true);
      setError("");
      setSuccess("");

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

      setSuccess(
        "New PIN generated successfully. The previous PIN is no longer valid."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setRegenerating(false);
    }
  };

  // ============================================
  // PUBLISH GALLERY
  // ============================================

  const handlePublishGallery = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this gallery?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPublishing(true);
      setError("");
      setSuccess("");

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

      setSuccess("Gallery published successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setPublishing(false);
    }
  };

  // ============================================
  // COPY GALLERY URL
  // ============================================

  const getGalleryUrl = () => {
    if (!gallery) {
      return "";
    }

    return `${window.location.origin}/gallery/${gallery.slug}`;
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getGalleryUrl());

      setSuccess("Gallery URL copied to clipboard.");
      setError("");
    } catch (error) {
      setError("Failed to copy gallery URL.");
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading gallery...
        </p>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

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
            Create and publish the customer-facing gallery.
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

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {/* No Gallery */}
        {!gallery && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">

            <div className="text-5xl mb-4">
              🖼️
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No Gallery Created
            </h2>

            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
              Select photos from the event first. Then create a
              gallery for the customer.
            </p>

            <button
              onClick={handleCreateGallery}
              disabled={creating}
              className="mt-6 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {creating
                ? "Creating Gallery..."
                : "Create Gallery"}
            </button>

          </div>
        )}

        {/* Gallery Exists */}
        {gallery && (
          <div className="space-y-6">

            {/* Gallery Status */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Gallery Status
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Customer gallery information
                  </p>
                </div>

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

              </div>

              {/* Gallery Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Gallery Slug */}
                <div className="border rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Gallery Slug
                  </p>

                  <p className="font-mono text-gray-900 mt-2 break-all">
                    {gallery.slug}
                  </p>

                </div>

                {/* Selected Photos */}
                <div className="border rounded-xl p-4">

                  <p className="text-sm text-gray-500">
                    Selected Photos
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {gallery.selectedPhotoCount}
                  </p>

                </div>

              </div>

            </div>

            {/* UPDATE GALLERY */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Update Gallery Photos
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Select or unselect photos from the event, then update
                this gallery to synchronize the customer-facing photos.
              </p>

              <button
                onClick={handleUpdateGallery}
                disabled={updating}
                className="mt-5 w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {updating
                  ? "Updating Gallery..."
                  : "Update Gallery"}
              </button>

            </div>

            {/* Gallery URL */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Gallery Link
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Share this link with the customer.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">

                <input
                  type="text"
                  readOnly
                  value={getGalleryUrl()}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 bg-gray-50 text-gray-700"
                />

                <button
                  onClick={handleCopyUrl}
                  className="px-5 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900"
                >
                  Copy Link
                </button>

              </div>

            </div>

            {/* PIN */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Gallery PIN
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Customers need this PIN to access the gallery.
                  </p>
                </div>

                <button
                  onClick={handleRegeneratePin}
                  disabled={regenerating}
                  className="px-5 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900 disabled:opacity-50"
                >
                  {regenerating
                    ? "Generating..."
                    : "Regenerate PIN"}
                </button>

              </div>

              {pin ? (

                <div className="mt-6">

                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-center">

                    <p className="text-sm text-blue-600 font-semibold">
                      New Gallery PIN
                    </p>

                    <p className="text-4xl font-bold tracking-[0.5em] text-blue-900 mt-3">
                      {pin}
                    </p>

                    <p className="text-xs text-blue-600 mt-4">
                      Save this PIN. It is shown only when created or regenerated.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="mt-5 rounded-lg bg-gray-50 border p-4">

                  <p className="text-sm text-gray-600">
                    The PIN is securely stored and cannot be displayed again.
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Use <strong>Regenerate PIN</strong> to create a new PIN.
                  </p>

                </div>

              )}

            </div>

            {/* Publish */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Publish Gallery
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Publishing makes the selected photos available through
                the customer gallery link after PIN verification.
              </p>

              {!gallery.published ? (

                <button
                  onClick={handlePublishGallery}
                  disabled={publishing}
                  className="mt-6 w-full sm:w-auto px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {publishing
                    ? "Publishing..."
                    : "Publish Gallery"}
                </button>

              ) : (

                <div className="mt-6">

                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">

                    <p className="font-semibold text-green-700">
                      ✓ Gallery is published
                    </p>

                    {gallery.publishedAt && (
                      <p className="text-sm text-green-600 mt-1">
                        Published on:{" "}
                        {new Date(
                          gallery.publishedAt
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>

                  <Link
                    to={`/gallery/${gallery.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    Open Customer Gallery
                  </Link>

                </div>

              )}

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminGallery;