import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ============================================
          HEADER
      ============================================ */}

      <header className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                TrizenAI PhotoShare
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Admin / Lead Dashboard
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* ============================================
          MAIN
      ============================================ */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}

        <div className="mb-10">

          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {user.name || "Admin"} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            Manage your events, team members, photos and customer galleries.
          </p>

        </div>


        {/* ============================================
            QUICK ACTIONS
        ============================================ */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* EVENTS */}

          <Link
            to="/admin/events"
            className="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md hover:border-blue-300 transition"
          >

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              📅
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-5">
              Events
            </h3>

            <p className="text-gray-500 mt-2">
              Create events, assign team members and manage event photos.
            </p>

            <p className="text-blue-600 font-semibold mt-5 group-hover:underline">
              Manage Events →
            </p>

          </Link>


          {/* PHOTOS */}

          <Link
            to="/admin/events"
            className="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md hover:border-green-300 transition"
          >

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              📸
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-5">
              Photos
            </h3>

            <p className="text-gray-500 mt-2">
              Review uploaded photos and select the best photos for galleries.
            </p>

            <p className="text-green-600 font-semibold mt-5 group-hover:underline">
              Review Photos →
            </p>

          </Link>


          {/* GALLERIES */}

          <Link
            to="/admin/events"
            className="group bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md hover:border-purple-300 transition"
          >

            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
              🖼️
            </div>

            <h3 className="text-xl font-bold text-gray-900 mt-5">
              Galleries
            </h3>

            <p className="text-gray-500 mt-2">
              Create, publish and manage customer photo galleries.
            </p>

            <p className="text-purple-600 font-semibold mt-5 group-hover:underline">
              Manage Galleries →
            </p>

          </Link>

        </div>


        {/* ============================================
            WORKFLOW
        ============================================ */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-10">

          <h2 className="text-xl font-bold text-gray-900">
            Photo Sharing Workflow
          </h2>

          <p className="text-gray-500 mt-1">
            Follow these steps to publish a customer gallery.
          </p>


          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">

            {/* STEP 1 */}

            <div className="text-center">

              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                1
              </div>

              <h3 className="font-semibold text-gray-900 mt-3">
                Create Event
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Create an event for the photo collection.
              </p>

            </div>


            {/* STEP 2 */}

            <div className="text-center">

              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                2
              </div>

              <h3 className="font-semibold text-gray-900 mt-3">
                Assign Team
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add team members to the event.
              </p>

            </div>


            {/* STEP 3 */}

            <div className="text-center">

              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                3
              </div>

              <h3 className="font-semibold text-gray-900 mt-3">
                Upload Photos
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Team members upload event photos.
              </p>

            </div>


            {/* STEP 4 */}

            <div className="text-center">

              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                4
              </div>

              <h3 className="font-semibold text-gray-900 mt-3">
                Select Photos
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Choose photos for the customer.
              </p>

            </div>


            {/* STEP 5 */}

            <div className="text-center">

              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                5
              </div>

              <h3 className="font-semibold text-gray-900 mt-3">
                Publish Gallery
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Share the gallery link and PIN.
              </p>

            </div>

          </div>

        </div>


        {/* ============================================
            ACCOUNT INFORMATION
        ============================================ */}

        <div className="bg-white rounded-2xl border shadow-sm p-6 mt-10">

          <h2 className="text-xl font-bold text-gray-900">
            Account Information
          </h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {user.name || "Not available"}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium text-gray-900 mt-1 break-all">
                {user.email || "Not available"}
              </p>
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-medium text-gray-900 mt-1">
                Admin / Lead
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;