import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

function CustomerGallery() {
  const { slug } = useParams();

  const [pin, setPin] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const verifyPin = async (e) => {
    e.preventDefault();

    if (!pin.trim()) {
      setError("Please enter the gallery PIN");
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
      setError(error.message);
      setVerified(false);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  // Gallery photos
  if (verified) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">

            <h1 className="text-3xl font-bold text-gray-900">
              Photo Gallery
            </h1>

            <p className="text-gray-600 mt-1">
              Your selected event photos
            </p>

          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">

          {photos.length === 0 ? (

            <div className="bg-white rounded-2xl border p-8 text-center">
              <p className="text-gray-600">
                No photos are available in this gallery.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {photos.map((photo) => (

                <div
                  key={photo._id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                >

                  <img
                    src={photo.storageUrl}
                    alt={photo.filename}
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-4">

                    <p className="font-medium text-gray-900 truncate">
                      {photo.filename}
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

  // PIN screen
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border p-8">

          <div className="text-center">

            <div className="text-4xl mb-4">
              🔐
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Private Gallery
            </h1>

            <p className="text-gray-600 mt-2">
              Enter the PIN provided by the event organizer.
            </p>

          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={verifyPin}
            className="mt-6"
          >

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery PIN
            </label>

            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 6-digit PIN"
              maxLength="6"
              inputMode="numeric"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-widest outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "View Gallery"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CustomerGallery;