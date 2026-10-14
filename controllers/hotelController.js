const hotelModel = require('../models/hotelModel');
const MAX_GUESTS_PER_BOOKING = 4;

const toDateValue = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const isValidDate = value => typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

const parseGuestCount = (value, fallback) => {
    if (value === undefined) return fallback;
    if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
    return Number(value);
};

const getStayInfo = query => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultCheckIn = toDateValue(today);
    const defaultCheckOut = toDateValue(tomorrow);
    const checkIn = query.checkIn === undefined ? defaultCheckIn : query.checkIn;
    const checkOut = query.checkOut === undefined ? defaultCheckOut : query.checkOut;
    const adults = parseGuestCount(query.adults, 2);
    const children = parseGuestCount(query.children, 0);
    const rooms = parseGuestCount(query.rooms, 1);

    if (!isValidDate(checkIn) || !isValidDate(checkOut) || checkOut <= checkIn
        || checkIn < defaultCheckIn
        || adults === null || adults < 1
        || children === null || children < 0
        || rooms === null || rooms < 1 || rooms > 50
        || adults + children > 50) {
        return null;
    }

    const checkInDate = new Date(`${checkIn}T00:00:00Z`);
    const checkOutDate = new Date(`${checkOut}T00:00:00Z`);
    const nights = Math.round((checkOutDate - checkInDate) / 86400000);
    const formatDate = value => new Intl.DateTimeFormat('en', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    }).format(new Date(`${value}T00:00:00Z`));

    return {
        checkIn,
        checkOut,
        checkInLabel: formatDate(checkIn),
        checkOutLabel: formatDate(checkOut),
        nights,
        adults,
        children,
        rooms,
        guestCount: adults + children,
        guestSummary: `${adults} adult${adults === 1 ? '' : 's'}${children ? `, ${children} child${children === 1 ? '' : 'ren'}` : ''}`,
        queryString: new URLSearchParams({ checkIn, checkOut, adults: String(adults), children: String(children), rooms: String(rooms) }).toString()
    };
};

const getRoomSelection = (hotel, query, stayInfo) => {
    const parseIndex = value => {
        if (value === undefined) return 0;
        if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
        return Number(value);
    };
    const roomIndex = parseIndex(query.roomIndex);
    const planIndex = parseIndex(query.planIndex);
    if (roomIndex === null || planIndex === null) return null;

    const room = hotel.rooms && hotel.rooms[roomIndex];
    const plan = room && room.plans && room.plans[planIndex];
    if (!room || !plan || !Number.isFinite(plan.price) || !Number.isFinite(plan.totalWithTaxes)) {
        return null;
    }

    const multiplier = stayInfo.rooms * stayInfo.nights;
    const originalPrice = Number.isFinite(plan.priceOriginal) ? plan.priceOriginal : plan.price;
    const originalTotal = originalPrice * multiplier;
    const subtotal = plan.price * multiplier;
    const total = plan.totalWithTaxes * multiplier;

    return {
        room,
        plan,
        roomIndex,
        planIndex,
        subtotal,
        originalTotal,
        total,
        savings: Math.max(0, originalTotal - subtotal),
        taxesAndFees: Math.max(0, total - subtotal)
    };
};

// 1. หน้าแรกโรงแรม (/hotels)
exports.getHotelHome = (req, res) => {
    const stayInfo = getStayInfo(req.query);
    if (!stayInfo) {
        return res.status(400).send('Please select valid stay dates, 1–50 rooms, and no more than 50 guests.');
    }

    const rawCity = req.query.city || 'Bangkok';
    let normalizedCity = 'Bangkok';
    if (rawCity.toLowerCase().includes('chiang')) normalizedCity = 'Chiang Mai';
    else if (rawCity.toLowerCase().includes('phuket')) normalizedCity = 'Phuket';
    else if (rawCity.toLowerCase().includes('krabi')) normalizedCity = 'Krabi';

    const ecoHotels = stayInfo.guestCount > MAX_GUESTS_PER_BOOKING
        ? []
        : hotelModel.getEcoHotelsByCity(normalizedCity);
    const cityData = hotelModel.getCityActivities(normalizedCity);

    res.render('pages/hotels', {
        pageTitle: `Eco Stays & Green Things to do in ${normalizedCity} | GreenTravel`,
        selectedCity: normalizedCity,
        stayInfo,
        ecoHotels: ecoHotels,
        cityData: cityData
    });
};

