import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  FilePlus2,
  FileText,
  Globe2,
  Home,
  Image,
  LayoutTemplate,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    label: 'Properties',
    items: [
      { to: '/admin/properties', icon: Building2, label: 'My Properties' },
      { to: '/admin/properties', icon: Plus, label: 'Add New Property' },
      { to: '/admin/cities', icon: Image, label: 'Projects' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { to: '/admin/enquiries', icon: ClipboardList, label: 'Enquiries', badge: 'New' },
      { to: '/admin/pages', icon: FileText, label: 'Pages' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { to: '/admin', icon: BarChart3, label: 'Performance', end: true },
      { to: '/admin/stats', icon: FilePlus2, label: 'Reports' },
    ],
  },
  {
    label: 'Config',
    items: [
      { to: '/admin/header', icon: LayoutTemplate, label: 'Header' },
      { to: '/admin/pages', icon: Settings, label: 'Settings' },
    ],
  },
];

const routeTitles = {
  '/admin': 'Dashboard',
  '/admin/properties': 'Properties',
  '/admin/header': 'Header Settings',
  '/admin/stats': 'Home Counters',
  '/admin/cities': 'City Images',
  '/admin/pages': 'Pages',
  '/admin/enquiries': 'Enquiries',
};

function AdminLayout() {
  const { logout, admin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const title = routeTitles[location.pathname] || 'Dashboard';
  const initials = useMemo(() => (admin?.name || 'BIG BHK Admin')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(), [admin?.name]);

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-head">
          <span className="brand-logo" aria-label="BIG BHK">
            <span className="brand-logo-badge">BB</span>
            <span className="brand-logo-text">
              <span>BIG</span>
              <strong>BHK</strong>
            </span>
          </span>
          <button className="admin-menu-close" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close admin menu">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end onClick={() => setSidebarOpen(false)}><Home /> Dashboard</NavLink>
          {navGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <span>{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    end={item.end}
                    key={`${group.label}-${item.label}`}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon />
                    {item.label}
                    {item.badge && <b>{item.badge}</b>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-user-card">
          <span>{initials}</span>
          <div>
            <strong>{admin?.name || 'BIG BHK Admin'}</strong>
            <small>Super Admin</small>
          </div>
          <button onClick={logout} type="button" aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open admin menu">
            <Menu />
          </button>
          <div>
            <h1>{title}</h1>
            <p>BIGBHK Admin &rarr; {title}</p>
          </div>
          <div className="admin-topbar-actions">
            <Link className="admin-outline-action" to="/">
              <Globe2 size={17} />
              View Site
            </Link>
            <Link className="admin-gold-action" to="/admin/properties">
              <Plus size={17} />
              Add Property
            </Link>
            <button className="admin-bell" type="button" aria-label="Notifications">
              <Bell />
              <i />
            </button>
          </div>
        </header>
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
