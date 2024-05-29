const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));
const { validateEmail} = require(path.join(__dirname, 'dataValidation'));

const addEmail = async (req, res) => {
    const groupID = req.cookies.currentGroupID;

    try {
        await db.open();

        // Validate email
        if(!validateEmail(req.body.email)) return res.status(400).json({ 'message': 'Invalid email format.'});

        // Email is defined
        const duplicate = await db.customQuery(`SELECT email FROM "MonitoringEmails" WHERE email = '${req.body.email}' AND group_id = '${groupID}'`);
        if (duplicate.length) return res.status(409).json({ 'message': 'This email is already in use'});

        //Indsert new Email
        await db.insertMonitoringEmail(req.body.email ,groupID, true,  req.body.startDate, req.body.client_id ,req.body.client_secret ,req.body.refresh_token);

        return res.status(200).json({ 'added': true});
    } catch (error) {
        console.error('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}

const getAllEmails = async (req, res) => {
    const groupID = req.cookies.currentGroupID;

    try {
        await db.open();
        
        // Get emails for the group
        const allEmails = await db.customQuery(`SELECT "MonitoringEmails".id, "MonitoringEmails".email, "MonitoringEmails".is_enabled, TO_CHAR("MonitoringEmails".added_at, 'dd/MM/yyyy') as added_at, "MonitoringEmails".next_checking_date, 
                                                (SELECT COUNT(*) FROM "Invoices" WHERE "Invoices".monitoring_email = "MonitoringEmails".id)
                                                FROM "MonitoringEmails" 
                                                WHERE "MonitoringEmails".group_id = '${groupID}'
                                                GROUP BY "MonitoringEmails".id, "MonitoringEmails".email, "MonitoringEmails".is_enabled, "MonitoringEmails".added_at, "MonitoringEmails".next_checking_date
                                                ORDER BY "MonitoringEmails".added_at DESC`);

        return res.status(200).json({ 'data': allEmails});
    } catch (error) {
        console.error('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}

const changeStatus = async (req, res) => {
    const groupID = req.cookies.currentGroupID;

    try {
        await db.open();
        const oppositeStatus = (req.body.status == 1)? 0 : 1;
        await db.customQuery(`UPDATE "MonitoringEmails" 
                            SET is_enabled = '${oppositeStatus}'
                            WHERE email = '${req.body.email}' AND group_id = '${groupID}'`);

        return res.status(200).json({ 'changed': true});
    } catch (error) {
        console.error('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}

const removeEmail = async (req, res) => {
    const groupID = req.cookies.currentGroupID;
    console.log(req.body.email)
    try {
        await db.open();

        const monitoringEmailID = await db.customQuery(`SELECT id FROM "MonitoringEmails" WHERE email = '${req.body.email}' AND group_id = '${groupID}'`);
        const invoiceID = await db.customQuery(`SELECT id FROM "Invoices" WHERE monitoring_email = '${monitoringEmailID[0].id}'`);

        for (const invoice of invoiceID) {
            try {
                await db.customQuery(`DELETE FROM "Items" WHERE invoice_id=$1`, [invoice.id]);
            } catch (error) {
                console.error('Error deleting items:', error);
            }
        }

        for (const email of monitoringEmailID) {
            await db.customQuery(`DELETE FROM "Invoices" WHERE monitoring_email = '${email.id}'`);
            await db.customQuery(`DELETE FROM "MonitoringEmails" WHERE email = '${req.body.email}' AND group_id = '${groupID}'`);
        }

        return res.status(200).json({ 'deleted': true});
    } catch (error) {
        console.error('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}


module.exports = { addEmail, getAllEmails, changeStatus, removeEmail};
