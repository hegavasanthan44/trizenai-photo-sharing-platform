import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function CustomerGallery() {
  const { slug } = useParams();

  const [pin, setPin] = useState("");
  const [photos, setPhotos] = useState([]);
  const [verified, setVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pin.trim()) {
      setError("Please enter the gallery PIN");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setError("PIN must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/gallery/${slug}/verify`, {
        method: "POST",
        body: JSON.stringify({
          pin,
        }),
      });

      setPhotos(data.gallery.photos);
      setVerified(true);
    } catch (error) {
      setVerified(false);
      setPhotos([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // PIN SCREEN
  // ============================================

  if (!verified) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          <div className="bg-white rounded-2xl shadow-sm border p-8">

            <div className="text-center">

              <div className="text-5xl mb-4">
                📸
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                Private Gallery
              </h1>

              <p className="text-gray-600 mt-2">
                Enter the 6-digit PIN to view this gallery.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}


            {/* PIN FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              <div>

                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gallery PIN
                </label>

                <input
                  id="pin"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      setPin(value);
                    }
                  }}
                  placeholder="Enter 6-digit PIN"
                  className="w-full rounded-lg border border-gray-300 px-4 py-4 text-center text-2xl tracking-[0.5em] font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Verifying..."
                  : "Access Gallery"}
              </button>

            </form>

          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Secure photo gallery
          </p>

        </div>

      </div>
    );
  }


  // ============================================
  // GALLERY
  // ============================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Your Photo Gallery
              </h1>

              <p className="text-gray-600 mt-1">
                {photos.length} selected photo
                {photos.length !== 1 ? "s" : ""}
              </p>

            </div>

            <button
              onClick={() => {
                setVerified(false);
                setPhotos([]);
                setPin("");
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Lock Gallery
            </button>

          </div>

        </div>

      </header>


      {/* PHOTO GRID */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {photos.length === 0 ? (

          <div className="bg-white rounded-2xl border p-10 text-center">

            <div className="text-5xl mb-4">
              📷
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No photos available
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no selected photos in this gallery.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {photos.map((photo) => (

              <div
                key={photo._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border"
              >

                <img
                  src={photo.storageUrl}
                  alt={photo.filename}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />

                <div className="p-4">

                  <p className="font-medium text-gray-900 truncate">
                    {photo.filename}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      photo.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default CustomerGallery;