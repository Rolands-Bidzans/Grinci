const express = require('express');
const router = express.Router();
const path = require('path');

/*const styles = ['css/dashboard.css'];*/
const styles = [];
const scripts = [];
const title = 'BUDGET';
router.get('/', (req, res) => {
    res.render(path.join(__dirname, '..', '..', 'views', 'budget.ejs'), {
        title: title,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});


module.exports = router;