// 2. หน้าผลการค้นหาโรงแรม (/hotels/search)
exports.searchHotels = (req, res) => {
    const stayInfo = getStayInfo(req.query);
    if (!stayInfo) {
        return res.status(400).send('Please select valid stay dates, 1–50 rooms, and no more than 50 guests.');
    }

    const rawCity = req.query.city || 'Bangkok';
    
    let city = 'Bangkok';
    if (rawCity.toLowerCase().includes('chiang')) city = 'Chiang Mai';
    else if (rawCity.toLowerCase().includes('phuket')) city = 'Phuket';
    else if (rawCity.toLowerCase().includes('krabi')) city = 'Krabi';

    const selectedCerts = req.query.certs ? (Array.isArray(req.query.certs) ? req.query.certs : [req.query.certs]) : [];
    
    const hotels = stayInfo.guestCount > MAX_GUESTS_PER_BOOKING
        ? []
        : hotelModel.searchHotels(city, selectedCerts);
    const ecoCertsList = hotelModel.getEcoCertificatesList();

    res.render('pages/hotel-search', {
        pageTitle: `${hotels.length} Eco-Certified Properties Found in ${city} | GreenTravel`,
        selectedCity: city,
        hotels: hotels,
        totalFound: hotels.length,
        ecoCertsList: ecoCertsList,
        selectedCerts: selectedCerts,
        stayInfo
    });
};

// 3. หน้าชำระเงินโรงแรม (/hotels/checkout)
exports.getCheckoutPage = (req, res) => {
    const stayInfo = getStayInfo(req.query);
    if (!stayInfo) {
        return res.status(400).send('Please select valid stay dates, 1–50 rooms, and no more than 50 guests.');
    }
    if (stayInfo.guestCount > MAX_GUESTS_PER_BOOKING) {
        return res.status(400).send('No available hotel room can accommodate more than 4 guests.');
    }

    const hotelId = req.query.id || 'h1';
    const hotel = hotelModel.getHotelById(hotelId) || hotelModel.getEcoHotelsByCity('Bangkok')[0];
    const roomSelection = getRoomSelection(hotel, req.query, stayInfo);
    if (!roomSelection) {
        return res.status(400).send('Please select a valid room and rate plan.');
    }

    res.render('pages/hotel-checkout', {
        pageTitle: `Secure Checkout - ${hotel.name} | GreenTravel`,
        hotel,
        stayInfo,
        roomSelection
    });
};

// 4. บันทึกและยืนยันการจอง (/hotels/checkout POST)
exports.processBooking = (req, res) => {
    res.send(`
        <script>
            alert("🌱 Booking Confirmed! Thank you for choosing an Eco-Certified Stay in Thailand.");
            window.location.href = "/hotels";
        </script>
    `);
};

// 5. หน้ารายละเอียดโรงแรมตาม ID (/hotels/:id)
exports.getHotelDetail = (req, res) => {
    const stayInfo = getStayInfo(req.query);
    if (!stayInfo) {
        return res.status(400).send('Please select valid stay dates, 1–50 rooms, and no more than 50 guests.');
    }
    if (stayInfo.guestCount > MAX_GUESTS_PER_BOOKING) {
        return res.status(400).send('No available hotel room can accommodate more than 4 guests.');
    }

    const hotelId = req.params.id;
    const hotel = hotelModel.getHotelById(hotelId);

    if (!hotel) {
        return res.redirect('/hotels/search');
    }

    const defaultRoom = hotel.rooms && hotel.rooms[0];
    const defaultPlan = defaultRoom && defaultRoom.plans && defaultRoom.plans[0];
    if (!defaultPlan || !Number.isFinite(defaultPlan.price) || !Number.isFinite(defaultPlan.totalWithTaxes)) {
        return res.status(500).send('Room pricing is unavailable for this property.');
    }
    const detailMultiplier = stayInfo.rooms * stayInfo.nights;

    res.render('pages/hotel-detail', {
        pageTitle: `${hotel.name} - Eco Stay in ${hotel.city} | GreenTravel`,
        hotel,
        stayInfo,
        recommendedRoom: defaultRoom,
        recommendedPlan: defaultPlan,
        recommendedPrice: defaultPlan.price * detailMultiplier,
        recommendedOriginalPrice: (Number.isFinite(defaultPlan.priceOriginal) ? defaultPlan.priceOriginal : defaultPlan.price) * detailMultiplier,
        recommendedTotal: defaultPlan.totalWithTaxes * detailMultiplier
    });
};