import { BarChart3, Building2, ClipboardList, FileText, Home, Image, LayoutTemplate, LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const { logout, admin } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-logo" aria-label="BIG BHK">
            <span className="brand-logo-badge">BB</span>
            <span className="brand-logo-text">
              <span>BIG</span>
              <strong>BHK</strong>
            </span>
          </span>
        </div>
        <NavLink to="/admin" end><Home /> Dashboard</NavLink>
        <NavLink to="/admin/properties"><Building2 /> Properties</NavLink>
        <NavLink to="/admin/header"><LayoutTemplate /> Header</NavLink>
        <NavLink to="/admin/stats"><BarChart3 /> Home Counters</NavLink>
        <NavLink to="/admin/cities"><Image /> City Images</NavLink>
        <NavLink to="/admin/pages"><FileText /> Pages</NavLink>
        <NavLink to="/admin/enquiries"><ClipboardList /> Enquiries</NavLink>
        <button onClick={logout}><LogOut /> Logout</button>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Admin panel</span>
            <h1>Welcome{admin?.name ? `, ${admin.name}` : ''}</h1>
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
