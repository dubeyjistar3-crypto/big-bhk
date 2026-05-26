export const amenityOptions = [
  { label: 'Club House', icon: 'Building2' },
  { label: 'Coffee Lounge & Restaurants', icon: 'Coffee' },
  { label: 'Cafeteria/Food Court', icon: 'Utensils' },
  { label: 'Jogging and Strolling Track', icon: 'Footprints' },
  { label: 'Outdoor Tennis Courts', icon: 'Trophy' },
  { label: 'Cycling & Jogging Track', icon: 'Bike' },
  { label: 'Private Terrace/Garden', icon: 'TreePalm' },
  { label: 'Power Back Up', icon: 'Zap' },
  { label: 'Swimming Pool', icon: 'WavesLadder' },
  { label: 'Lift', icon: 'ArrowUpDown' },
  { label: 'Security', icon: 'ShieldCheck' },
  { label: 'Park', icon: 'Trees' },
  { label: 'Reserved Parking', icon: 'ParkingCircle' },
  { label: 'Service/Goods Lift', icon: 'PackageOpen' },
  { label: 'Visitor Parking', icon: 'Car' },
  { label: 'Intercom Facility', icon: 'PhoneCall' },
  { label: 'Maintenance Staff', icon: 'Wrench' },
  { label: 'Bank & ATM', icon: 'Landmark' },
  { label: 'Banquet Hall', icon: 'PartyPopper' },
  { label: 'Gymnasium', icon: 'Dumbbell' },
  { label: 'Indoor Games Room', icon: 'Gamepad2' },
  { label: 'Kids Club', icon: 'Baby' },
  { label: 'AEROBICS ROOM', icon: 'Activity' },
  { label: 'DTH Television Facility', icon: 'Satellite' },
  { label: 'Flower Gardens', icon: 'Flower2' },
  { label: 'Laundry Service', icon: 'WashingMachine' },
  { label: 'Library And Business Centre', icon: 'LibraryBig' },
  { label: 'Piped Gas', icon: 'Flame' },
  { label: 'Rain Water Harvesting', icon: 'CloudRain' },
  { label: 'Waste Disposal', icon: 'Trash2' },
  { label: 'Earth quake resistant', icon: 'Building' },
  { label: 'CCTV Camera', icon: 'Camera' },
  { label: 'Concierge Services', icon: 'ConciergeBell' },
  { label: 'Activity Deck4', icon: 'Umbrella' },
  { label: 'Event Space & Amphitheatre', icon: 'UsersRound' },
  { label: 'Fire Fighting Equipment', icon: 'FireExtinguisher' },
];

export function normalizeAmenity(amenity) {
  if (typeof amenity === 'string') {
    const option = amenityOptions.find((item) => item.label.toLowerCase() === amenity.toLowerCase());
    return { label: amenity, icon: option?.icon || 'CheckCircle2' };
  }

  return {
    label: amenity?.label || amenity?.name || '',
    icon: amenity?.icon || 'CheckCircle2',
  };
}

export function normalizeAmenities(amenities = []) {
  if (!amenities) return [];

  if (typeof amenities === 'string') {
    try {
      const parsed = JSON.parse(amenities);
      if (Array.isArray(parsed)) return parsed.map(normalizeAmenity).filter((amenity) => amenity.label);
    } catch {
      return amenities
        .split(',')
        .map((item) => normalizeAmenity(item.trim()))
        .filter((amenity) => amenity.label);
    }
  }

  if (!Array.isArray(amenities)) return [];

  return amenities.map(normalizeAmenity).filter((amenity) => amenity.label);
}
