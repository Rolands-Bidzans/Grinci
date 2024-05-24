const express = require('express');
const router = express.Router();
const path = require('path');
const cookieController = require(path.join(__dirname, '..', '..', 'controllers','cookieController'));


router.get('/sidebarStatus', cookieController.getSidebarStatus);
router.post('/sidebarStatus', (req, res) => {
    const sidebarStatus = req.body.sidebarStatus; 
    global.sidebarStatus = sidebarStatus;
    res.status(200).json({ 'message': `Sidebar status changed successfully: ${sidebarStatus}!` });
});

module.exports = router;