import { CheckCircle2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import api from '../api/client';
import { saveLocalEnquiry } from '../services/localStore';

function EnquiryModal({ open, onClose, property }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  if (!open) return null;

  const submit = (event) => {
    event.preventDefault();
    const enquiry = { ...form, propertyId: property?._id, propertyTitle: property?.title };

    saveLocalEnquiry(enquiry);
    setStatus('Thank you. Our advisor will contact you shortly.');
    setForm({ name: '', email: '', phone: '', message: '' });
    api.post('/enquiries', enquiry).catch(() => {});
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="enquiry-modal">
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Close enquiry"><X /></button>
        <div className="modal-intro">
          <span className="eyebrow"><Sparkles size={14} /> Priority callback</span>
          <h2>{property ? `Enquire for ${property.title}` : 'Speak with a property expert'}</h2>
          <div className="modal-trust-row">
            <span><ShieldCheck size={15} /> Verified inventory</span>
            <span><CheckCircle2 size={15} /> Fast response</span>
          </div>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Tell us your requirement" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn btn-primary" type="submit">Request Callback</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </div>
  );
}

export default EnquiryModal;
