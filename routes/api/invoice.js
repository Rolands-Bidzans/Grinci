const express = require('express');
const router = express.Router();
const path = require('path');
const invoiceController = require(path.join(__dirname, '..', '..', 'controllers', 'invoiceController'));

/*const styles = ['css/dashboard.css'];*/
const styles = ['css/invoice.css'];
const scripts = ['js/invoice.js'];
const title = 'INVOICE';
router.get('/', async (req, res) => {
    const email = req.email;
    const invoices = await invoiceController.getInvoices(email);
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'invoice.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts,
        invoices: invoices
    });
});


router.post('/', invoiceController.getInvoices);

router.delete('/', (req, res) => {
    const username = req.username.toUpperCase();
    res.render(path.join(__dirname, '..', '..', 'views', 'invoice.ejs'), {
        title: title,
        username: username,
        pageName: title,
        styles: styles,
        scripts: scripts
    });
});


module.exports = router;
