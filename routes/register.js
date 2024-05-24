const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const path = require('path');

// GET route for the register page
router.get('/', (req, res) => {
    res.render(path.join(__dirname, '..', 'views', 'register.ejs'), { messages: {} });
});

// POST route to handle new user registration
router.post('/', registerController.handleNewUser);

module.exports = router;