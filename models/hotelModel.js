// Read on demand so back-office edits are visible to every hotel page immediately.
const fs = require('fs');
const path = require('path');
const hotelsFilePath = path.join(__dirname, '../data/hotels.json');

function getHotels() {
    return JSON.parse(fs.readFileSync(hotelsFilePath, 'utf-8'));
}

// Helper ปรับชื่อเมืองให้มาตรฐานอย่างแม่นยำ
function normalizeCityName(cityName) {
    if (!cityName) return '';
    const lower = cityName.toLowerCase();
    if (lower.includes('chiang')) return 'Chiang Mai';
    if (lower.includes('phuket')) return 'Phuket';
    if (lower.includes('bangkok')) return 'Bangkok';
    if (lower.includes('krabi')) return 'Krabi';
    return cityName.trim();
}

// กิจกรรม Eco ประจำเมือง (เพิ่มเป็นเมืองละ 4 กิจกรรมเพื่อเติมเต็ม Grid 4 คอลัมน์)
const cityEcoActivities = {
    "Bangkok": {
        flightInfo: { route: "BKK / DMK to Bangkok", priceFrom: 1290, savingBadge: "Low Emission Flight" },
        activities: [
            { 
                id: "a1", 
                title: "Bang Krachao Green Lung E-Bike & Organic Farm Tour", 
                category: "Eco Tours", 
                rating: 4.9, 
                reviews: 340, 
                priceTHB: 850, 
                tag: "Best Seller", 
                img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a2", 
                title: "Solar Electric Longtail Boat Canal & Floating Market Tour", 
                category: "Attractions", 
                rating: 4.8, 
                reviews: 512, 
                priceTHB: 1200, 
                tag: "Top Eco Choice", 
                img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a3", 
                title: "Historic Eco Walking & Zero-Waste Street Food Tour", 
                category: "Cultural Tours", 
                rating: 4.7, 
                reviews: 290, 
                priceTHB: 950, 
                tag: "Local Fav", 
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a4", 
                title: "Chao Phraya Eco Sunset Cruise & Temple Light Up", 
                category: "Cruises", 
                rating: 4.9, 
                reviews: 620, 
                priceTHB: 1500, 
                tag: "Popular", 
                img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80" 
            }
        ]
    },
    "Phuket": {
        flightInfo: { route: "BKK to Phuket (HKT)", priceFrom: 1850, savingBadge: "Low CO₂ Flight (-20%)" },
        activities: [
            { 
                id: "a7", 
                title: "Phang Nga Bay Solar Catamaran & Kayak Expedition", 
                category: "Eco Tours", 
                rating: 4.9, 
                reviews: 890, 
                priceTHB: 2800, 
                tag: "Best Seller", 
                img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a8", 
                title: "Ethical Elephant Sanctuary & Mud Spa Experience", 
                category: "Wildlife", 
                rating: 4.9, 
                reviews: 1150, 
                priceTHB: 2500, 
                tag: "Must Visit", 
                img: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a9", 
                title: "Coral Reef Restoration & Snorkeling at Coral Island", 
                category: "Marine Eco", 
                rating: 4.8, 
                reviews: 430, 
                priceTHB: 1900, 
                tag: "Eco-Friendly", 
                img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a10", 
                title: "Sirinat National Park Mangrove E-Bike & Planting Tour", 
                category: "Nature", 
                rating: 4.7, 
                reviews: 210, 
                priceTHB: 1200, 
                tag: "Tree Planting", 
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" 
            }
        ]
    },
    "Chiang Mai": {
        flightInfo: { route: "BKK to Chiang Mai (CNX)", priceFrom: 1669, savingBadge: "Low CO₂ Flight (-24%)" },
        activities: [
            { 
                id: "a5", 
                title: "Ethical Elephant Nature Sanctuary Tour (No Riding)", 
                category: "Eco Tours", 
                rating: 4.9, 
                reviews: 1240, 
                priceTHB: 2200, 
                tag: "Best Seller", 
                img: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a6", 
                title: "Doi Inthanon Organic Tea Plantation & Waterfall Trek", 
                category: "Trekking", 
                rating: 4.8, 
                reviews: 580, 
                priceTHB: 1850, 
                tag: "Top Choice", 
                img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a11", 
                title: "Mae Kampong Eco-Village & Local Lanna Cooking Class", 
                category: "Cultural", 
                rating: 4.9, 
                reviews: 710, 
                priceTHB: 1600, 
                tag: "Community Tourism", 
                img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80" 
            },
            { 
                id: "a12", 
                title: "Chiang Mai Old City Electric Tram & Sustainable Temple Tour", 
                category: "City Tour", 
                rating: 4.7, 
                reviews: 320, 
                priceTHB: 750, 
                tag: "Low Carbon", 
                img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80" 
            }
        ]
    }
};

// รายชื่อ Certificate ใบรับรองสิ่งแวดล้อม
const ecoCertificatesList = [
    { id: "gstc", name: "GSTC Certified", icon: "🌿" },
    { id: "green-leaf", name: "Green Leaf 5-Star", icon: "🍃" },
    { id: "carbon-neutral", name: "Carbon Neutral Certified", icon: "📉" },
    { id: "earthcheck", name: "EarthCheck Gold", icon: "🌏" },
    { id: "zero-plastic", name: "Zero Single-Use Plastic", icon: "♻️" },
    { id: "solar-powered", name: "Solar Powered", icon: "☀️" },
    { id: "organic-farm", name: "Organic Farm-to-Table", icon: "🥗" }
];

module.exports = {
    getEcoHotelsByCity: (cityName) => {
        const normCity = normalizeCityName(cityName);
        const hotels = getHotels();
        if (!normCity) return hotels;
        return hotels.filter(h => h.city.toLowerCase() === normCity.toLowerCase());
    },
    getCityActivities: (cityName) => {
        const normCity = normalizeCityName(cityName);
        const cityKey = Object.keys(cityEcoActivities).find(c => c.toLowerCase() === normCity.toLowerCase()) || 'Bangkok';
        return cityEcoActivities[cityKey];
    },
    searchHotels: (cityName, selectedCerts = []) => {
        const normCity = normalizeCityName(cityName);
        let results = getHotels();

        if (normCity && normCity !== 'All') {
            results = results.filter(h => h.city.toLowerCase() === normCity.toLowerCase());
        }

        if (selectedCerts && selectedCerts.length > 0) {
            results = results.filter(h => 
                h.ecoCertificates.some(cert => selectedCerts.includes(cert))
            );
        }

        return results;
    },
    getHotelById: (id) => {
        return getHotels().find(h => h.id === id) || null;
    },
    getEcoCertificatesList: () => ecoCertificatesList
};