import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Announcements from "./pages/Announcements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import Track from "./pages/Track";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import Submit from "./pages/Submit";
import MyRequests from "./pages/MyRequests";
import RequestDetail from "./pages/RequestDetail";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRequests from "./pages/AdminRequests";
import AdminUsers from "./pages/AdminUsers";
import AdminAnnouncements from "./pages/AdminAnnouncements";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/pengumuman" element={<Announcements />} />
        <Route path="/pengumuman/:id" element={<AnnouncementDetail />} />
        <Route path="/lacak" element={<Track />} />
        <Route path="/lacak/:id" element={<Track />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User-only */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/ajukan" element={
          <ProtectedRoute role="user"><Submit /></ProtectedRoute>
        } />
        <Route path="/permohonan" element={
          <ProtectedRoute role="user"><MyRequests /></ProtectedRoute>
        } />
        <Route path="/permohonan/:id" element={
          <ProtectedRoute><RequestDetail /></ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Admin-only */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/permohonan" element={
          <ProtectedRoute role="admin"><AdminRequests /></ProtectedRoute>
        } />
        <Route path="/admin/permohonan/:id" element={
          <ProtectedRoute role="admin"><RequestDetail /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>
        } />
        <Route path="/admin/pengumuman" element={
          <ProtectedRoute role="admin"><AdminAnnouncements /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
