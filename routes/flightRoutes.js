const express = require('express');
const router = express.Router();
const { getFlightEmissionsFromTIM } = require('../services/googleTimService');

// ฐานข้อมูลสถานที่ท่องเที่ยวและเที่ยวบินแนะนำตามปลายทาง
const destinationDataMap = {
    'Chiang Mai': {
        name: 'Chiang Mai',
        priceFrom: 1450,
        savingBadge: '-22% CO₂ Savings',
        activities: [
            { title: 'Elephant Nature Park Ethical Sanctuary & Organic Lunch', tag: 'Top Eco Tour', rating: 4.9, reviews: 850, priceTHB: 2750, img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80', category: 'Tours' },
            { title: 'Doi Inthanon National Park Mountain Trekking', tag: 'Best Seller', rating: 4.8, reviews: 620, priceTHB: 1850, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', category: 'Outdoor' },
            { title: 'Organic Thai Cooking Class at Farm', tag: 'Food & Culture', rating: 4.9, reviews: 410, priceTHB: 1200, img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80', category: 'Food' },
            { title: 'Chiang Mai Old City Electric Bike Tour', tag: 'Eco Transport', rating: 4.7, reviews: 290, priceTHB: 890, img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80', category: 'Activities' }
        ],
        flights: [
            { id: 'cnx1', airline: 'Nok Air', logo: '🟡', code: 'DD 124', depTime: '18:20', arrTime: '19:35', duration: '1h 15m', priceTHB: 1450, ecoBadge: '-22% CO₂e', route: 'DMK ➔ CNX' },
            { id: 'cnx2', airline: 'Thai Vietjet Air', logo: '🔴', code: 'VZ 108', depTime: '18:35', arrTime: '20:00', duration: '1h 25m', priceTHB: 1520, ecoBadge: '-16% CO₂e', route: 'BKK ➔ CNX' },
            { id: 'cnx3', airline: 'Thai AirAsia', logo: '🔴', code: 'FD 3437', depTime: '11:15', arrTime: '12:30', duration: '1h 15m', priceTHB: 1580, ecoBadge: '-15% CO₂e', route: 'DMK ➔ CNX' },
            { id: 'cnx4', airline: 'Thai Lion Air', logo: '🦁', code: 'SL 510', depTime: '09:00', arrTime: '10:15', duration: '1h 15m', priceTHB: 1490, ecoBadge: 'Low Emission', route: 'DMK ➔ CNX' }
        ]
    },
    'Bangkok': {
        name: 'Bangkok',
        priceFrom: 1290,
        savingBadge: 'Low Emission Flight',
        activities: [
            { title: 'Bang Krachao Green Lung E-Bike Explorer Tour', tag: 'Eco Explorer', rating: 4.8, reviews: 380, priceTHB: 950, img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', category: 'Activities' },
            { title: 'Grand Palace & Emerald Buddha Eco Cultural Walking Tour', tag: 'Must Visit', rating: 4.9, reviews: 1250, priceTHB: 1100, img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=600&q=80', category: 'Tours' },
            { title: 'Chao Phraya River Sustainable Solar Cruise', tag: 'Top Rated', rating: 4.7, reviews: 520, priceTHB: 1800, img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', category: 'Experiences' },
            { title: 'Damnoen Saduak Organic Floating Market Tour', tag: 'Culture', rating: 4.6, reviews: 690, priceTHB: 850, img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80', category: 'Tours' }
        ],
        flights: [
            { id: 'bkk1', airline: 'Thai AirAsia', logo: '🔴', code: 'FD 3438', depTime: '07:10', arrTime: '08:25', duration: '1h 15m', priceTHB: 1290, ecoBadge: '-18% CO₂e', route: 'CNX ➔ DMK' },
            { id: 'bkk2', airline: 'Nok Air', logo: '🟡', code: 'DD 125', depTime: '08:45', arrTime: '10:00', duration: '1h 15m', priceTHB: 1350, ecoBadge: '-16% CO₂e', route: 'HKT ➔ DMK' },
            { id: 'bkk3', airline: 'Thai Vietjet Air', logo: '🔴', code: 'VZ 109', depTime: '13:20', arrTime: '14:40', duration: '1h 20m', priceTHB: 1420, ecoBadge: '-14% CO₂e', route: 'CNX ➔ BKK' },
            { id: 'bkk4', airline: 'Bangkok Airways', logo: '🔵', code: 'PG 218', depTime: '17:00', arrTime: '18:25', duration: '1h 25m', priceTHB: 2100, ecoBadge: 'Low Emission', route: 'USM ➔ BKK' }
        ]
    },
    'Phuket': {
        name: 'Phuket',
        priceFrom: 1690,
        savingBadge: 'Green Coastal Flight',
        activities: [
            { title: 'Phang Nga Bay Eco Kayaking & Cave Exploration', tag: 'Top Island Tour', rating: 4.9, reviews: 920, priceTHB: 2450, img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80', category: 'Outdoor' },
            { title: 'Phi Phi Islands Catamaran Solar Cruise', tag: 'Best Seller', rating: 4.8, reviews: 1140, priceTHB: 3200, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', category: 'Tours' },
            { title: 'Phuket Elephant Sanctuary Ethical Experience', tag: 'Eco Wildlife', rating: 4.9, reviews: 510, priceTHB: 2900, img: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=600&q=80', category: 'Experiences' },
            { title: 'Old Phuket Town Heritage Walking Tour', tag: 'Culture', rating: 4.7, reviews: 320, priceTHB: 750, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', category: 'Tours' }
        ],
        flights: [
            { id: 'hkt1', airline: 'Thai Vietjet Air', logo: '🔴', code: 'VZ 300', depTime: '06:50', arrTime: '08:15', duration: '1h 25m', priceTHB: 1690, ecoBadge: '-19% CO₂e', route: 'BKK ➔ HKT' },
            { id: 'hkt2', airline: 'Thai AirAsia', logo: '🔴', code: 'FD 3015', depTime: '10:30', arrTime: '11:55', duration: '1h 25m', priceTHB: 1750, ecoBadge: '-15% CO₂e', route: 'DMK ➔ HKT' },
            { id: 'hkt3', airline: 'Nok Air', logo: '🟡', code: 'DD 502', depTime: '14:10', arrTime: '15:35', duration: '1h 25m', priceTHB: 1820, ecoBadge: 'Low Emission', route: 'DMK ➔ HKT' },
            { id: 'hkt4', airline: 'Bangkok Airways', logo: '🔵', code: 'PG 275', depTime: '16:45', arrTime: '18:15', duration: '1h 30m', priceTHB: 2450, ecoBadge: '-12% CO₂e', route: 'BKK ➔ HKT' }
        ]
    }
};

// 1. หน้าแรก Landing Page
router.get('/', (req, res) => {
    const selectedOrigin = req.query.origin || 'Bangkok';
    let selectedDestination = req.query.destination || 'Chiang Mai';
    
    if (selectedOrigin === selectedDestination) {
        selectedDestination = selectedOrigin === 'Bangkok' ? 'Chiang Mai' : 'Bangkok';
    }

    const cityData = destinationDataMap[selectedDestination] || destinationDataMap['Chiang Mai'];
    const parsePassengerCount = (value, fallback) => {
        const count = Number(value);
        return Number.isInteger(count) && count >= 0 ? count : fallback;
    };
    const selectedAdults = Math.max(1, parsePassengerCount(req.query.adults, 1));
    const selectedChildren = parsePassengerCount(req.query.children, 0);
    const selectedLapInfants = parsePassengerCount(req.query.lapInfants, 0);
    let remainingSeats = Math.max(0, 9 - selectedAdults);
    const safeChildren = Math.min(selectedChildren, remainingSeats);
    remainingSeats -= safeChildren;
    const safeLapInfants = Math.min(selectedLapInfants, remainingSeats);
    const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
        && !Number.isNaN(Date.parse(`${value}T00:00:00`));

    res.render('pages/flights', {
        pageTitle: `Sustainable Eco-Flights from ${selectedOrigin} to ${cityData.name} - GreenTravel`,
        selectedOrigin: selectedOrigin,
        selectedDestination: cityData.name,
        cityData: cityData,
        availableCities: Object.keys(destinationDataMap),
        selectedDepartDate: isDate(req.query.departDate) ? req.query.departDate : '',
        selectedReturnDate: isDate(req.query.returnDate) ? req.query.returnDate : '',
        selectedAdults: Math.min(selectedAdults, 9),
        selectedChildren: safeChildren,
        selectedLapInfants: safeLapInfants
    });
});

// 2. หน้าเลือกเที่ยวบิน (ขาไป ➔ ขากลับ ➔ Select Fare)
router.get('/search', (req, res) => {
    const { origin = 'Bangkok', destination = 'Chiang Mai' } = req.query;
    const today = new Date();
    const toDateValue = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const defaultDepartDate = toDateValue(today);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const departDate = req.query.departDate || defaultDepartDate;
    const returnDate = req.query.returnDate || toDateValue(tomorrow);
    const adults = Number(req.query.adults === undefined ? 1 : req.query.adults);
    const children = Number(req.query.children === undefined ? 0 : req.query.children);
    const lapInfants = Number(req.query.lapInfants === undefined ? 0 : req.query.lapInfants);
    const isValidDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
        && !Number.isNaN(Date.parse(`${value}T00:00:00`))
        && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

    if (!isValidDate(departDate) || !isValidDate(returnDate) || returnDate < departDate) {
        return res.status(400).send('Please select valid departure and return dates.');
    }
    if (![adults, children, lapInfants].every(Number.isInteger)
        || adults < 1 || children < 0 || lapInfants < 0
        || adults + children + lapInfants > 9) {
        return res.status(400).send('Select at least one adult and no more than 9 passengers in total.');
    }

    const formatDate = value => new Intl.DateTimeFormat('en', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(new Date(`${value}T00:00:00Z`));
    const dates = `${formatDate(departDate)} - ${formatDate(returnDate)}`;
    const passengerSummary = [
        `${adults} adult${adults === 1 ? '' : 's'}`,
        children ? `${children} child${children === 1 ? '' : 'ren'}` : null,
        lapInfants ? `${lapInfants} lap infant${lapInfants === 1 ? '' : 's'}` : null
    ].filter(Boolean).join(', ');

    res.render('pages/flight-search', {
        pageTitle: `${origin} to ${destination} Flights - GreenTravel`,
        searchParams: { origin, destination, dates },
        passengerSummary,
        adults,
        children,
        lapInfants
    });
});

// 3. หน้าสุดท้าย Checkout ขั้นตอนการจอง 3 สเต็ป
router.get('/checkout', (req, res) => {
    const { fareType = 'Standard Fare', origin = 'Bangkok (DMK)', destination = 'Chiang Mai (CNX)' } = req.query;
    const parsePassengerCount = (value, fallback) => {
        if (value === undefined) return fallback;
        if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
        return Number(value);
    };
    const adults = parsePassengerCount(req.query.adults, 1);
    const children = parsePassengerCount(req.query.children, 0);
    const lapInfants = parsePassengerCount(req.query.lapInfants, 0);
    if (adults === null || children === null || lapInfants === null
        || adults < 1 || children < 0 || lapInfants < 0
        || adults + children + lapInfants > 9) {
        return res.status(400).send('Select at least one adult and no more than 9 passengers in total.');
    }

    const fareOptions = {
        'Standard Fare': { addonLabel: '', addonPrice: 0, baggageIncluded: false },
        'TripFlex Flexible Fare': { addonLabel: 'TripFlex · EasyCancel & Change', addonPrice: 425, baggageIncluded: false },
        'Baggage Included Fare': { addonLabel: 'Checked baggage fare upgrade', addonPrice: 450, baggageIncluded: true }
    };
    const selectedFare = fareOptions[fareType];
    if (!selectedFare) {
        return res.status(400).send('Please select a valid fare option.');
    }

    const rawBasePrice = req.query.basePrice === undefined ? req.query.price : req.query.basePrice;
    const basePrice = rawBasePrice === undefined ? 3125 : Number(rawBasePrice);
    if (!Number.isFinite(basePrice) || basePrice <= 0 || basePrice > 100000) {
        return res.status(400).send('Please select a valid ticket price.');
    }

    const passengers = [
        ...Array.from({ length: adults }, () => ({ typeLabel: 'Adult (≥12 years)', seatRequired: true })),
        ...Array.from({ length: children }, () => ({ typeLabel: 'Child (2–11 years)', seatRequired: true })),
        ...Array.from({ length: lapInfants }, () => ({ typeLabel: 'Lap infant (under 2 years)', seatRequired: false }))
    ];

    res.render('pages/flight-checkout', {
        pageTitle: 'Complete Your Flight Booking - GreenTravel',
        passengers,
        bookingInfo: {
            origin: origin,
            destination: destination,
            outboundTime: 'Fri, Oct 16 | 18:20 – 19:35 (Nonstop)',
            returnTime: 'Sun, Oct 18 | 06:50 – 08:05 (Nonstop)',
            fareType: fareType,
            basePrice: basePrice,
            fareAddonLabel: selectedFare.addonLabel,
            fareAddonPrice: selectedFare.addonPrice,
            baggageIncluded: selectedFare.baggageIncluded
        }
    });
});

// 4. API คำนวณคาร์บอน
router.post('/api/calculate-emissions', async (req, res) => {
    try {
        const { flights } = req.body;
        if (!flights || !Array.isArray(flights)) {
            return res.status(400).json({ success: false, message: 'Invalid flight payload' });
        }

        const timResults = await getFlightEmissionsFromTIM(flights);

        const processedEmissions = flights.map((flight, index) => {
            const timItem = timResults && timResults[index];
            const grams = timItem?.emissionsGramsPerPassenger?.economy;
            const averageRouteEmissionsKg = 52.0; 

            let actualKg = grams ? (grams / 1000) : (flight.defaultKg || 43.5);
            let savedKg = Math.max(0, averageRouteEmissionsKg - actualKg);
            let savingPercentage = ((savedKg / averageRouteEmissionsKg) * 100).toFixed(1);

            return {
                flightId: flight.id,
                actualKgCO2: actualKg.toFixed(1),
                savedKgCO2: savedKg.toFixed(1),
                savingPercentage: savingPercentage,
                isLowEmission: actualKg < averageRouteEmissionsKg
            };
        });

        res.json({ success: true, data: processedEmissions });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;