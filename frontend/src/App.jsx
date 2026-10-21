import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResourceProvider } from './context/ResourceContext';
import { RequestProvider } from './context/RequestContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import Rent from './pages/Rent';
import ResourceDetails from './pages/ResourceDetails';
import CreateResource from './pages/CreateResource';
import EditResource from './pages/EditResource';
import RequestBoard from './pages/RequestBoard';
import CreateRequest from './pages/CreateRequest';
import RequestDetails from './pages/RequestDetails';
import UrgentRequests from './pages/UrgentRequests';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResourceProvider>
          <RequestProvider>
            <div className="app-shell">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Browsing Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/rent" element={<Rent />} />
                  <Route path="/resources/:id" element={<ResourceDetails />} />
                  <Route path="/requests" element={<RequestBoard />} />
                  <Route path="/requests/:id" element={<RequestDetails />} />
                  <Route path="/urgent" element={<UrgentRequests />} />
                  <Route path="/profile/:id" element={<PublicProfile />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes (Require Login) */}
                  <Route
                    path="/create-resource"
                    element={
                      <ProtectedRoute>
                        <CreateResource />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/resources/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EditResource />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests/create"
                    element={
                      <ProtectedRoute>
                        <CreateRequest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages/:id"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </RequestProvider>
        </ResourceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
