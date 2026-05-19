import { Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import { defaultPages } from '../data/defaultPages';
import { getLocalPage } from '../services/localStore';

function Footer() {
  const [contact, setContact] = useState(defaultPages.contact);

  useEffect(() => {
    const loadContact = () => {
      api.get(`/pages/contact?ts=${Date.now()}`)
        .then((res) => setContact(res.data.page || defaultPages.contact))
        .catch(() => setContact(getLocalPage('contact') || defaultPages.contact));
    };

    loadContact();
    window.addEventListener('focus', loadContact);
    window.addEventListener('pageshow', loadContact);

    return () => {
      window.removeEventListener('focus', loadContact);
      window.removeEventListener('pageshow', loadContact);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand brand">
            <span className="brand-logo" aria-label="BIG BHK">
              <span className="brand-logo-badge">BB</span>
              <span className="brand-logo-text">
                <span>BIG</span>
                <strong>BHK</strong>
              </span>
            </span>
          </div>
          <p style={{ maxWidth: 300 }}>Premium advisory for residential, villa, plotted and investment-grade real estate across NCR.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <a href="/properties">Luxury Homes</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </div>
        <div>
          <h4>Contact</h4>
          <p><Phone size={15} /> {contact.phone}</p>
          <p><Mail size={15} /> {contact.email}</p>
          <p><MapPin size={15} /> {contact.address}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} BIG BHK. All rights reserved.</span>
        <span style={{ fontSize: '0.8rem' }}>Privacy Policy &middot; Terms</span>
      </div>
    </footer>
  );
}

export default Footer;
