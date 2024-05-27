const express = require('express');
const router = express.Router();
const path = require('path');
const cookieController = require(path.join(__dirname, '..', '..', 'controllers', 'cookieController'));
//const registerController = require(path.join(__dirname, '..', '..', 'controllers', 'auth', 'dashboardController'));
//const ROLES_LIST = require('../../config/roles_list');
//const verifyRoles = require('../../middleware/verifyRoles');
const styles = ['css/dashboard.css'];
const scripts = ['https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js', 'js/dashboard.js'];
const title = 'DASHBOARD';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'dashboard.ejs'), { 
        title: title,
        username: username,
        pageName: title,
        styles: styles, 
        scripts: scripts,
        groups: req.groups
    });
});


module.exports = router;
