const express = require('express');
const router = express.Router();
const path = require('path');
const emailController = require(path.join(__dirname, '..', '..', 'controllers', 'emailController'));

/*const styles = ['css/dashboard.css'];*/
const styles = ['css/email.css'];
const scripts = ['js/email.js'];
const title = 'EMAIL';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'email.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});

router.post('/addEmail', emailController.addEmail);
router.post('/getAllEmails', emailController.getAllEmails);

router.post('/changeStatus', emailController.changeStatus);
router.post('/removeEmail', emailController.removeEmail);




module.exports = router;
