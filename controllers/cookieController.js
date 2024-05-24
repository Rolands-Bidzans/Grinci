const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');

const getSidebarStatus = (req) => {
    return req.cookies.sidebarStatus;
}

const setSidebarStatus = (req, res) => {
    const sidebarStatus = req.body.sidebarStatus; 
    console.log(sidebarStatus);
    res.cookie('sidebarStatus', sidebarStatus, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    return sidebarStatus;
}

module.exports = { getSidebarStatus, setSidebarStatus };