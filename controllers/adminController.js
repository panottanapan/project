const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const hotelsFilePath = path.join(__dirname, '../data/hotels.json');
const DEMO_PASSWORD = 'green123';
const sessions = new Map();

function readHotels() {
    return JSON.parse(fs.readFileSync(hotelsFilePath, 'utf-8'));
}

function writeHotels(hotels) {
    fs.writeFileSync(hotelsFilePath, JSON.stringify(hotels, null, 2), 'utf-8');
}

function getSessionToken(req) {
    const cookieHeader = req.headers.cookie || '';
    const cookie = cookieHeader.split(';').map(value => value.trim())
        .find(value => value.startsWith('hotel_admin_session='));
    return cookie ? cookie.slice('hotel_admin_session='.length) : null;
}

function getAuthorizedHotel(req) {
    const token = getSessionToken(req);
    const hotelId = token && sessions.get(token);
    if (!hotelId) return null;
    return readHotels().find(hotel => hotel.id === hotelId) || null;
}

function renderLogin(res, loginError = null, selectedHotelId = '') {
    res.status(loginError ? 401 : 200).render('admin/login', {
        pageTitle: 'Hotel Admin Login - GreenTravel',
        hotels: readHotels(),
        loginError,
        selectedHotelId
    });
}

exports.getAdminDashboard = (req, res) => {
    const hotel = getAuthorizedHotel(req);
    if (!hotel) {
        return renderLogin(res);
    }

    res.render('admin/dashboard', {
        pageTitle: `${hotel.name} - Hotel Back-Office Portal`,
        hotel,
        saved: req.query.saved === 'profile'
    });
};

exports.login = (req, res) => {
    const { hotelId, password } = req.body;
    const hotel = typeof hotelId === 'string'
        ? readHotels().find(item => item.id === hotelId)
        : null;

    if (!hotel || password !== DEMO_PASSWORD) {
        return renderLogin(res, 'The selected hotel or password is incorrect. Please try again.', hotelId);
    }

    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, hotel.id);
    res.setHeader('Set-Cookie', `hotel_admin_session=${token}; HttpOnly; SameSite=Lax; Path=/admin; Max-Age=28800`);
    res.redirect(303, '/admin');
};

exports.logout = (req, res) => {
    const token = getSessionToken(req);
    if (token) sessions.delete(token);
    res.setHeader('Set-Cookie', 'hotel_admin_session=; HttpOnly; SameSite=Lax; Path=/admin; Max-Age=0');
    res.redirect(303, '/admin');
};

