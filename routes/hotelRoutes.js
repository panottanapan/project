const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// 1. หน้าแรกโรงแรม (/hotels)
router.get('/', hotelController.getHotelHome);

// 2. หน้าผลการค้นหา (/hotels/search) - วางก่อน /:id เสมอ
router.get('/search', hotelController.searchHotels);

// 3. หน้าชำระเงิน (/hotels/checkout) - วางก่อน /:id เสมอ
router.get('/checkout', hotelController.getCheckoutPage);
router.post('/checkout', hotelController.processBooking);

// 4. หน้ารายละเอียดโรงแรมตาม ID (/hotels/:id) - ต้องวางล่างสุดเสมอ
router.get('/:id', hotelController.getHotelDetail);

module.exports = router;