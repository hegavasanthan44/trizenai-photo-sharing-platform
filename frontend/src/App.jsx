import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminEventDetails from "./pages/AdminEventDetails";
import AdminGallery from "./pages/AdminGallery";
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
        
      </Routes>
    </BrowserRouter>
  );
}



export default App;