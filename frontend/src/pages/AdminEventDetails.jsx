import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function AdminEventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [gallery, setGallery] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [updatingGallery, setUpdatingGallery] = useState(false);

  const token = localStorage.getItem("token");

  // ============================================
  // LOAD EVENT
  // ============================================

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

  // ============================================
  // LOAD PHOTOS
  // ============================================

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

  // ============================================
  // LOAD GALLERY
  // ============================================

  const loadGallery = async () => {
    try {
      setGalleryLoading(true);

      const data = await apiRequest(`/gallery/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGallery(data.gallery);
    } catch (error) {
      // Gallery may not exist yet
      if (error.message === "Gallery not found") {
        setGallery(null);
      } else {
        setError(error.message);
      }
    } finally {
      setGalleryLoading(false);
    }
  };

  // ============================================
  // LOAD DATA
  // ============================================

  useEffect(() => {
    loadEvent();
    loadPhotos();
    loadGallery();
  }, [id]);

  // ============================================
  // ADD TEAM MEMBER
  // ============================================

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("Team member User ID is required");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

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
      setSuccess("Team member added successfully.");

      await loadEvent();
    } catch (error) {
      setError(error.message);
    } finally {
      setAdding(false);
    }
  };

  // ============================================
  // SELECT / UNSELECT PHOTO
  // ============================================

  const handleSelectPhoto = async (photo) => {
    try {
      setError("");
      setSuccess("");

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

      if (gallery) {
        setSuccess(
          "Photo selection changed. Click 'Update Customer Gallery' to synchronize the gallery."
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // ============================================
  // UPDATE EXISTING GALLERY
  // ============================================

  const handleUpdateGallery = async () => {
    if (!gallery) {
      return;
    }

    const selectedCount = photos.filter(
      (photo) => photo.selected
    ).length;

    if (selectedCount === 0) {
      setError(
        "Please select at least one photo before updating the gallery."
      );
      return;
    }

    const confirmed = window.confirm(
      gallery.published
        ? "Update the published customer gallery with the currently selected photos?"
        : "Update the customer gallery with the currently selected photos?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingGallery(true);
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
          ? "Published customer gallery updated successfully."
          : "Customer gallery updated successfully."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingGallery(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading event...
        </p>
      </div>
    );
  }

  // ============================================
  // EVENT NOT FOUND
  // ============================================

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

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-wrap items-center gap-4">

            <Link
              to="/admin/events"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Events
            </Link>

            <Link
              to={`/admin/events/${id}/gallery`}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
            >
              Manage Gallery
            </Link>

          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {event.name}
          </h1>

          <p className="text-gray-600 mt-1">
            {event.description || "No description"}
          </p>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ========================================
            ERROR MESSAGE
        ======================================== */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* ========================================
            SUCCESS MESSAGE
        ======================================== */}

        {success && (
          <div className="mb-6 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        {/* ========================================
            EVENT INFORMATION + ADD MEMBER
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* EVENT INFORMATION */}

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

                <p className="text-xs text-gray-400 mt-2 break-all">
                  Event ID: {event._id}
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

          {/* ADD TEAM MEMBER */}

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
                {adding
                  ? "Adding..."
                  : "Add Team Member"}
              </button>

            </form>

          </div>

        </div>

        {/* ========================================
            ASSIGNED TEAM MEMBERS
        ======================================== */}

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

        {/* ========================================
            UPLOADED PHOTOS
        ======================================== */}

        <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

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

          {/* GALLERY UPDATE NOTICE */}

          {gallery && (
            <div className="mt-5 rounded-xl bg-purple-50 border border-purple-200 p-5">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <p className="font-semibold text-purple-900">
                    Customer Gallery Exists
                  </p>

                  <p className="text-sm text-purple-700 mt-1">
                    {gallery.published
                      ? "The gallery is currently published."
                      : "The gallery has been created but is not published yet."}
                  </p>

                  <p className="text-sm text-purple-700 mt-1">
                    Current gallery photos:{" "}
                    <strong>
                      {gallery.selectedPhotoCount}
                    </strong>
                  </p>

                </div>

                <button
                  onClick={handleUpdateGallery}
                  disabled={
                    updatingGallery ||
                    galleryLoading
                  }
                  className="px-5 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  {updatingGallery
                    ? "Updating..."
                    : "Update Customer Gallery"}
                </button>

              </div>

            </div>
          )}

          {/* PHOTO LOADING */}

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

                  {/* PHOTO */}

                  <img
                    src={photo.storageUrl}
                    alt={photo.filename}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-4">

                    {/* FILENAME */}

                    <p className="font-medium text-gray-900 truncate">
                      {photo.filename}
                    </p>

                    {/* UPLOADED BY */}

                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded by:{" "}
                      {photo.uploadedBy?.name || "Unknown"}
                    </p>

                    {/* SELECT STATUS + BUTTON */}

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
                        onClick={() => handleSelectPhoto(photo)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                          photo.selected
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {photo.selected
                          ? "Unselect"
                          : "Select"}
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