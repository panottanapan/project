// Partner Eco Routes in Thailand
const partnerEcoRoutes = [
    {
        airline: "Thai AirAsia",
        carrier: "FD",
        flightNum: "3438",
        from: "Bangkok (DMK)",
        fromCity: "Bangkok",
        to: "Chiang Mai (CNX)",
        toCity: "Chiang Mai",
        dates: "Wed, Oct 15 - Thu, Oct 22",
        class: "Economy",
        priceTHB: 1669,
        carbonSavings: "-24% CO₂e (Lowest)",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    {
        airline: "Thai Airways",
        carrier: "TG",
        flightNum: "102",
        from: "Bangkok (BKK)",
        fromCity: "Bangkok",
        to: "Chiang Mai (CNX)",
        toCity: "Chiang Mai",
        dates: "Thu, Oct 16 - Fri, Oct 23",
        class: "Economy",
        priceTHB: 2370,
        carbonSavings: "-15% CO₂e",
        badgeColor: "bg-sky-100 text-sky-800 border-sky-300"
    },
    {
        airline: "Thai Lion Air",
        carrier: "SL",
        flightNum: "506",
        from: "Bangkok (DMK)",
        fromCity: "Bangkok",
        to: "Krabi (KBV)",
        toCity: "Krabi",
        dates: "Sun, Oct 25 - Tue, Oct 27",
        class: "Economy",
        priceTHB: 2285,
        carbonSavings: "-18% CO₂e",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    {
        airline: "Thai VietJet Air",
        carrier: "VZ",
        flightNum: "106",
        from: "Bangkok (BKK)",
        fromCity: "Bangkok",
        to: "Phuket (HKT)",
        toCity: "Phuket",
        dates: "Wed, Mar 24 - Thu, Mar 25",
        class: "Economy",
        priceTHB: 1850,
        carbonSavings: "-20% CO₂e",
        badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    {
        airline: "Bangkok Airways",
        carrier: "PG",
        flightNum: "271",
        from: "Bangkok (BKK)",
        fromCity: "Bangkok",
        to: "Koh Samui (USM)",
        toCity: "Koh Samui",
        dates: "Tue, Nov 10 - Tue, Nov 17",
        class: "Economy",
        priceTHB: 4755,
        carbonSavings: "-12% CO₂e",
        badgeColor: "bg-sky-100 text-sky-800 border-sky-300"
    },
    {
        airline: "Nok Air",
        carrier: "DD",
        flightNum: "128",
        from: "Chiang Mai (CNX)",
        fromCity: "Chiang Mai",
        to: "Bangkok (DMK)",
        toCity: "Bangkok",
        dates: "Tue, Nov 3 - Thu, Nov 5",
        class: "Economy",
        priceTHB: 1450,
        carbonSavings: "-10% CO₂e",
        badgeColor: "bg-slate-100 text-slate-800 border-slate-300"
    }
];

// Eco Activities Database for Destinations
const destinationActivities = {
    "Chiang Mai": {
        cityName: "Chiang Mai",
        activities: [
            { title: "Ethical Elephant Nature Sanctuary Tour (No Riding)", category: "Eco Tours", rating: 4.9, reviews: 1240, priceTHB: 2200, tag: "Best Seller", img: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80" },
            { title: "Doi Suthep Organic Coffee Plantation & Rainforest Trek", category: "Experiences", rating: 4.8, reviews: 430, priceTHB: 1650, tag: "Top Outdoor", img: "https://images.unsplash.com/photo-1513415564515-763d91423bdd?auto=format&fit=crop&w=400&q=80" },
            { title: "Mae Kampong Eco-Village & Bamboo Forest Hike", category: "Attractions", rating: 4.9, reviews: 310, priceTHB: 1350, tag: "Cultural Heritage", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
            { title: "Chiang Mai Old City Electric Scooter & Temple Tour", category: "Eco Mobility", rating: 4.7, reviews: 520, priceTHB: 890, tag: "Zero Emission", img: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=400&q=80" }
        ]
    },
    "Phuket": {
        cityName: "Phuket",
        activities: [
            { title: "Phang Nga Bay Solar Catamaran & Kayak Expedition", category: "Eco Tours", rating: 4.9, reviews: 890, priceTHB: 2800, tag: "Best Seller", img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=400&q=80" },
            { title: "Phuket Coral Reef Restoration & Snorkeling Day Trip", category: "Experiences", rating: 4.8, reviews: 615, priceTHB: 2400, tag: "Marine Conservation", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80" },
            { title: "Sirinat National Park Turtle Sanctuary Guided Walk", category: "Attractions", rating: 4.7, reviews: 290, priceTHB: 950, tag: "Wildlife Rescue", img: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=400&q=80" },
            { title: "Organic Coconut Farm Tour & Sustainable Cooking Class", category: "Food & Organic", rating: 4.9, reviews: 410, priceTHB: 1500, tag: "Local Community", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" }
        ]
    },
    "Bangkok": {
        cityName: "Bangkok",
        activities: [
            { title: "Bang Krachao Green Lung E-Bike & Organic Farm Tour", category: "Eco Tours", rating: 4.9, reviews: 340, priceTHB: 850, tag: "Best Seller", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80" },
            { title: "Solar Electric Longtail Boat Canal & Floating Market Tour", category: "Attractions", rating: 4.8, reviews: 512, priceTHB: 1200, tag: "Top Eco Choice", img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=400&q=80" },
            { title: "Chao Phraya Sunset Kayak & River Clean-up Experience", category: "Experiences", rating: 4.9, reviews: 188, priceTHB: 950, tag: "Community Impact", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80" },
            { title: "Zero-Waste Organic Cooking Class & Market Walking Tour", category: "Food & Organic", rating: 4.7, reviews: 276, priceTHB: 1450, tag: "Farm to Table", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80" }
        ]
    },
    "Krabi": {
        cityName: "Krabi",
        activities: [
            { title: "Ao Thalane Mangrove Kayak & Eco-Biodiversity Tour", category: "Eco Tours", rating: 4.9, reviews: 720, priceTHB: 1100, tag: "Best Seller", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
            { title: "Phra Nang Cave Beach Clean-up & Rock Climbing Eco-Class", category: "Experiences", rating: 4.8, reviews: 380, priceTHB: 1800, tag: "Eco Adventure", img: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=400&q=80" },
            { title: "Emerald Pool & Hot Springs Nature Conservation Park Walk", category: "Attractions", rating: 4.7, reviews: 510, priceTHB: 950, tag: "Natural Heritage", img: "https://images.unsplash.com/photo-1513415564515-763d91423bdd?auto=format&fit=crop&w=400&q=80" },
            { title: "Koh Hong Solar Speedboat & Marine Wildlife Tour", category: "Marine Eco", rating: 4.9, reviews: 640, priceTHB: 2300, tag: "Low Carbon Sea", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80" }
        ]
    }
};

module.exports = {
    getPartnerRoutes: (toCity, fromCity) => {
        if (!toCity || toCity === 'All') return partnerEcoRoutes;
        const filtered = partnerEcoRoutes.filter(r => 
            r.toCity.toLowerCase() === toCity.toLowerCase() || 
            r.to.toLowerCase().includes(toCity.toLowerCase())
        );
        return filtered.length > 0 ? filtered : partnerEcoRoutes;
    },
    getDestinationActivities: (destinationKey) => {
        const key = Object.keys(destinationActivities).find(k => k.toLowerCase() === (destinationKey || 'Chiang Mai').toLowerCase()) || 'Chiang Mai';
        return destinationActivities[key];
    }
};