exports.updateHotelProfile = (req, res) => {
    try {
        const authorizedHotel = getAuthorizedHotel(req);
        if (!authorizedHotel) {
            return res.status(401).send('Please sign in before editing hotel details.');
        }

        const fields = ['name', 'city', 'address', 'roomType', 'ecoRating', 'reviewQuote', 'image', 'ecoCertificates'];
        const fieldLabels = {
            name: 'hotel name',
            city: 'city',
            address: 'address',
            roomType: 'room type',
            ecoRating: 'eco rating',
            reviewQuote: 'guest review',
            image: 'image URL',
            ecoCertificates: 'eco certificates'
        };
        const values = {};
        for (const field of fields) {
            if (typeof req.body[field] !== 'string' || req.body[field].trim().length === 0) {
                return res.status(400).send(`Please provide ${fieldLabels[field]}.`);
            }
            values[field] = req.body[field].trim();
        }
        const maxLengths = { name: 120, city: 40, address: 250, roomType: 100, ecoRating: 100, reviewQuote: 200, image: 2048, ecoCertificates: 500 };
        if (fields.some(field => values[field].length > maxLengths[field])) {
            return res.status(400).send('One or more fields exceed the maximum allowed length.');
        }
        if (!['Bangkok', 'Chiang Mai', 'Phuket'].includes(values.city)) {
            return res.status(400).send('Please select a supported city.');
        }

        const stars = Number(req.body.stars);
        const rating = Number(req.body.rating);
        const price = Number(req.body.priceTHB);
        if (!Number.isInteger(stars) || stars < 1 || stars > 5
            || !Number.isFinite(rating) || rating < 0 || rating > 10
            || !Number.isFinite(price) || price <= 0) {
            return res.status(400).send('Please check the star rating, guest rating, and price.');
        }

        let imageUrl;
        try {
            imageUrl = new URL(values.image);
        } catch (error) {
            return res.status(400).send('Please enter a valid image URL (http or https).');
        }
        if (!['http:', 'https:'].includes(imageUrl.protocol) || imageUrl.username || imageUrl.password) {
            return res.status(400).send('The image URL must use http or https.');
        }

        const certificates = values.ecoCertificates.split(',')
            .map(certificate => certificate.trim())
            .filter(Boolean);
        if (certificates.length === 0) {
            return res.status(400).send('Please provide at least one eco certificate or initiative.');
        }

        const hotels = readHotels();
        const hotel = hotels.find(item => item.id === authorizedHotel.id);
        if (!hotel) return res.status(404).send('Hotel not found.');

        const previousPrice = Number(hotel.priceDiscountTHB || hotel.priceTHB);
        const priceMultiplier = Number.isFinite(previousPrice) && previousPrice > 0 ? price / previousPrice : 1;
        if (Number.isFinite(hotel.priceOriginalTHB)) {
            hotel.priceOriginalTHB = Math.round(hotel.priceOriginalTHB * priceMultiplier);
        }
        const scalePrices = item => {
            ['price', 'priceOriginal', 'totalWithTaxes'].forEach(key => {
                if (Number.isFinite(item[key])) item[key] = Math.round(item[key] * priceMultiplier);
            });
        };
        (hotel.rooms || []).forEach(room => {
            scalePrices(room);
            (room.plans || []).forEach(scalePrices);
        });

        Object.assign(hotel, {
            name: values.name,
            city: values.city,
            address: values.address,
            stars,
            rating,
            priceTHB: price,
            priceDiscountTHB: price,
            totalWithTaxesTHB: Math.round(price * 1.177),
            roomType: values.roomType,
            ecoRating: values.ecoRating,
            reviewQuote: values.reviewQuote,
            image: values.image,
            ecoCertificates: certificates
        });
        if (Array.isArray(hotel.gallery) && hotel.gallery.length > 0) {
            hotel.gallery[0] = values.image;
        }

        writeHotels(hotels);
        res.redirect(303, '/admin?saved=profile');
    } catch (error) {
        console.error('Error updating hotel profile:', error);
        res.status(500).send('Could not save hotel details.');
    }
};

exports.updateHotelCarbon = (req, res) => {
    try {
        const authorizedHotel = getAuthorizedHotel(req);
        if (!authorizedHotel) {
            return res.status(401).json({ success: false, message: 'Please sign in before saving carbon data.' });
        }

        const { hotelId, carbonMetrics } = req.body;
        if (hotelId !== authorizedHotel.id || !carbonMetrics || typeof carbonMetrics !== 'object') {
            return res.status(400).json({ success: false, message: 'Invalid hotel selection.' });
        }

        const metricFields = [
            'actual_co2_per_room_night_kg',
            'regional_benchmark_kg',
            'carbon_saved_per_night_kg',
            'saving_percentage',
            'equivalent_trees_yearly',
            'gross_total_co2e'
        ];
        if (typeof carbonMetrics.period !== 'string' || !/^\d{4}-\d{2}$/.test(carbonMetrics.period)
            || metricFields.some(field => !Number.isFinite(carbonMetrics[field]) || carbonMetrics[field] < 0)
            || carbonMetrics.regional_benchmark_kg <= 0) {
            return res.status(400).json({ success: false, message: 'Carbon metrics are missing or invalid.' });
        }

        const hotels = readHotels();
        const hotel = hotels.find(item => item.id === authorizedHotel.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found.' });
        }

        hotel.carbonRating = `-${carbonMetrics.saving_percentage}% CO₂e/night`;
        hotel.carbonMetrics = {
            actualCO2PerNight: carbonMetrics.actual_co2_per_room_night_kg,
            regionalBenchmark: carbonMetrics.regional_benchmark_kg,
            carbonSavedPerNight: carbonMetrics.carbon_saved_per_night_kg,
            savingPercentage: carbonMetrics.saving_percentage,
            treesEquiv: carbonMetrics.equivalent_trees_yearly,
            grossTotalCO2: carbonMetrics.gross_total_co2e,
            lastUpdated: carbonMetrics.period
        };

        writeHotels(hotels);
        res.json({
            success: true,
            message: `Carbon data for ${hotel.name} has been updated.`,
            updatedHotel: hotel
        });
    } catch (error) {
        console.error('Error updating carbon metrics:', error);
        res.status(500).json({ success: false, message: 'Could not save carbon data.' });
    }
};
