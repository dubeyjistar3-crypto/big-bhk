import { Bath, BedDouble, MapPin, MoveRight, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assetUrl, formatPrice } from '../utils/format';

function PropertyCard({ property, onEnquire }) {
  return (
    <article className="property-card">
      <Link to={`/properties/${property.slug}`} className="property-media">
        <img
          src={assetUrl(property.heroImage || property.images?.[0])}
          alt={property.title}
          loading="lazy"
          decoding="async"
        />
        <span>{property.status}</span>
      </Link>
      <div className="property-body">
        <p className="location"><MapPin size={16} /> {property.location}</p>
        <h3>{property.title}</h3>
        <div className="property-meta">
          <span><BedDouble size={17} /> {property.bedrooms} Beds</span>
          <span><Bath size={17} /> {property.bathrooms} Baths</span>
          <span><Ruler size={17} /> {property.area} sq.ft.</span>
        </div>
        <div className="property-actions">
          <strong>{formatPrice(property.price)}</strong>
          <button className="link-btn" onClick={() => onEnquire(property)}>Enquire <MoveRight size={16} /></button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
