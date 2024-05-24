const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    /*const authHeader = req.headers.authorization || req.headers.Authorization;*/

    const authHeader = req.cookies.jwt;

    if (!authHeader?.startsWith('Bearer ')) return res.redirect('/');  //unauthorized

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.redirect('/'); // invalid token
            req.email = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next(); 
        }
    );
};

module.exports = verifyJWT;