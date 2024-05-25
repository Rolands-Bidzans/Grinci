const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

const getInvoices = async (req, res) => {
    try {
        const email = req.email;
        console.log(email);
        await db.open();
        const selectQuery = `SELECT * FROM "Invoices" where email = '${email}'`;
        const users = await db.customQuery(selectQuery);
        return res.status(200).json({ 'message': users});

    } catch (error) {
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await db.close();
    }
}

const deleteInvoices = async (req, res) => {
    const { invoiceIds } = req.body; // Extract the invoice IDs from the request body

    if (!Array.isArray(invoiceIds)) {
        return res.status(400).json({ message: 'Invalid request format. Expected an array of invoice IDs.' });
    }

    try {
        await db.open();
        const deletedInvoices = await db.deleteInvoices(invoiceIds);
        return res.status(200).json({ message: 'Invoices deleted successfully', deletedInvoices });
    } catch (error) {
        console.error('Error during database operations', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await db.close();
    }
}

const updateInvoice = async (req, res) => {
    try {
        await db.open();
        // Saving refreshToken with current user
        const selectQuery = 'SELECT * FROM "Users"';
        const users = await db.customQuery(selectQuery);
        return res.status(200).json({ 'message': users});

    } catch (error) {
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await db.close();
    }
}

module.exports = { getInvoices };