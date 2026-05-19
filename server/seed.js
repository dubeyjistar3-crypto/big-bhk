const Admin = require('./models/Admin');
const CityContent = require('./models/CityContent');
const HeaderSetting = require('./models/HeaderSetting');
const PageContent = require('./models/PageContent');
const Property = require('./models/Property');
const SiteStat = require('./models/SiteStat');
const slugify = require('./utils/slugify');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@bigbhk.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const exists = await Admin.findOne({ email });
  if (!exists) {
    await Admin.create({
      name: process.env.ADMIN_NAME || 'BIG BHK Admin',
      email,
      password,
    });
    console.log(`Seeded admin: ${email}`);
    return;
  }

    exists.name = process.env.ADMIN_NAME || exists.name;
  exists.password = password;
  await exists.save();
}

async function seedProperties() {
  const samples = [
    {
      title: 'The Imperial Residences',
      location: 'Golf Course Road, Gurugram',
      city: 'Gurugram',
      type: 'Apartment',
      status: 'Ready To Move',
      price: 32500000,
      bedrooms: 4,
      bathrooms: 5,
      area: 3150,
      heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Private lift residences with wrap-around balconies and five-star concierge.',
      description: 'A limited collection of luxury homes designed for privacy, quiet views, and effortless hosting.',
      amenities: ['Private deck', 'Club lounge', 'Infinity pool', 'Concierge'],
      featured: true,
    },
    {
      title: 'Aravalli Crest Villas',
      location: 'Sector 59, Gurugram',
      city: 'Gurugram',
      type: 'Villa',
      status: 'New Launch',
      price: 78000000,
      bedrooms: 5,
      bathrooms: 6,
      area: 6900,
      heroImage: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Low-density villa estate with landscaped courts, terraces, and private gardens.',
      description: 'A serene gated address for families who want villa living with institutional-grade property management.',
      amenities: ['Private garden', 'Sky terrace', 'Clubhouse', 'Home automation'],
      featured: true,
    },
    {
      title: 'One Skyline Avenue',
      location: 'Noida Expressway',
      city: 'Noida',
      type: 'Penthouse',
      status: 'Under Construction',
      price: 51500000,
      bedrooms: 4,
      bathrooms: 4,
      area: 4400,
      heroImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'High-floor residences with skyline views, business lounge, and wellness floors.',
      description: 'Designed for founders, CXOs, and globally mobile families seeking a polished NCR base.',
      amenities: ['Business lounge', 'Spa', 'Pool deck', 'Valet', 'Guest suites'],
      featured: false,
    },
    {
      title: 'Lutyens Park Residences',
      location: 'Chanakyapuri, Delhi',
      city: 'Delhi',
      type: 'Apartment',
      status: 'Ready To Move',
      price: 68500000,
      bedrooms: 4,
      bathrooms: 5,
      area: 3600,
      heroImage: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Boutique residences near diplomatic greens with private lobby access.',
      description: 'A refined Delhi address planned for families who want central access, privacy, and low-density living.',
      amenities: ['Private lobby', 'Club lounge', 'Concierge', 'Smart security'],
      featured: false,
    },
    {
      title: 'Hindon Heights',
      location: 'Raj Nagar Extension, Ghaziabad',
      city: 'Ghaziabad',
      type: 'Apartment',
      status: 'Under Construction',
      price: 14500000,
      bedrooms: 3,
      bathrooms: 3,
      area: 1850,
      heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Family-sized homes with clubhouse, green courts, and expressway access.',
      description: 'A value-focused premium community for buyers seeking larger layouts and strong connectivity.',
      amenities: ['Clubhouse', 'Pool deck', 'Kids zone', 'Jogging loop'],
      featured: false,
    },
    {
      title: 'Marine Crest Towers',
      location: 'Worli Sea Face, Mumbai',
      city: 'Mumbai',
      type: 'Penthouse',
      status: 'Ready To Move',
      price: 185000000,
      bedrooms: 5,
      bathrooms: 6,
      area: 5200,
      heroImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Sea-facing residences with sky deck, private dining, and valet arrival.',
      description: 'A landmark Mumbai tower for buyers who want skyline drama, privacy, and hotel-grade service.',
      amenities: ['Sea deck', 'Infinity pool', 'Private dining', 'Valet'],
      featured: true,
    },
    {
      title: 'Koregaon Park Lofts',
      location: 'Koregaon Park, Pune',
      city: 'Pune',
      type: 'Apartment',
      status: 'New Launch',
      price: 28500000,
      bedrooms: 3,
      bathrooms: 4,
      area: 2450,
      heroImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Urban loft-style apartments with co-working lounge and landscaped terraces.',
      description: 'Designed for modern Pune buyers who want walkable lifestyle, refined interiors, and flexible work spaces.',
      amenities: ['Co-working lounge', 'Sky terrace', 'Fitness studio', 'Cafe deck'],
      featured: false,
    },
    {
      title: 'Indiranagar Skyhomes',
      location: 'Indiranagar, Banglore',
      city: 'Banglore',
      type: 'Apartment',
      status: 'Under Construction',
      price: 42500000,
      bedrooms: 4,
      bathrooms: 4,
      area: 3100,
      heroImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'High-rise homes with tech-enabled amenities and city-view decks.',
      description: 'A premium Banglore address shaped for founders, executives, and families close to the city core.',
      amenities: ['Business lounge', 'Pool deck', 'Smart security', 'EV charging'],
      featured: false,
    },
    {
      title: 'ECR Bay Residences',
      location: 'East Coast Road, Chennai',
      city: 'Chennai',
      type: 'Villa',
      status: 'Ready To Move',
      price: 56500000,
      bedrooms: 4,
      bathrooms: 5,
      area: 4800,
      heroImage: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80',
      images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80'],
      shortDescription: 'Coastal villas with private gardens, decks, and resort-style clubhouse.',
      description: 'A relaxed Chennai villa community for families who want open space, privacy, and weekend-ready living.',
      amenities: ['Private garden', 'Clubhouse', 'Pool deck', 'Kids zone'],
      featured: false,
    },
  ];

  await Promise.all(samples.map((item) => {
    const slug = slugify(item.title);
    return Property.updateOne(
      { slug },
      { $setOnInsert: { ...item, slug } },
      { upsert: true },
    );
  }));
  console.log('Seeded sample properties');
}

