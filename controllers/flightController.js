const flightModel = require('../models/flightModel');

exports.getFlightsPage = (req, res) => {
    const rawFromParam = req.query.from || 'Bangkok';
    const rawToParam = req.query.to || 'Chiang Mai';

    const normalizeCity = (str) => {
        if (!str) return 'Bangkok';
        const s = str.toLowerCase();
        if (s.includes('chiang')) return 'Chiang Mai';
        if (s.includes('phuket')) return 'Phuket';
        if (s.includes('krabi')) return 'Krabi';
        if (s.includes('bangkok')) return 'Bangkok';
        return 'Bangkok';
    };

    const originCity = normalizeCity(rawFromParam);
    const destCity = normalizeCity(rawToParam);

    const partnerRoutes = flightModel.getPartnerRoutes(destCity, originCity);
    const destData = flightModel.getDestinationActivities(destCity);

    res.render('pages/flights', {
        pageTitle: `Low-Emission Flights from ${originCity} to ${destCity} | GreenTravel`,
        selectedOriginCity: originCity,
        selectedDestCity: destCity,
        partnerRoutes: partnerRoutes,
        destData: destData
    });
};