import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminEventDetails from "./pages/AdminEventDetails";
import AdminGallery from "./pages/AdminGallery";
import CustomerGallery from "./pages/CustomerGallery";
import TeamDashboard from "./pages/TeamDashboard";
import TeamEventDetails from "./pages/TeamEventDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/gallery/:slug"
          element={<CustomerGallery />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEventDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/:id/gallery"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminGallery />
            </ProtectedRoute>
          }
        />

        {/* Team Member Routes */}
        <Route
          path="/team/dashboard"
          element={
            <ProtectedRoute allowedRoles={["team_member"]}>
              <TeamDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team/events/:id"
          element={
            <ProtectedRoute allowedRoles={["team_member"]}>
              <TeamEventDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;