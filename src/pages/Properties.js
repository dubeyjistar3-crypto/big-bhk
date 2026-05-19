import { Building2, Filter, MapPin, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import Seo from '../components/Seo';
import { cityOptions } from '../data/cities';
import { defaultCityContent } from '../data/cityContent';
import { useProperties } from '../hooks/useProperties';
import { getLocalCityContent } from '../services/localStore';

function Properties() {
  const { openEnquiry } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [cityContent, setCityContent] = useState(() => getLocalCityContent());
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  useEffect(() => {
    api.get('/cities')
      .then((res) => {
        const next = { ...defaultCityContent };
        res.data.cities.forEach((item) => {
          next[item.city] = { image: item.image, tagline: item.tagline || defaultCityContent[item.city]?.tagline || '' };
        });
        setCityContent(next);
      })
      .catch(() => setCityContent(getLocalCityContent()));
  }, []);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      search: searchParams.get('search') || '',
      city: searchParams.get('city') || '',
      type: searchParams.get('type') || '',
      status: searchParams.get('status') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    }));
  }, [searchParams]);
  const apiFilters = useMemo(() => filters, [filters]);
  const { properties, loading } = useProperties(apiFilters);
  const propertyList = Array.isArray(properties) ? properties : [];
  const selectedCity = filters.city;
  const selectedCityContent = selectedCity ? cityContent[selectedCity] || defaultCityContent[selectedCity] : null;

  return (
    <>
      <Seo title="Property Listings" description="Browse luxury apartments, villas and penthouses listed by BIG BHK." />
      {selectedCity && selectedCityContent ? (
        <section
          className="city-listing-hero"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(9,8,7,0.88), rgba(9,8,7,0.24) 58%, rgba(9,8,7,0.72)), url("${selectedCityContent.image}")` }}
        >
          <span className="eyebrow"><MapPin size={15} /> {selectedCity} projects</span>
          <h1>Premium properties in {selectedCity}</h1>
          <p>{selectedCityContent.tagline}</p>
          <div className="city-hero-stats">
            <span><Building2 /> {loading ? '...' : propertyList.length} projects</span>
            <span><Sparkles /> Curated luxury listings</span>
          </div>
        </section>
      ) : (
        <section className="page-hero listings-hero">
          <span className="eyebrow">Luxury listings</span>
          <h1>Verified premium properties across India.</h1>
          <p>Filter by location, property type and construction stage to find your next address.</p>
        </section>
      )}
      <section className="listing-shell">
        <aside className="filters">
          <h2><Filter /> Filters</h2>
          <input placeholder="Search project, city or location" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
            <option value="">All cities</option>
            {cityOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All types</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Penthouse</option>
            <option>Plot</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All status</option>
            <option>New Launch</option>
            <option>Under Construction</option>
            <option>Ready To Move</option>
          </select>
          <select
            value={`${filters.minPrice || ''}-${filters.maxPrice || ''}`}
            onChange={(e) => {
              const [minPrice, maxPrice] = e.target.value.split('-');
              setFilters({ ...filters, minPrice, maxPrice });
            }}
          >
            <option value="-">Any Budget</option>
            <option value="-10000000">Under 1 Cr</option>
            <option value="10000000-30000000">1 Cr - 3 Cr</option>
            <option value="30000000-50000000">3 Cr - 5 Cr</option>
            <option value="50000000-">5 Cr+</option>
          </select>
          <button className="btn btn-ghost" onClick={() => setFilters({ search: '', city: '', type: '', status: '', minPrice: '', maxPrice: '' })}>Clear</button>
        </aside>
        <div className="listing-results">
          <div className="results-top city-results-top">
            <div>
              <span className="eyebrow">{selectedCity ? `${selectedCity} collection` : 'Curated collection'}</span>
              <h2>{loading ? 'Loading properties' : `${propertyList.length} premium properties`}</h2>
            </div>
          </div>
          <div className="property-grid">
            {propertyList.map((property) => (
              <PropertyCard key={property._id} property={property} onEnquire={openEnquiry} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Properties;
