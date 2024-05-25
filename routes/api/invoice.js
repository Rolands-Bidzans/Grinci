const express = require('express');
const router = express.Router();
const path = require('path');

/*const styles = ['css/dashboard.css'];*/
const styles = [];
const scripts = [];
const title = 'INVOICE';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'invoice.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});


module.exports = router;
