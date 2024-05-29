const express = require('express');
const router = express.Router();
const path = require('path');
const dashboardController = require(path.join(__dirname, '..', '..', 'controllers', 'dashboardController'));
//const ROLES_LIST = require('../../config/roles_list');
//const verifyRoles = require('../../middleware/verifyRoles');

const styles = ['css/dashboard.css'];
const scripts = ['https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js', 'js/dashboard.js'];
const title = 'DASHBOARD';
router.get('/', async (req, res) => {
    // ${global.currentGroupID}
    // const allData = await dashboardController.getAllData(groupsID);
    const username = req.username.toUpperCase();

    res.render(path.join(__dirname, '..', '..', 'views', 'dashboard.ejs'), { 
        title: title,
        username: username,
        pageName: title,
        styles: styles, 
        scripts: scripts
    });
});


router.post('/groups', dashboardController.getGroups);

router.post('/allData', dashboardController.getAllData);

router.post('/setPaid', dashboardController.setPaid);

module.exports = router;
