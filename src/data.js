// Sample data for Concept Plus Real Estate prototype
// Realistic Dubai listings, communities, agents, off-plan projects.
// All imagery is locally hosted (AI-rendered via Higgsfield Nano Banana Pro)
// and consistent across 10 property sets + 10 portrait sets.

window.CONCEPTPLUS_DATA = (function () {
  // Local asset helpers — every image lives under /assets/.
  const P = (name) => `assets/properties/${name}.webp`;
  // Agent portraits — dark cinematic backdrop, Rembrandt-lit, same poses as the
  // original light set. Light set still exists at assets/agents/ if ever needed.
  const A = (name) => `assets/agents-dark/${name}.webp`;

  // 10 property sets — each set is one property with 4 shots that gallery together.
  const SET = {
    'frond-m-villa':   ['01-frond-m-villa-exterior',    '01-frond-m-villa-living',    '01-frond-m-villa-pool',     '01-frond-m-villa-bedroom'],
    'downtown-pent':   ['02-downtown-penthouse-living', '02-downtown-penthouse-terrace','02-downtown-penthouse-kitchen','02-downtown-penthouse-bedroom'],
    'bluewaters-apt':  ['03-bluewaters-apt-living',     '03-bluewaters-apt-balcony',  '03-bluewaters-apt-kitchen', '03-bluewaters-apt-bedroom'],
    'emirates-mansion':['04-emirates-hills-exterior',   '04-emirates-hills-pool',     '04-emirates-hills-living',  '04-emirates-hills-entrance'],
    'marina-duplex':   ['05-marina-duplex-living',      '05-marina-duplex-terrace',   '05-marina-duplex-kitchen',  '05-marina-duplex-bedroom'],
    'business-bay':    ['06-business-bay-apt-living',   '06-business-bay-apt-bedroom','06-business-bay-apt-kitchen','06-business-bay-apt-bathroom'],
    'bulgari-villa':   ['07-bulgari-villa-exterior',    '07-bulgari-villa-pool',      '07-bulgari-villa-living',   '07-bulgari-villa-bedroom'],
    'jvc-townhouse':   ['08-jvc-townhouse-exterior',    '08-jvc-townhouse-garden',    '08-jvc-townhouse-living',   '08-jvc-townhouse-kitchen'],
    'offplan-tower':   ['09-offplan-tower-exterior',    '09-offplan-tower-skybridge', '09-offplan-tower-show-apartment','09-offplan-tower-lobby'],
    'lakeside-mansion':['10-lakeside-mansion-exterior', '10-lakeside-mansion-pool',   '10-lakeside-mansion-living','10-lakeside-mansion-bedroom'],
  };

  const communities = [
    { name: 'Palm Jumeirah',     count: 184, image: P('01-frond-m-villa-exterior') },
    { name: 'Downtown Dubai',    count: 312, image: P('02-downtown-penthouse-terrace') },
    { name: 'Dubai Marina',      count: 268, image: P('05-marina-duplex-terrace') },
    { name: 'Emirates Hills',    count:  47, image: P('04-emirates-hills-exterior') },
    { name: 'Business Bay',      count: 221, image: P('06-business-bay-apt-living') },
    { name: 'Jumeirah Bay',      count:  29, image: P('07-bulgari-villa-exterior') },
    { name: 'MBR City',          count:  93, image: P('09-offplan-tower-exterior') },
    { name: 'Jumeirah Village',  count: 156, image: P('08-jvc-townhouse-exterior') },
  ];

  const agents = [
    { name: 'Layla Al-Mansouri',  role: 'Senior Director, Palm & Jumeirah Bay', langs: ['EN','AR','FR'], rera: '52341', img: A('01-layla-al-mansouri'), phone: '+971 50 411 8820' },
    { name: 'Omar Khalifa',       role: 'Head of Off-Plan, MBR City',           langs: ['EN','AR'],       rera: '64812', img: A('02-omar-khalifa'),       phone: '+971 50 882 4471' },
    { name: 'Hana Reyes',         role: 'Investment Advisor, Marina & JBR',     langs: ['EN','ES','AR'],  rera: '70219', img: A('03-hana-reyes'),         phone: '+971 50 233 0099' },
    { name: 'Yusuf Demir',        role: 'Director, Emirates Hills',             langs: ['EN','TR','AR'],  rera: '48107', img: A('04-yusuf-demir'),        phone: '+971 50 117 6450' },
    { name: 'Anya Volkova',       role: 'Senior Broker, Downtown',              langs: ['EN','RU','AR'],  rera: '55893', img: A('05-anya-volkova'),       phone: '+971 50 644 9921' },
    { name: 'James Whitfield',    role: 'Senior Broker, Business Bay',          langs: ['EN','FR'],       rera: '60004', img: A('06-james-whitfield'),    phone: '+971 50 928 1004' },
    { name: 'Sara Patel',         role: 'Senior Consultant, Bluewaters',        langs: ['EN','HI','AR'],  rera: '63251', img: A('07-sara-patel'),         phone: '+971 50 218 7733' },
    { name: 'David Chen',         role: 'Mortgage Advisor',                     langs: ['EN','ZH'],       rera: '58112', img: A('08-david-chen'),         phone: '+971 50 904 6612' },
    { name: 'Aisha Rahman',       role: 'Head of Property Management',          langs: ['EN','AR','UR'],  rera: '51908', img: A('09-aisha-rahman'),       phone: '+971 50 776 3041' },
    { name: 'Marcus Bennett',     role: 'Director of Sales',                    langs: ['EN','FR'],       rera: '47025', img: A('10-marcus-bennett'),     phone: '+971 50 552 1188' },
  ];

  // Listings — each listing\'s images array points to the 4 shots from its assigned set.
  // Real Dubai lat/lng for the Leaflet map.
  const listings = [
    { id: 'L-2401', title: 'Garden-fronted villa, Frond M',  community: 'Palm Jumeirah',  subCommunity: 'Signature Villas',    price: 42500000, type: 'Villa',     furnishing: 'Furnished',       beds: 6, baths: 7,  sqft: 8200, photoCount: 32, dld: true,  images: SET['frond-m-villa'].map(P),    agent: 0, sale: true, lat: 25.1124, lng: 55.1390 },
    { id: 'L-2402', title: 'Burj-view penthouse',            community: 'Downtown Dubai', subCommunity: 'Opera District',       price: 18900000, type: 'Penthouse', furnishing: 'Unfurnished',     beds: 4, baths: 5,  sqft: 4760, photoCount: 24, dld: true,  images: SET['downtown-pent'].map(P),    agent: 4, sale: true, lat: 25.1972, lng: 55.2744 },
    { id: 'L-2403', title: 'Sea-line apartment, Bluewaters', community: 'Dubai Marina',   subCommunity: 'Bluewaters Residences',price: 6850000,  type: 'Apartment', furnishing: 'Semi-furnished',  beds: 3, baths: 4,  sqft: 2410, photoCount: 18, dld: true,  images: SET['bluewaters-apt'].map(P),   agent: 2, sale: true, lat: 25.0805, lng: 55.1403 },
    { id: 'L-2404', title: 'Lakeside mansion',               community: 'Emirates Hills', subCommunity: 'Sector E',             price: 78000000, type: 'Villa',     furnishing: 'Furnished',       beds: 8, baths: 10, sqft: 16800,photoCount: 41, dld: true,  images: SET['lakeside-mansion'].map(P), agent: 3, sale: true, lat: 25.0648, lng: 55.1797 },
    { id: 'L-2405', title: 'Marina-view duplex',             community: 'Dubai Marina',   subCommunity: 'Cayan Tower',          price: 9450000,  type: 'Penthouse', furnishing: 'Furnished',       beds: 4, baths: 5,  sqft: 3680, photoCount: 22, dld: true,  images: SET['marina-duplex'].map(P),    agent: 2, sale: true, lat: 25.0860, lng: 55.1480 },
    { id: 'L-2406', title: 'Skyline corner, Executive Bay',  community: 'Business Bay',   subCommunity: 'Executive Towers',     price: 3200000,  type: 'Apartment', furnishing: 'Furnished',       beds: 2, baths: 3,  sqft: 1640, photoCount: 16, dld: false, images: SET['business-bay'].map(P),     agent: 5, sale: true, lat: 25.1872, lng: 55.2655 },
    { id: 'L-2407', title: 'Atrium villa, Jumeirah Bay',     community: 'Jumeirah Bay',   subCommunity: 'Bulgari Resort',       price: 35400000, type: 'Villa',     furnishing: 'Unfurnished',     beds: 5, baths: 6,  sqft: 7100, photoCount: 28, dld: true,  images: SET['bulgari-villa'].map(P),    agent: 0, sale: true, lat: 25.2200, lng: 55.2426 },
    { id: 'L-2408', title: 'Garden townhouse',               community: 'Jumeirah Village', subCommunity: 'District 12',        price: 1980000,  type: 'Townhouse', furnishing: 'Unfurnished',     beds: 3, baths: 4,  sqft: 2240, photoCount: 14, dld: true,  images: SET['jvc-townhouse'].map(P),    agent: 1, sale: true, lat: 25.0577, lng: 55.2135 },
  ];

  // Off-plan projects — each project gets a dedicated full-building hero shot
  // (3:4 vertical, dramatic full-tower-from-base-to-crown) so the card on the
  // homepage reads as a proper architectural luxury showcase.
  const offPlan = [
    { id: 'P-9001', name: 'Cassia Residences', developer: 'Sobha Realty',     from: 1800000, completion: 'Q4 2027', status: 'Launched',          image: P('11-cassia-residences-full'),  units: 320 },
    { id: 'P-9002', name: 'Mirador Tower',     developer: 'Emaar Properties', from: 2950000, completion: 'Q2 2026', status: 'Under Construction',image: P('12-mirador-tower-full'),       units: 480 },
    { id: 'P-9003', name: 'Atelier Bay',       developer: 'DAMAC',            from: 4100000, completion: 'Q1 2025', status: 'Handover Soon',     image: P('13-atelier-bay-full'),         units: 144 },
    { id: 'P-9004', name: 'Saadiyat Pavilion', developer: 'Aldar',            from: 6400000, completion: 'Q3 2028', status: 'Launched',          image: P('14-saadiyat-pavilion-full'),   units:  96 },
  ];

  // Insights map to property shots that loosely match topic.
  const insights = [
    { kind: 'Market Report',   title: 'Q1 2026: Prime Dubai trades up 11.4%',         read: '6 min', image: P('02-downtown-penthouse-terrace') },
    { kind: 'Community Guide', title: 'Living on the Frond: a Palm Jumeirah primer',   read: '9 min', image: P('01-frond-m-villa-exterior') },
    { kind: 'Off-Plan',        title: 'Why Saadiyat is the next Palm',                read: '5 min', image: P('09-offplan-tower-exterior') },
  ];

  const developers = ['Emaar', 'Sobha', 'DAMAC', 'Aldar', 'Meraas', 'Nakheel', 'Omniyat', 'Select Group'];

  return { communities, agents, listings, offPlan, insights, developers };
})();
