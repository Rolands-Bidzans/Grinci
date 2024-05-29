const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const getAllData = async (req, res) => {
    groupID = req.cookies.currentGroupID;

    try {
        // Open the database connection
        await db.open();

        const paidAndUnpaidQuery = `SELECT is_paid, ROUND(COUNT(*) * 1.0 / (SELECT COUNT(*) FROM "Invoices" WHERE group_id = '${groupID}'), 2) AS proportion
                                    FROM "Invoices"
                                    WHERE group_id = '${groupID}'
                                    GROUP BY is_paid;`;

        let paidAndUnpaidInvoices = await db.customQuery(paidAndUnpaidQuery);

        // console.log(paidAndUnpaidInvoices);

        const invoicesGroupedByTagQuery = `SELECT color, name, COUNT(*)
                                            FROM "Invoices", "Tags"
                                            WHERE "Tags".id = "Invoices".tag_id and "Invoices".group_id = '${groupID}'
                                            GROUP BY tag_id, color, name;`;

        const invoicesGroupedByTag = await db.customQuery(invoicesGroupedByTagQuery);
        

        // console.log(invoicesGroupedByTag);
        const today = new Date();
        const lastMonth = new Date(today);

        // Set the date to exactly one month before
        lastMonth.setMonth(today.getMonth() - 1);

        // Handle the case where the month subtraction results in an invalid date
        if (lastMonth.getMonth() === today.getMonth()) {
            lastMonth.setDate(0); // Set to the last day of the previous month
        }



        const todayFormatted = getFormattedDate(today);
        const lastMonthFormatted = getFormattedDate(lastMonth);

        let tomorrow = today;
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowFormatted = getFormattedDate(tomorrow);

        const invoicesReceivedQuery = `WITH date_series AS (
                                            SELECT generate_series::date AS date
                                            FROM generate_series(
                                                '${lastMonthFormatted}'::date,
                                                '${todayFormatted}'::date,
                                                '1 day'::interval
                                            )
                                        ),
                                        invoice_data AS (
                                            SELECT 
                                                TO_CHAR(created_at, 'DD.MM.YYYY') AS full_date,
                                                TO_CHAR(created_at, 'DD.MM') AS invoice_day,
                                                COUNT(*) AS invoice_count
                                            FROM "Invoices"
                                            WHERE created_at BETWEEN '${lastMonthFormatted}' AND '${tomorrowFormatted}' AND group_id = '${groupID}'
                                            GROUP BY TO_CHAR(created_at, 'DD.MM.YYYY'), TO_CHAR(created_at, 'DD.MM')
                                        )
                                        SELECT 
                                            TO_CHAR(date_series.date, 'DD.MM.YYYY') AS full_date,
                                            TO_CHAR(date_series.date, 'DD.MM') AS invoice_day,
                                            COALESCE(invoice_data.invoice_count, 0) AS invoice_count
                                        FROM date_series
                                        LEFT JOIN invoice_data ON date_series.date = TO_DATE(invoice_data.full_date, 'DD.MM.YYYY')
                                        ORDER BY date_series.date;`;

        const invoicesReceived = await db.customQuery(invoicesReceivedQuery);
        
        
        const budgetQuery = `SELECT SUM(amount)
                        FROM "Budgets"
                        WHERE "Budgets".group_id = '${groupID}' AND "Budgets".status = '1'
                        `;
        let budget = await db.customQuery(budgetQuery);
        budget = (budget[0].sum)? budget[0].sum : 0;

        const spentMoneyQuery = `SELECT SUM(total_amount)
                                FROM "Invoices"
                                WHERE "Invoices".group_id = '${groupID}' AND
                                paid_date BETWEEN '${lastMonthFormatted}' AND '${tomorrowFormatted}'
                                `;
        let spentMoney = await db.customQuery(spentMoneyQuery);
        spentMoney = (spentMoney[0].sum)? spentMoney[0].sum : 0;

        budget -= spentMoney;
        budget = Math.ceil(budget * 100) / 100;
        
        const unpaidInvoicesQuery = `SELECT COUNT(*)
                                    FROM "Invoices"
                                    WHERE "Invoices".group_id = '${groupID}' AND "Invoices".is_paid = 'false' AND
                                    due_date <= '${tomorrowFormatted}'
                                    `;
        let  unpaidInvoices = await db.customQuery(unpaidInvoicesQuery);
        
        unpaidInvoices = (unpaidInvoices[0].count)? unpaidInvoices[0].count : 0;


        const invoicesQuery = `SELECT id, supplier_name, TO_CHAR(due_date, 'DD.MM.YYYY') as due_date, total_amount
                            FROM "Invoices"
                            WHERE "Invoices".group_id = '${groupID}' AND "Invoices".is_paid = 'false'
                            ORDER BY due_date
                            `;
        let invoices = await db.customQuery(invoicesQuery);


        return res.status(200).json({ 'paidAndUnpaidInvoices': paidAndUnpaidInvoices, 'invoicesGroupedByTag': invoicesGroupedByTag, 'invoicesReceived': invoicesReceived, 'budget': budget, 'spentMoney' : spentMoney, 'endDate': todayFormatted, 'startDate' : lastMonthFormatted, 'unpaidInvoices': unpaidInvoices, 'invoices': invoices});
        
    } catch (error) {
        console.log('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        // Close the database connection
        await db.close();
    }
}

const getGroups = async (req, res) => {
    try {
        const email = req.email;
        await db.open();

        const query = `SELECT email, password, member_role, username, "Groups".name, "Groups".id
                       FROM "Users", "GroupMembers", "Groups"
                       WHERE "Users".id = "GroupMembers".user_id and "Groups".id = "GroupMembers".group_id and email = '${email}'
                       ORDER BY member_role DESC`
        const groupsAnswer = await db.customQuery(query);

        let groups = [];
        for (const group of groupsAnswer) {
            groups.push({
                id: group.id,
                name: group.name,
                role: group.member_role
            });
        }
        
        return res.status(200).json({ 'groups': groups});
    } catch (error) {
        console.log('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}


const setPaid = async (req, res) => {
    const groupID = req.cookies.currentGroupID;
    try {
        await db.open();
        const now = new Date();
        const isoString = now.toISOString();

        await db.customQuery(`UPDATE "Invoices" 
                    SET is_paid = 'true', paid_date = '${isoString}'
                    WHERE id = '${req.body.invoiceID}' AND group_id = '${groupID}'`);

        return res.status(200).json({ 'message': 'invoice status changed'});
    } catch (error) {
        console.log('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}


module.exports = { getGroups, getAllData, setPaid};