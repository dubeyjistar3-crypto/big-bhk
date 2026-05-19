import { Bath, BedDouble, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Download, Image, MapPin, Phone, Ruler, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import api from '../api/client';
import Seo from '../components/Seo';
import { fallbackProperties } from '../data/fallbackProperties';
import { getLocalProperties } from '../services/localStore';
import { assetUrl, formatPrice } from '../utils/format';

const amenityImages = [
  'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
];

function getPreviousIndex(current, length) {
  return current === 0 ? length - 1 : current - 1;
}

function ProjectDetail() {
  const { slug } = useParams();
  const { openEnquiry } = useOutletContext();
  const [property, setProperty] = useState(() => getLocalProperties().find((item) => item.slug === slug) || fallbackProperties.find((item) => item.slug === slug));
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [amenityIndex, setAmenityIndex] = useState(0);

  useEffect(() => {
    setProperty(getLocalProperties().find((item) => item.slug === slug) || fallbackProperties.find((item) => item.slug === slug));
    setLoading(false);
    setGalleryIndex(0);
    setAmenityIndex(0);
    api.get(`/properties/${slug}`)
      .then((res) => setProperty(res.data.property))
      .catch(() => setProperty(getLocalProperties().find((item) => item.slug === slug)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading && !property) return <section className="section"><h1>Loading property...</h1></section>;
  if (!property) return <section className="section"><h1>Property not found</h1></section>;

  const images = (property.images?.length ? property.images : [property.heroImage]).filter(Boolean);
  const amenities = property.amenities || [];
  const showPreviousGallery = () => setGalleryIndex((current) => getPreviousIndex(current, images.length));
  const showNextGallery = () => setGalleryIndex((current) => (current + 1) % images.length);
  const showPreviousAmenity = () => setAmenityIndex((current) => getPreviousIndex(current, amenities.length));
  const showNextAmenity = () => setAmenityIndex((current) => (current + 1) % amenities.length);

  return (
    <>
      <Seo title={property.title} description={property.shortDescription} />
      <section className="detail-hero">
        <img className="detail-hero-bg" src={assetUrl(property.heroImage || images[0])} alt={property.title} fetchPriority="high" />
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <span className="project-status">{property.status}</span>
            <h1>{property.title}</h1>
            <p><MapPin /> {property.location}</p>
            <div className="detail-hero-actions">
              <strong>{formatPrice(property.price)}</strong>
              <button className="btn btn-primary" onClick={() => openEnquiry(property)}><Phone size={18} /> Enquire Now</button>
            </div>
          </div>
        </div>
      </section>

      <section className="project-facts">
        <div><BedDouble /><span>Bedrooms</span><strong>{property.bedrooms}</strong></div>
        <div><Bath /><span>Bathrooms</span><strong>{property.bathrooms}</strong></div>
        <div><Ruler /><span>Super area</span><strong>{property.area} sq.ft.</strong></div>
        <div><CalendarDays /><span>Possession</span><strong>{property.status}</strong></div>
      </section>

      <section className="detail-shell">
        <div className="detail-main">
          <section className="overview-card">
            <span className="eyebrow">Project overview</span>
            <h2>{property.shortDescription}</h2>
            <p>{property.description}</p>
            <div className="trust-row">
              <span><ShieldCheck size={18} /> Verified inventory</span>
              <span><CheckCircle2 size={18} /> Site visit support</span>
              <span><Download size={18} /> Price sheet on request</span>
            </div>
          </section>

          <section className="amenity-card">
            <div className="section-mini-head">
              <span className="eyebrow">Lifestyle amenities</span>
              <h2>Everything expected from a premium address</h2>
            </div>
            {amenities.length > 0 && (
              <div className="amenity-carousel">
                <button className="slider-arrow" onClick={showPreviousAmenity} type="button" aria-label="Previous amenity"><ChevronLeft /></button>
                <div className="amenity-track-wrap">
                  <div className="amenity-track" style={{ transform: `translateX(-${amenityIndex * 100}%)` }}>
                    {amenities.map((amenity, index) => (
                      <article className="amenity-slide" key={amenity}>
                        <img src={amenityImages[index % amenityImages.length]} alt={amenity} loading="lazy" decoding="async" />
                        <div>
                          <CheckCircle2 size={18} />
                          <h3>{amenity}</h3>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                <button className="slider-arrow" onClick={showNextAmenity} type="button" aria-label="Next amenity"><ChevronRight /></button>
              </div>
            )}
            <div className="slider-dots">
              {amenities.map((amenity, index) => (
                <button
                  className={index === amenityIndex ? 'active' : ''}
                  key={amenity}
                  onClick={() => setAmenityIndex(index)}
                  type="button"
                  aria-label={`Show ${amenity}`}
                />
              ))}
            </div>
          </section>

          <div className="investment-band">
            <div>
              <span className="eyebrow">Advisor note</span>
              <h2>Best suited for end-users and long-horizon investors.</h2>
            </div>
            <p>Ask for current availability, payment plan, floor preference and comparable pricing before shortlisting.</p>
          </div>

          <section className="premium-gallery">
            <div className="gallery-head">
              <div>
                <span className="eyebrow"><Image size={16} /> Project gallery</span>
                <h2>Spaces, finishes and lifestyle moments</h2>
              </div>
              <p>{images.length} curated image{images.length === 1 ? '' : 's'}</p>
            </div>
            {images.length > 0 && (
              <>
                <div className="gallery-slider">
                  <button className="slider-arrow dark" onClick={showPreviousGallery} type="button" aria-label="Previous gallery image"><ChevronLeft /></button>
                  <button className="gallery-slide" onClick={() => setActiveImage(images[galleryIndex])} type="button">
                    <img src={assetUrl(images[galleryIndex])} alt={`${property.title} gallery ${galleryIndex + 1}`} loading="lazy" decoding="async" />
                    <span>{galleryIndex + 1} / {images.length}</span>
                  </button>
                  <button className="slider-arrow dark" onClick={showNextGallery} type="button" aria-label="Next gallery image"><ChevronRight /></button>
                </div>
              </>
            )}
          </section>
        </div>
        <aside className="sticky-card project-enquiry-card">
          <span className="eyebrow">Priority assistance</span>
          <h3>Request price sheet</h3>
          <p>Get latest availability, floor plans, payment plan and private site visit slots.</p>
          <div className="enquiry-card-list">
            <span><CheckCircle2 size={16} /> Updated price sheet</span>
            <span><CheckCircle2 size={16} /> Floor plan options</span>
            <span><CheckCircle2 size={16} /> Site visit scheduling</span>
          </div>
          <button className="btn btn-primary" onClick={() => openEnquiry(property)}>Request Callback</button>
        </aside>
      </section>
      {activeImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true">
          <button className="icon-btn modal-close" onClick={() => setActiveImage(null)} aria-label="Close gallery"><X /></button>
          <img src={assetUrl(activeImage)} alt={property.title} />
        </div>
      )}
    </>
  );
}

export default ProjectDetail;
