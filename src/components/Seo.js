import { useEffect } from 'react';

function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | BIG BHK` : 'BIG BHK | Luxury Real Estate';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return null;
}

export default Seo;
