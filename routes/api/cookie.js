const express = require('express');
const router = express.Router();
const path = require('path');


//SIDE BAR COOKIES
router.post('/sidebarStatus', (req, res) => {
    const sidebarStatus = req.body.sidebarStatus; 
    global.sidebarStatus = sidebarStatus;
    res.status(200).json({ 'message': `Sidebar status changed successfully: ${sidebarStatus}!` });
});

//CURRENT GROUP ID COOKIES

router.post('/getCurrentGroupID', (req, res) => {
    const currentUserGrroup = req.cookies.currentGroupID;
    res.status(200).json({ 'currentGroupID': currentUserGrroup});
});

router.post('/setCurrentGroupID', (req, res) => {
    const currentGroupID = req.body.currentGroupID; 
    res.cookie('currentGroupID', currentGroupID , { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ 'message': `Current group changed successfully: ${currentGroupID}!` });
});

module.exports = router;