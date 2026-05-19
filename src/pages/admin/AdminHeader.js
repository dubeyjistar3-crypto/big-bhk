import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { defaultHeaderSettings } from '../../data/defaultHeader';
import { fileListToDataUrls, getLocalHeaderSettings, saveLocalHeaderSettings } from '../../services/localStore';

function AdminHeader() {
  const [form, setForm] = useState(() => getLocalHeaderSettings());
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/header')
      .then((res) => setForm(res.data.header || defaultHeaderSettings))
      .catch(() => setForm(getLocalHeaderSettings()));
  }, []);

  const updateLink = (index, key, value) => {
    setForm((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) => (
        linkIndex === index ? { ...link, [key]: value } : link
      )),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    let payload = { ...form };
    try {
      if (logoFile) {
        const logoPayload = new FormData();
        logoPayload.append('image', logoFile);
        const uploadRes = await api.post('/uploads/image', logoPayload, { timeout: 20000 });
        payload = { ...payload, logoUrl: uploadRes.data.url };
      }
      const res = await api.put('/header', payload);
      setForm(res.data.header);
      setMessage('Header saved successfully.');
    } catch {
      if (logoFile) {
        const [dataUrl] = await fileListToDataUrls([logoFile]);
        payload = { ...payload, logoUrl: dataUrl };
      }
      saveLocalHeaderSettings(payload);
      setForm(payload);
      setMessage('API/MongoDB abhi connected nahi hai. Header settings is browser me locally save ho gayi hain.');
    }
    setLogoFile(null);
  };

  return (
    <div className="admin-card">
      <div className="admin-section-head">
        <h2>Update Header</h2>
      </div>
      <form className="stats-admin-form" onSubmit={submit}>
        <div className="stats-admin-row header-admin-row">
          <input value={form.brandName || ''} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder="Brand name" />
          <div className="upload-field compact-upload">
            <label>Logo image</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            <small>{logoFile?.name || 'Choose logo image from your computer.'}</small>
          </div>
          {form.logoUrl && (
            <div className="header-logo-preview">
              <img src={form.logoUrl} alt={form.brandName} />
            </div>
          )}
        </div>
        {form.links.map((link, index) => (
          <div className="stats-admin-row header-admin-row" key={`${link.to}-${index}`}>
            <input value={link.label} onChange={(e) => updateLink(index, 'label', e.target.value)} placeholder="Menu label" />
            <input value={link.to} onChange={(e) => updateLink(index, 'to', e.target.value)} placeholder="Menu link" />
          </div>
        ))}
        <div className="stats-admin-row header-admin-row">
          <input value={form.exploreLabel || ''} onChange={(e) => setForm({ ...form, exploreLabel: e.target.value })} placeholder="Explore label" />
          <input value={form.exploreLink || ''} onChange={(e) => setForm({ ...form, exploreLink: e.target.value })} placeholder="Explore link" />
          <input value={form.enquiryLabel || ''} onChange={(e) => setForm({ ...form, enquiryLabel: e.target.value })} placeholder="Enquiry button text" />
        </div>
        <button className="btn btn-primary" type="submit"><Save /> Save Header</button>
      </form>
      {message && <p className="form-status">{message}</p>}
    </div>
  );
}

export default AdminHeader;
