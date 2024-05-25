const express = require('express');
const router = express.Router();
const path = require('path');
const invoiceController = require(path.join(__dirname, '..', '..', 'controllers', 'invoiceController'));

/*const styles = ['css/dashboard.css'];*/
const styles = ['css/invoice.css'];
const scripts = ['js/invoice.js'];
const title = 'INVOICE';
router.get('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'invoice.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});

router.post('/', invoiceController.getInvoices);

router.delete('/', (req, res) => {
    res.render(path.join(__dirname, '..', '..', 'views', 'invoice.ejs'), {
        title: title,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});


module.exports = router;
