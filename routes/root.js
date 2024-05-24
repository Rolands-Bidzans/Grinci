const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
require('dotenv').config();

router.get('^/$|/index(.html)?', authController.redirectLogin);

module.exports = router;





/*router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, 'new-page.html'); // 302 by default
});*/