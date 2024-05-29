const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));


// Gets invoices for the group that the user is currently in
const getInvoices = async (email) => {
    try {
        //TODO pielikt klāt filtru pēc grupas: group_id = req.cookies.currentGroupID
        await db.open();
        const selectQuery = `SELECT i.id AS invoice_id, i.*, json_agg(it.*) AS items
        FROM "Invoices" i
        JOIN "Groups" g ON i.group_id = g.id
        JOIN "GroupMembers" gm ON gm.group_id = g.id
        JOIN "Users" u ON u.id = gm.user_id
        LEFT JOIN "Items" it ON it.invoice_id = i.id
        WHERE u.email = $1
        GROUP BY i.id;`;
        
        const invoices = await db.customQuery(selectQuery, [email]);
        return invoices;
    } catch (error) {
        console.error('Error during database operations', error);
        throw error;
    } finally {
        await db.close();
    }
}

const deleteInvoices = async (req, res) => {
    const { invoiceIds } = req.body;

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

const updateInvoiceStatus = async (invoiceId, fieldsToUpdate) => {
    try {
        await db.open();
        const updatedInvoice = await db.updateInvoice(invoiceId, fieldsToUpdate);
        return updatedInvoice;
    } catch (error) {
        console.error('Error updating invoice status', error);
        throw error;
    } finally {
        await db.close();
    }
}

module.exports = { getInvoices, updateInvoiceStatus };