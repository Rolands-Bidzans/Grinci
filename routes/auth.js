const express = require('express');
const router = express.Router();
const fsPromises = require('fs').promises;
const path = require('path');
const authController = require('../controllers/authController');


router.get('/', (req, res) => {
   res.render(path.join(__dirname, '..', 'views', 'auth.ejs'), { messages: {} });
});

router.post('/', authController.handleLogin, (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;