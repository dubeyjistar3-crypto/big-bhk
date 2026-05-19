import { Edit, FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { defaultPages } from '../../data/defaultPages';
import { getLocalPages, saveLocalPage } from '../../services/localStore';

const pageOrder = ['about', 'contact'];

function normalizeFeatureText(features = []) {
  return features.map((feature) => `${feature.icon || 'Gem'} | ${feature.title || ''} | ${feature.text || ''}`).join('\n');
}

function parseFeatureText(value) {
  return value
    .split('\n')
    .map((line) => {
      const [icon, title, ...textParts] = line.split('|').map((part) => part.trim());
      return { icon: icon || 'Gem', title: title || '', text: textParts.join(' | ') || '' };
    })
    .filter((feature) => feature.title && feature.text);
}

function AdminPages() {
  const [pages, setPages] = useState(pageOrder.map((slug) => defaultPages[slug]));
  const [activeSlug, setActiveSlug] = useState('about');
  const [form, setForm] = useState(defaultPages.about);
  const [featuresText, setFeaturesText] = useState(normalizeFeatureText(defaultPages.about.features));
  const [message, setMessage] = useState('');

  const load = () => api.get('/pages')
    .then((res) => setPages(pageOrder.map((slug) => res.data.pages.find((page) => page.slug === slug) || defaultPages[slug])))
    .catch(() => setPages(getLocalPages()));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const next = pages.find((page) => page.slug === activeSlug) || defaultPages[activeSlug];
    setForm(next);
    setFeaturesText(normalizeFeatureText(next.features || []));
  }, [activeSlug, pages]);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      features: activeSlug === 'about' ? parseFeatureText(featuresText) : [],
    };

    try {
      const res = await api.put(`/pages/${activeSlug}`, payload);
      setPages((current) => current.map((page) => (page.slug === activeSlug ? res.data.page : page)));
      setMessage('Page content saved successfully.');
    } catch {
      const saved = saveLocalPage(activeSlug, payload);
      setPages((current) => current.map((page) => (page.slug === activeSlug ? saved : page)));
      setMessage('API/MongoDB abhi connected nahi hai. Content is browser me locally save ho gaya hai.');
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-section-head">
        <h2>Update Website Pages</h2>
      </div>

      <div className="page-editor-tabs">
        {pageOrder.map((slug) => (
          <button
            key={slug}
            className={activeSlug === slug ? 'active' : ''}
            type="button"
            onClick={() => {
              setActiveSlug(slug);
              setMessage('');
            }}
          >
            {activeSlug === slug ? <Edit /> : <FileText />}
            {defaultPages[slug].title}
          </button>
        ))}
      </div>

      <form className="property-form page-content-form" onSubmit={submit}>
        <input required placeholder="SEO title" value={form.seoTitle || ''} onChange={(e) => updateField('seoTitle', e.target.value)} />
        <input required placeholder="SEO description" value={form.seoDescription || ''} onChange={(e) => updateField('seoDescription', e.target.value)} />
        <input required placeholder="Hero eyebrow" value={form.eyebrow || ''} onChange={(e) => updateField('eyebrow', e.target.value)} />
        <textarea required placeholder="Hero title" value={form.heroTitle || ''} onChange={(e) => updateField('heroTitle', e.target.value)} />
        <textarea required placeholder="Hero text" value={form.heroText || ''} onChange={(e) => updateField('heroText', e.target.value)} />

        {activeSlug === 'about' ? (
          <>
            <input placeholder="Section eyebrow" value={form.sectionEyebrow || ''} onChange={(e) => updateField('sectionEyebrow', e.target.value)} />
            <textarea placeholder="Section title" value={form.sectionTitle || ''} onChange={(e) => updateField('sectionTitle', e.target.value)} />
            <textarea placeholder="Section text" value={form.sectionText || ''} onChange={(e) => updateField('sectionText', e.target.value)} />
            <div className="editor-help">
              <label>Feature cards</label>
              <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
              <small>One card per line: Icon | Title | Text. Icons: Gem, BriefcaseBusiness, Users, Award.</small>
            </div>
          </>
        ) : (
          <>
            <input required placeholder="Contact card title" value={form.contactName || ''} onChange={(e) => updateField('contactName', e.target.value)} />
            <input required placeholder="Phone" value={form.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
            <input required type="email" placeholder="Email" value={form.email || ''} onChange={(e) => updateField('email', e.target.value)} />
            <input required placeholder="Address" value={form.address || ''} onChange={(e) => updateField('address', e.target.value)} />
          </>
        )}

        <button className="btn btn-primary" type="submit"><Save /> Save Page</button>
      </form>
      {message && <p className="form-status">{message}</p>}
    </div>
  );
}

export default AdminPages;
