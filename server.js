const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Import Controllers & Routes
const hotelRoutes = require('./routes/hotelRoutes');
const flightRoutes = require('./routes/flightRoutes');
const adminController = require('./controllers/adminController');

// Routes Mapping
app.get('/', (req, res) => res.redirect('/hotels'));
app.use('/hotels', hotelRoutes);
app.use('/flights', flightRoutes);

// Back-Office Admin Routes (จัดการคาร์บอนโรงแรม)
app.get('/admin', adminController.getAdminDashboard);
app.post('/admin/login', adminController.login);
app.post('/admin/logout', adminController.logout);
app.post('/admin/hotels/profile', adminController.updateHotelProfile);
app.post('/admin/hotels/carbon', adminController.updateHotelCarbon);

app.listen(PORT, () => {
    console.log(`🌿 Green Travel Server running at: http://localhost:${PORT}`);
    console.log(`🔑 Hotel Back-Office Admin: http://localhost:${PORT}/admin`);
});