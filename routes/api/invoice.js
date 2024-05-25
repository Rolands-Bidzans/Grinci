const express = require('express');
const router = express.Router();
const path = require('path');
const invoiceController = require(path.join(__dirname, '..', '..', 'controllers', 'invoiceController'));

/*const styles = ['css/dashboard.css'];*/
const styles = ['css/invoice.css'];
const scripts = ['js/invoice.js'];
const title = 'INVOICE';
router.get('/', async (req, res) => {
    try {
        const email = req.email; // Assuming req.email contains the email address
        console.log(`user id is ${email}`)
        const invoices = await invoiceController.getInvoices(email);
        res.render(path.join(__dirname, '..', '..', 'views', 'invoice.ejs'), {
            title: title,
            pageName: title,
            styles: styles,
            scripts: scripts,
            invoices: invoices
        });
    } catch (error) {
        console.error('Error retrieving invoices', error);
        // Handle the error appropriately (e.g., render an error page)
        res.status(500).send('Internal Server Error');
    }
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
