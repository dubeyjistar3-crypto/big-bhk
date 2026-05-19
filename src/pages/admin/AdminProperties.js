import { Edit, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { cityOptions } from '../../data/cities';
import { deleteLocalProperty, fileListToDataUrls, getLocalProperties, saveLocalProperty } from '../../services/localStore';
import { formatPrice } from '../../utils/format';

const blankProperty = {
  title: '',
  location: '',
  city: 'Noida',
  type: 'Apartment',
  status: 'New Launch',
  price: '',
  bedrooms: 3,
  bathrooms: 3,
  area: '',
  shortDescription: '',
  description: '',
  amenities: '',
  featured: false,
};

const propertyFields = [
  'title',
  'location',
  'city',
  'type',
  'status',
  'price',
  'bedrooms',
  'bathrooms',
  'area',
  'shortDescription',
  'description',
  'amenities',
  'featured',
];

const propertyTypes = ['Apartment', 'Villa', 'Penthouse', 'Plot'];
const propertyStatuses = ['New Launch', 'Under Construction', 'Ready To Move'];

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankProperty);
  const [heroFile, setHeroFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => api.get('/properties')
    .then((res) => setProperties(res.data.properties))
    .catch(() => setProperties(getLocalProperties()));

  useEffect(() => {
    load();
  }, []);

  const openForm = (property = null) => {
    setFormOpen(true);
    setEditing(property);
    setForm(property ? { ...property, amenities: property.amenities?.join(', ') || '' } : blankProperty);
    setHeroFile(null);
    setGalleryFiles([]);
    setMessage('');
  };

  const updateFormField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    propertyFields.forEach((key) => payload.append(key, form[key] ?? ''));
    if (heroFile) payload.append('heroImage', heroFile);
    Array.from(galleryFiles).forEach((file) => payload.append('galleryImages', file));
    const uploadConfig = { timeout: 20000 };

    try {
      if (editing?._id) await api.put(`/properties/${editing._id}`, payload, uploadConfig);
      else await api.post('/properties', payload, uploadConfig);
      setMessage('Property saved successfully.');
    } catch {
      const [heroUrls, galleryUrls] = await Promise.all([
        heroFile ? fileListToDataUrls([heroFile]) : Promise.resolve([]),
        fileListToDataUrls(galleryFiles),
      ]);
      saveLocalProperty(
        { ...form, _id: editing?._id, slug: editing?.slug, heroImage: editing?.heroImage, images: editing?.images },
        { heroImage: heroUrls[0], galleryImages: galleryUrls },
      );
      setMessage('API/MongoDB abhi connected nahi hai. Property is browser me locally save ho gayi hai.');
    }
    setFormOpen(false);
    setEditing(null);
    setForm(blankProperty);
    setHeroFile(null);
    setGalleryFiles([]);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
    } catch {
      deleteLocalProperty(id);
      setMessage('API/MongoDB abhi connected nahi hai. Property is browser se locally delete ho gayi hai.');
    }
    load();
  };

  return (
    <div className="admin-card">
      <div className="admin-section-head">
        <h2>Add/Edit/Delete Properties</h2>
        <button className="btn btn-primary" onClick={() => openForm()}><Plus /> Add Property</button>
      </div>

      {formOpen && (
        <form className="property-form" onSubmit={submit}>
          <button type="button" className="icon-btn form-close" onClick={() => setFormOpen(false)}><X /></button>
          <input required placeholder="Project title" value={form.title} onChange={(e) => updateFormField('title', e.target.value)} />
          <input required placeholder="Location" value={form.location} onChange={(e) => updateFormField('location', e.target.value)} />
          <select value={form.city} onChange={(e) => updateFormField('city', e.target.value)}>{cityOptions.map((option) => <option key={option}>{option}</option>)}</select>
          <select value={form.type} onChange={(e) => updateFormField('type', e.target.value)}>{propertyTypes.map((option) => <option key={option}>{option}</option>)}</select>
          <select value={form.status} onChange={(e) => updateFormField('status', e.target.value)}>{propertyStatuses.map((option) => <option key={option}>{option}</option>)}</select>
          <input required type="number" placeholder="Price" value={form.price} onChange={(e) => updateFormField('price', e.target.value)} />
          <input required type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => updateFormField('bedrooms', e.target.value)} />
          <input required type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => updateFormField('bathrooms', e.target.value)} />
          <input required type="number" placeholder="Area sq.ft." value={form.area} onChange={(e) => updateFormField('area', e.target.value)} />
          <input required placeholder="Short description" value={form.shortDescription} onChange={(e) => updateFormField('shortDescription', e.target.value)} />
          <textarea required placeholder="Full description" value={form.description} onChange={(e) => updateFormField('description', e.target.value)} />
          <input placeholder="Amenities comma separated" value={form.amenities} onChange={(e) => updateFormField('amenities', e.target.value)} />
          <label className="checkbox"><input type="checkbox" checked={String(form.featured) === 'true' || form.featured === true} onChange={(e) => updateFormField('featured', e.target.checked)} /> Featured property</label>
          <div className="upload-field">
            <label>Hero banner image</label>
            <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} />
            <small>This image appears as project detail banner and listing cover.</small>
          </div>
          <div className="upload-field">
            <label>Project gallery images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
            <small>Upload multiple interior, exterior, amenity and floor images.</small>
          </div>
          {(heroFile || galleryFiles.length > 0 || editing?.heroImage || editing?.images?.length > 0) && (
            <div className="upload-summary">
              <span>Hero: {heroFile?.name || (editing?.heroImage ? 'Existing hero image' : 'Not selected')}</span>
              <span>Gallery: {galleryFiles.length || editing?.images?.length || 0} image(s)</span>
            </div>
          )}
          <button className="btn btn-primary" type="submit">Save Property</button>
        </form>
      )}
      {message && <p className="form-status">{message}</p>}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Project</th><th>Location</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id}>
                <td>{property.title}</td>
                <td>{property.location}</td>
                <td>{formatPrice(property.price)}</td>
                <td>{property.status}</td>
                <td className="table-actions">
                  <button onClick={() => openForm(property)}><Edit /> Edit</button>
                  <button onClick={() => remove(property._id)}><Trash2 /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProperties;
