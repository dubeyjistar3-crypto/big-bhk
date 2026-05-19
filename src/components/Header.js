import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import api from '../api/client';
import { defaultHeaderSettings } from '../data/defaultHeader';
import { getLocalHeaderSettings } from '../services/localStore';

function Header() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(defaultHeaderSettings);

  useEffect(() => {
    api.get('/header')
      .then((res) => setSettings(res.data.header || defaultHeaderSettings))
      .catch(() => setSettings(getLocalHeaderSettings()));
  }, []);

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-logo" aria-label="BIG BHK">
          <span className="brand-logo-badge">BB</span>
          <span className="brand-logo-text">
            <span>BIG</span>
            <strong>BHK</strong>
          </span>
        </span>
      </Link>
      <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={open ? 'nav open' : 'nav'}>
        {(settings.links || defaultHeaderSettings.links).map(({ to, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
        <div className="nav-actions">
          <Link className="nav-action nav-action-outline" to="/admin/properties" onClick={() => setOpen(false)}>
            Post Property
          </Link>
          <Link className="nav-action nav-action-filled" to="/admin/login" onClick={() => setOpen(false)}>
            Owner Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
