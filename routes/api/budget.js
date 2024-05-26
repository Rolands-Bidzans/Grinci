const express = require('express');
const router = express.Router();
const path = require('path');

/*const styles = ['css/dashboard.css'];*/
const styles = [];
const scripts = [];
const title = 'BUDGET';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'budget.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts,
        groups: req.groups
    });
});


module.exports = router;
