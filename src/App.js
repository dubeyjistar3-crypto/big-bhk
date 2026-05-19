import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import SiteLayout from './layouts/SiteLayout';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Properties from './pages/Properties';
import ProtectedRoute from './routes/ProtectedRoute';

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminCities = lazy(() => import('./pages/admin/AdminCities'));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminHeader = lazy(() => import('./pages/admin/AdminHeader'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminPages = lazy(() => import('./pages/admin/AdminPages'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
        <Suspense fallback={<main className="route-loading" />}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:slug" element={<ProjectDetail />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="header" element={<AdminHeader />} />
              <Route path="cities" element={<AdminCities />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
