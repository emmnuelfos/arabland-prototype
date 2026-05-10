// Sample data for Arabland Real Estate prototype
// Realistic Dubai listings, communities, agents, off-plan projects.

window.ARABLAND_DATA = (function () {
  const U = (id, w = 1600, h = 1067) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

  const communities = [
    { name: 'Palm Jumeirah',     count: 184, image: U('photo-1582407947304-fd86f028f716') },
    { name: 'Downtown Dubai',    count: 312, image: U('photo-1518684079-3c830dcef090') },
    { name: 'Dubai Marina',      count: 268, image: U('photo-1512453979798-5ea266f8880c') },
    { name: 'Emirates Hills',    count:  47, image: U('photo-1613490493576-7fde63acd811') },
    { name: 'Business Bay',      count: 221, image: U('photo-1582268611958-ebfd161ef9cf') },
    { name: 'Jumeirah Bay',      count:  29, image: U('photo-1577415124269-fc1140a69e91') },
    { name: 'MBR City',          count:  93, image: U('photo-1542362567-b07e54358753') },
    { name: 'Jumeirah Village',  count: 156, image: U('photo-1523217582562-09d0def993a6') },
  ];

  const agents = [
    { name: 'Layla Al-Mansouri',  role: 'Senior Director, Palm & Jumeirah Bay', langs: ['EN','AR','FR'], rera: '52341', img: U('photo-1573496359142-b8d87734a5a2', 600, 800), phone: '+971 50 411 8820' },
    { name: 'Omar Khalifa',       role: 'Head of Off-Plan, MBR City',           langs: ['EN','AR'],       rera: '64812', img: U('photo-1507003211169-0a1dd7228f2d', 600, 800), phone: '+971 50 882 4471' },
    { name: 'Hana Reyes',         role: 'Investment Advisor, Marina & JBR',     langs: ['EN','ES','AR'],  rera: '70219', img: U('photo-1580489944761-15a19d654956', 600, 800), phone: '+971 50 233 0099' },
    { name: 'Yusuf Demir',        role: 'Director, Emirates Hills',             langs: ['EN','TR','AR'],  rera: '48107', img: U('photo-1519085360753-af0119f7cbe7', 600, 800), phone: '+971 50 117 6450' },
    { name: 'Anya Volkova',       role: 'Senior Broker, Downtown',              langs: ['EN','RU','AR'],  rera: '55893', img: U('photo-1544005313-94ddf0286df2', 600, 800), phone: '+971 50 644 9921' },
    { name: 'James Whitfield',    role: 'Senior Broker, Business Bay',          langs: ['EN','FR'],       rera: '60004', img: U('photo-1472099645785-5658abf4ff4e', 600, 800), phone: '+971 50 928 1004' },
  ];

  const listings = [
    { id: 'L-2401', title: 'Garden-fronted villa, Frond M', community: 'Palm Jumeirah', subCommunity: 'Signature Villas', price: 42500000, type: 'Villa', furnishing: 'Furnished', beds: 6, baths: 7, sqft: 8200, photoCount: 32, dld: true, images: [U('photo-1613490493576-7fde63acd811'), U('photo-1600585154340-be6161a56a0c'), U('photo-1600566753190-17f0baa2a6c3'), U('photo-1600210491892-03d54c0aaf87')], agent: 0, sale: true, lat: 38, lng: 30 },
    { id: 'L-2402', title: 'Burj-view penthouse',           community: 'Downtown Dubai', subCommunity: 'Opera District', price: 18900000, type: 'Penthouse', furnishing: 'Unfurnished', beds: 4, baths: 5, sqft: 4760, photoCount: 24, dld: true, images: [U('photo-1582268611958-ebfd161ef9cf'), U('photo-1560448204-e02f11c3d0e2'), U('photo-1567496898669-ee935f5f647a')], agent: 4, sale: true, lat: 60, lng: 55 },
    { id: 'L-2403', title: 'Sea-line apartment, Bluewaters',community: 'Dubai Marina',   subCommunity: 'Bluewaters Residences', price: 6850000, type: 'Apartment', furnishing: 'Semi-furnished', beds: 3, baths: 4, sqft: 2410, photoCount: 18, dld: true, images: [U('photo-1502672260266-1c1ef2d93688'), U('photo-1505691938895-1758d7feb511')], agent: 2, sale: true, lat: 55, lng: 35 },
    { id: 'L-2404', title: 'Lakeside mansion',              community: 'Emirates Hills', subCommunity: 'Sector E',       price: 78000000, type: 'Villa', furnishing: 'Furnished', beds: 8, baths: 10, sqft: 16800, photoCount: 41, dld: true, images: [U('photo-1600596542815-ffad4c1539a9'), U('photo-1613977257363-707ba9348227')], agent: 3, sale: true, lat: 35, lng: 70 },
    { id: 'L-2405', title: 'Marina-view duplex',            community: 'Dubai Marina',   subCommunity: 'Cayan Tower',    price: 9450000, type: 'Penthouse', furnishing: 'Furnished', beds: 4, baths: 5, sqft: 3680, photoCount: 22, dld: true, images: [U('photo-1519085360753-af0119f7cbe7')], agent: 2, sale: true, lat: 52, lng: 38 },
    { id: 'L-2406', title: 'Skyline corner, Executive Bay', community: 'Business Bay',   subCommunity: 'Executive Towers', price: 3200000, type: 'Apartment', furnishing: 'Furnished', beds: 2, baths: 3, sqft: 1640, photoCount: 16, dld: false, images: [U('photo-1472099645785-5658abf4ff4e')], agent: 5, sale: true, lat: 65, lng: 50 },
    { id: 'L-2407', title: 'Atrium villa, Jumeirah Bay',    community: 'Jumeirah Bay',   subCommunity: 'Bulgari Resort', price: 35400000, type: 'Villa', furnishing: 'Unfurnished', beds: 5, baths: 6, sqft: 7100, photoCount: 28, dld: true, images: [U('photo-1507003211169-0a1dd7228f2d'), U('photo-1600566753086-00f18fb6b3ea')], agent: 0, sale: true, lat: 47, lng: 28 },
    { id: 'L-2408', title: 'Garden townhouse',              community: 'Jumeirah Village', subCommunity: 'District 12',  price: 1980000, type: 'Townhouse', furnishing: 'Unfurnished', beds: 3, baths: 4, sqft: 2240, photoCount: 14, dld: true, images: [U('photo-1523217582562-09d0def993a6')], agent: 1, sale: true, lat: 28, lng: 62 },
  ];

  const offPlan = [
    { id: 'P-9001', name: 'Cassia Residences', developer: 'Sobha Realty',     from: 1800000, completion: 'Q4 2027', status: 'Launched',          image: U('photo-1573496359142-b8d87734a5a2'), units: 320 },
    { id: 'P-9002', name: 'Mirador Tower',     developer: 'Emaar Properties', from: 2950000, completion: 'Q2 2026', status: 'Under Construction',image: U('photo-1544005313-94ddf0286df2'), units: 480 },
    { id: 'P-9003', name: 'Atelier Bay',       developer: 'DAMAC',            from: 4100000, completion: 'Q1 2025', status: 'Handover Soon',     image: U('photo-1502672260266-1c1ef2d93688'), units: 144 },
    { id: 'P-9004', name: 'Saadiyat Pavilion', developer: 'Aldar',            from: 6400000, completion: 'Q3 2028', status: 'Launched',          image: U('photo-1580489944761-15a19d654956'), units: 96 },
  ];

  const insights = [
    { kind: 'Market Report',   title: 'Q1 2026: Prime Dubai trades up 11.4%', read: '6 min', image: U('photo-1518684079-3c830dcef090') },
    { kind: 'Community Guide', title: 'Living on the Frond: a Palm Jumeirah primer', read: '9 min', image: U('photo-1582407947304-fd86f028f716') },
    { kind: 'Off-Plan',        title: 'Why Saadiyat is the next Palm', read: '5 min', image: U('photo-1613977257363-707ba9348227') },
  ];

  const developers = ['Emaar', 'Sobha', 'DAMAC', 'Aldar', 'Meraas', 'Nakheel', 'Omniyat', 'Select Group'];

  return { communities, agents, listings, offPlan, insights, developers };
})();
