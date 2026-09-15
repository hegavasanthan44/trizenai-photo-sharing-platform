import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminEventDetails from "./pages/AdminEventDetails";
import AdminGallery from "./pages/AdminGallery";
import CustomerGallery from "./pages/CustomerGallery";
import TeamEventDetails from "./pages/TeamEventDetails";


import TeamDashboard from "./pages/TeamDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/events"
          element={<AdminEvents />}
        />
        <Route
          path="/admin/events/:id"
          element={<AdminEventDetails />}
        />
        <Route
          path="/admin/events/:id/gallery"
          element={<AdminGallery />}
        />
        <Route
          path="/gallery/:slug"
          element={<CustomerGallery />}
        />
        <Route
          path="/team/dashboard"
          element={<TeamDashboard />}
        />
        <Route
          path="/team/events/:id"
          element={<TeamEventDetails />}
        />
        
      </Routes>
    </BrowserRouter>
  );
}



export default App;