async function seedPages() {
  const defaults = [
    {
      slug: 'about',
      title: 'About Us',
      seoTitle: 'About Us',
      seoDescription: 'About BIG BHK, premium real estate consultants for NCR luxury homes.',
      eyebrow: 'About us',
      heroTitle: 'Luxury property decisions, guided with precision.',
      heroText: 'BIG BHK curates premium homes, villa estates and investment-grade addresses with clear market intelligence and concierge-level support.',
      sectionEyebrow: 'Our approach',
      sectionTitle: 'We turn a crowded market into a refined property shortlist.',
      sectionText: 'Our team studies location strength, construction quality, developer track record, payment plans, rental demand and resale liquidity before recommending a property. The result is a calmer, sharper and more confident buying journey.',
      features: [
        { icon: 'Gem', title: 'Luxury inventory', text: 'Premium apartments, villas, penthouses and branded residences selected for serious buyers.' },
        { icon: 'BriefcaseBusiness', title: 'Investment clarity', text: 'Pricing, appreciation potential and rental yield reviewed before every recommendation.' },
        { icon: 'Users', title: 'Personal shortlist', text: 'Options shaped around budget, lifestyle, commute, family needs and possession timeline.' },
        { icon: 'Award', title: 'End-to-end support', text: 'Site visits, negotiation, paperwork, payment schedules and handover coordination.' },
      ],
    },
    {
      slug: 'contact',
      title: 'Contact',
      seoTitle: 'Contact',
      seoDescription: 'Contact BIG BHK for luxury real estate enquiries and site visits.',
      eyebrow: 'Contact us',
      heroTitle: "Let's build your property shortlist.",
      heroText: 'Tell us what you are looking for and a senior advisor will reach out.',
      contactName: 'BIG BHK Advisory',
      phone: '+91 98765 43210',
      email: 'sales@bigbhk.com',
      address: 'Golf Course Road, Gurugram',
    },
  ];

  await Promise.all(defaults.map((page) => PageContent.updateOne(
    { slug: page.slug },
    { $setOnInsert: page },
    { upsert: true },
  )));
}

async function seedCities() {
  const defaults = [
    { city: 'Gurugram', image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=85', tagline: 'Premium golf-course addresses, villa estates, and high-rise residences.' },
    { city: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1800&q=85', tagline: 'Central addresses with low-density luxury and strong lifestyle access.' },
    { city: 'Noida', image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85', tagline: 'Expressway-led growth corridors with modern residential communities.' },
    { city: 'Ghaziabad', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85', tagline: 'Larger homes, strong connectivity, and family-focused communities.' },
    { city: 'Mumbai', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=85', tagline: 'Sea-facing towers and skyline homes in India’s most dynamic market.' },
    { city: 'Pune', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=85', tagline: 'Urban lifestyle homes close to business districts and social hubs.' },
    { city: 'Banglore', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1800&q=85', tagline: 'Tech-city residences with smart amenities and city-view decks.' },
    { city: 'Chennai', image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1800&q=85', tagline: 'Coastal villas and refined communities for relaxed premium living.' },
  ];

  await Promise.all(defaults.map((item) => CityContent.updateOne(
    { city: item.city },
    { $setOnInsert: item },
    { upsert: true },
  )));
}

async function seedStats() {
  const defaults = [
    { key: 'families', value: 450, suffix: '+', label: 'families advised' },
    { key: 'projects', value: 72, suffix: '', label: 'premium projects' },
    { key: 'expertise', value: 18, suffix: ' yrs', label: 'combined expertise' },
    { key: 'planning', value: 24, suffix: ' hr', label: 'site visit planning' },
  ];

  await Promise.all(defaults.map((stat, index) => SiteStat.updateOne(
    { key: stat.key },
    { $setOnInsert: { ...stat, order: index } },
    { upsert: true },
  )));
}

async function seedHeader() {
  await HeaderSetting.updateOne(
    { key: 'main' },
    {
      $setOnInsert: {
        key: 'main',
        brandName: 'BIG BHK',
        logoUrl: '',
        enquiryLabel: 'Enquire Now',
        exploreLabel: 'Explore',
        exploreLink: '/properties',
        links: [
          { label: 'Home', to: '/' },
          { label: 'Properties', to: '/properties' },
          { label: 'About', to: '/about' },
          { label: 'Contact', to: '/contact' },
        ],
      },
    },
    { upsert: true },
  );
}

module.exports = async function seed() {
  await seedAdmin();
  await seedProperties();
  await seedPages();
  await seedCities();
  await seedStats();
  await seedHeader();
};
