const express = require('express');
const router = express.Router();
const path = require('path');

/*const styles = ['css/dashboard.css'];*/
const styles = [];
const scripts = [];
const title = 'MEMBERS';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'members.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});


module.exports = router;
