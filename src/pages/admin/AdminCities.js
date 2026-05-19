import { Image, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { cityOptions } from '../../data/cities';
import { defaultCityContent } from '../../data/cityContent';
import { fileListToDataUrls, getLocalCityContent, saveLocalCityContent } from '../../services/localStore';

function AdminCities() {
  const [cities, setCities] = useState(() => getLocalCityContent());
  const [activeCity, setActiveCity] = useState(cityOptions[0]);
  const [form, setForm] = useState(defaultCityContent[cityOptions[0]]);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/cities')
      .then((res) => {
        const next = { ...defaultCityContent };
        res.data.cities.forEach((item) => {
          next[item.city] = { image: item.image, tagline: item.tagline || defaultCityContent[item.city]?.tagline || '' };
        });
        setCities(next);
      })
      .catch(() => setCities(getLocalCityContent()));
  }, []);

  useEffect(() => {
    setForm(cities[activeCity] || defaultCityContent[activeCity]);
    setImageFile(null);
  }, [activeCity, cities]);

  const submit = async (event) => {
    event.preventDefault();
    let payload = { ...form };
    try {
      if (imageFile) {
        const imagePayload = new FormData();
        imagePayload.append('image', imageFile);
        const uploadRes = await api.post('/uploads/image', imagePayload, { timeout: 20000 });
        payload = { ...payload, image: uploadRes.data.url };
      }
      const res = await api.put(`/cities/${activeCity}`, payload);
      setCities((current) => ({
        ...current,
        [activeCity]: { image: res.data.city.image, tagline: res.data.city.tagline },
      }));
      setMessage('City image saved successfully.');
    } catch {
      if (imageFile) {
        const [dataUrl] = await fileListToDataUrls([imageFile]);
        payload = { ...payload, image: dataUrl };
      }
      const saved = saveLocalCityContent(activeCity, payload);
      setCities(saved);
      setMessage('API/MongoDB abhi connected nahi hai. City image is browser me locally save ho gayi hai.');
    }
    setImageFile(null);
  };

  return (
    <div className="admin-card">
      <div className="admin-section-head">
        <h2>Update City Images</h2>
      </div>
      <div className="page-editor-tabs city-admin-tabs">
        {cityOptions.map((city) => (
          <button className={activeCity === city ? 'active' : ''} key={city} onClick={() => setActiveCity(city)} type="button">
            <Image /> {city}
          </button>
        ))}
      </div>
      <form className="property-form page-content-form" onSubmit={submit}>
        <div className="upload-field">
          <label>City hero image</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          <small>{imageFile?.name || 'Choose an image from your computer.'}</small>
        </div>
        <textarea placeholder="City tagline" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        {form.image && (
          <div className="city-image-preview">
            <img src={form.image} alt={activeCity} />
            <span>{activeCity}</span>
          </div>
        )}
        <button className="btn btn-primary" type="submit"><Save /> Save City</button>
      </form>
      {message && <p className="form-status">{message}</p>}
    </div>
  );
}

export default AdminCities;
