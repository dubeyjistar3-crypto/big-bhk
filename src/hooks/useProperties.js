import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { getLocalProperties } from '../services/localStore';

function buildPropertyParams(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  return params.toString();
}

export function useProperties(filters = {}) {
  const [properties, setProperties] = useState(() => {
    const localProperties = getLocalProperties(filters);
    return Array.isArray(localProperties) ? localProperties : [];
  });
  const [loading, setLoading] = useState(false);
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const activeFilters = JSON.parse(filterKey);
    const localProperties = getLocalProperties(activeFilters);
    setProperties(Array.isArray(localProperties) ? localProperties : []);
    setLoading(false);

    api.get(`/properties?${buildPropertyParams(activeFilters)}`)
      .then((res) => {
        if (Array.isArray(res.data?.properties)) {
          setProperties(res.data.properties);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const syncLocal = () => {
      const nextProperties = getLocalProperties(activeFilters);
      setProperties(Array.isArray(nextProperties) ? nextProperties : []);
    };
    window.addEventListener('star-estates-data-change', syncLocal);
    return () => window.removeEventListener('star-estates-data-change', syncLocal);
  }, [filterKey]);

  return { properties, loading };
}
