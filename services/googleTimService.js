const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyAetxWea8fAdldEEfYGpr6--ox7Vjqhqec';

/**
 * ดึงค่าคาร์บอนฟุตพริ้นท์จาก Google Travel Impact Model API
 * @param {Array} flightsList - รายการเที่ยวบินที่ต้องการคำนวณ
 */
async function getFlightEmissionsFromTIM(flightsList) {
    const url = `https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key=${GOOGLE_API_KEY}`;

    // แปลงรูปแบบข้อมูลให้ตรงกับที่ Google TIM API ต้องการ
    const formattedFlights = flightsList.map(f => ({
        origin: f.originCode,             // เช่น 'DMK', 'BKK'
        destination: f.destCode,          // เช่น 'CNX'
        operatingCarrierCode: f.carrier, // เช่น 'DD' (Nok Air), 'VZ' (Vietjet)
        flightNumber: parseInt(f.flightNum) || 100,
        departureDate: f.date || { year: 2026, month: 10, day: 16 }
    }));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flights: formattedFlights })
        });

        if (!response.ok) {
            console.error('Google TIM API Error Response:', await response.text());
            return null;
        }

        const data = await response.json();
        return data.flightEmissions || [];
    } catch (error) {
        console.error('Error connecting to Google TIM API:', error);
        return null;
    }
}

module.exports = { getFlightEmissionsFromTIM };