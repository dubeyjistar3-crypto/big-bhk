const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
const EXTERNAL_ASSET_PATTERN = /^(https?:|data:|blob:)/;

export function formatPrice(value) {
  const amount = Number(value);

  if (!amount) return 'Price on request';
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(amount % 10000000 ? 1 : 0)} Cr`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(amount % 100000 ? 1 : 0)} Lac`;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function assetUrl(path) {
  if (!path) return '';
  if (EXTERNAL_ASSET_PATTERN.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}
