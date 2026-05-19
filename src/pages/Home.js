import { Award, Building2, ChevronLeft, ChevronRight, MapPin, Search, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import Seo from '../components/Seo';
import { cityOptions } from '../data/cities';
import { defaultStats } from '../data/defaultStats';
import { useProperties } from '../hooks/useProperties';
import { getLocalHomeStats } from '../services/localStore';
import { assetUrl, formatPrice } from '../utils/format';

const CAROUSEL_SCROLL_WIDTH = 390;
const searchTabs = ['Buy', 'Rent', 'Commercial', 'New Projects'];
const propertyTypeOptions = [
  { label: 'Apartment / Flat', value: 'Apartment' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Penthouse', value: 'Penthouse' },
  { label: 'Plot', value: 'Plot' },
];
const budgetOptions = [
  { label: 'Any Budget', minPrice: '', maxPrice: '' },
  { label: 'Under 1 Cr', minPrice: '', maxPrice: '10000000' },
  { label: '1 Cr - 3 Cr', minPrice: '10000000', maxPrice: '30000000' },
  { label: '3 Cr - 5 Cr', minPrice: '30000000', maxPrice: '50000000' },
  { label: '5 Cr+', minPrice: '50000000', maxPrice: '' },
];

function AnimatedStat({ value, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value || 0);
    let frameId;
    let startTime;

    const tick = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1200, 1);
      setCount(Math.round(target * progress));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <strong>{count}{suffix}</strong>;
}

function Home() {
  const { openEnquiry } = useOutletContext();
  const { properties } = useProperties();
  const propertyList = Array.isArray(properties) ? properties : [];
  const featured = [...propertyList].sort((first, second) => Number(second.featured) - Number(first.featured));
  const [homeStats, setHomeStats] = useState(defaultStats);
  const [city, setCity] = useState('Noida');
  const [searchIntent, setSearchIntent] = useState('Buy');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [budget, setBudget] = useState('Any Budget');
  const [hotCity, setHotCity] = useState('');
  const hotTrackRef = useRef(null);
  const featuredTrackRef = useRef(null);
  const navigate = useNavigate();
  const hotProjects = propertyList.filter((property) => !hotCity || property.city === hotCity);
  const visibleStats = Array.isArray(homeStats) ? homeStats : defaultStats;

  useEffect(() => {
    api.get('/site-stats')
      .then((res) => setHomeStats(res.data.stats.length ? res.data.stats : defaultStats))
      .catch(() => setHomeStats(getLocalHomeStats()));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (propertyType) params.set('type', propertyType);
    if (searchIntent === 'New Projects') params.set('status', 'New Launch');
    if (searchIntent && searchIntent !== 'Buy' && searchIntent !== 'New Projects') params.set('search', searchIntent);
    const selectedBudget = budgetOptions.find((option) => option.label === budget) || budgetOptions[0];
    if (selectedBudget.minPrice) params.set('minPrice', selectedBudget.minPrice);
    if (selectedBudget.maxPrice) params.set('maxPrice', selectedBudget.maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  const scrollTrack = (trackRef, direction) => {
    trackRef.current?.scrollBy({
      left: direction * CAROUSEL_SCROLL_WIDTH,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Seo title="Luxury Real Estate Advisory" description="BIG BHK offers premium homes, villas and investment-grade properties across NCR." />

      <section className="hero">
        <div className="hero-content">
         
          <h1>Real Estate Made Real Easy</h1>
          <p>We've got you covered! From finding the perfect property to <span>Luxury Homes</span></p>

          <div className="hero-property-search">
            <div className="hero-search-tabs">
              {searchTabs.map((tab) => (
                <button
                  className={searchIntent === tab ? 'active' : ''}
                  key={tab}
                  onClick={() => setSearchIntent(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="hero-search-fields">
              <label>
                <span>City</span>
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  {cityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label>
                <span>Property Type</span>
                <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                  {propertyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span>Budget</span>
                <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                  {budgetOptions.map((option) => <option key={option.label}>{option.label}</option>)}
                </select>
              </label>
              <button className="hero-search-btn" onClick={handleSearch} type="button"><Search size={26} /> Search</button>
            </div>
          </div>

          <div className="hero-quick-links">
            <Link to="/properties">Luxury Apartments</Link>
            <Link to="/properties">Villas</Link>
            <button onClick={() => openEnquiry()}>Book Consultation</button>
          </div>
        </div>
      </section>

      <section className="stats-band">
        {visibleStats.map((stat) => (
          <div key={stat.key}>
            <AnimatedStat value={stat.value} suffix={stat.suffix} />
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="hot-projects-section">
        <div className="hot-projects-head">
          <h2>Hot Selling Real Estate Projects</h2>
          <p>These hot-selling projects{hotCity ? ` in ${hotCity}` : ''} are in high demand. Known for great locations and modern amenities, these properties are handpicked by our real estate experts.</p>
        </div>
        <div className="hot-city-tabs">
          <button className={!hotCity ? 'active' : ''} onClick={() => setHotCity('')} type="button">All</button>
          {cityOptions.map((option) => (
            <button className={hotCity === option ? 'active' : ''} key={option} onClick={() => setHotCity(option)} type="button">
              {option}
            </button>
          ))}
        </div>
        <div className="hot-carousel-shell">
          <button className="hot-carousel-arrow left" onClick={() => scrollTrack(hotTrackRef, -1)} type="button" aria-label="Previous hot projects"><ChevronLeft /></button>
          <div className="hot-projects-track" ref={hotTrackRef}>
            {hotProjects.map((property, index) => (
              <Link className="hot-project-card" key={property._id} to={`/properties/${property.slug}`}>
                <span className="hot-rank">{index + 1}</span>
                <img
                  src={assetUrl(property.heroImage || property.images?.[0])}
                  alt={property.title}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div>
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                  <strong>{formatPrice(property.price)}</strong>
                </div>
              </Link>
            ))}
          </div>
          <button className="hot-carousel-arrow right" onClick={() => scrollTrack(hotTrackRef, 1)} type="button" aria-label="Next hot projects"><ChevronRight /></button>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Featured collections</span>
            <h2>Handpicked homes for serious buyers</h2>
          </div>
          <Link to="/properties">See all listings</Link>
        </div>
        <div className="featured-carousel-shell">
          <button className="featured-carousel-arrow left" onClick={() => scrollTrack(featuredTrackRef, -1)} type="button" aria-label="Previous featured projects"><ChevronLeft /></button>
          <div className="featured-carousel-track" ref={featuredTrackRef}>
            {featured.map((property) => (
              <div className="featured-carousel-item" key={property._id}>
                <PropertyCard property={property} onEnquire={openEnquiry} />
              </div>
            ))}
          </div>
          <button className="featured-carousel-arrow right" onClick={() => scrollTrack(featuredTrackRef, 1)} type="button" aria-label="Next featured projects"><ChevronRight /></button>
        </div>
      </section>

      <section className="advisory-band">
        <div>
          <span className="eyebrow">Why BIG BHK</span>
          <h2>Sharper discovery, cleaner negotiations, better after-sales.</h2>
        </div>
        <div className="feature-grid">
          <div>
            <ShieldCheck />
            <h3>Verified inventory</h3>
            <p>Only active projects with clear specifications and updated availability.</p>
          </div>
          <div>
            <MapPin />
            <h3>Micro-market insight</h3>
            <p>Comparable pricing, rental yield, connectivity and possession timelines.</p>
          </div>
          <div>
            <Award />
            <h3>Closing support</h3>
            <p>Site visits, paperwork, payment schedules and handover coordination.</p>
          </div>
          <div>
            <Building2 />
            <h3>Developer network</h3>
            <p>Direct channel access to premium developers and launch-stage opportunities.</p>
          </div>
        </div>
      </section>

      <section className="section compact-cta">
        <div>
          <h2>Have a Property to Sell or Rent?</h2>
          <p>List your property for free and reach lakhs of buyers across India</p>
        </div>
        <div className="compact-cta-actions">
          <Link className="btn btn-primary" to="/admin/properties">Post Property Free</Link>
          <button className="btn btn-outline" onClick={() => openEnquiry()} type="button">Contact Agent</button>
        </div>
      </section>
    </>
  );
}

export default Home;
