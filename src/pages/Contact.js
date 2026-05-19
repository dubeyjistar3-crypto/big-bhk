import { Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import Seo from '../components/Seo';
import { defaultPages } from '../data/defaultPages';
import { getLocalPage, saveLocalEnquiry } from '../services/localStore';

function Contact() {
  const [page, setPage] = useState(defaultPages.contact);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/pages/contact')
      .then((res) => setPage(res.data.page))
      .catch(() => setPage(getLocalPage('contact')));
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const enquiry = { ...form };

    saveLocalEnquiry(enquiry);
    setStatus('Thanks. Our team will connect with you.');
    setForm({ name: '', email: '', phone: '', message: '' });
    api.post('/enquiries', enquiry).catch(() => {});
  };

  return (
    <>
      <Seo title={page.seoTitle} description={page.seoDescription} />
      <section className="page-hero contact-hero">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.heroTitle}</h1>
        <p>{page.heroText}</p>
      </section>
      <section className="contact-section">
        <div className="contact-card">
          <h2>{page.contactName}</h2>
          <p><Phone /> {page.phone}</p>
          <p><Mail /> {page.email}</p>
          <p><MapPin /> {page.address}</p>
        </div>
        <form className="form-card" onSubmit={submit}>
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Requirement" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn btn-primary" type="submit">Send Enquiry</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </section>
    </>
  );
}

export default Contact;
