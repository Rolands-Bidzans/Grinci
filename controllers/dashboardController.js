const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

async function getAllData(groupID) {

    try {
        await db.open();

        const paidAndUnpaidQuery = `SELECT is_paid, ROUND(COUNT(*) * 1.0 / (SELECT COUNT(*) FROM "Invoices" WHERE group_id = '${groupID}'), 2) AS proportion
                                    FROM "Invoices"
                                    WHERE group_id = '${groupID}'
                                    GROUP BY is_paid;`
        let paidAndUnpaidInvoices = await db.customQuery(paidAndUnpaidQuery);



        const invoicsGroupedByTagQuery = `SELECT color, name, COUNT(*)
                                        FROM "Invoices", "Tags"
                                        WHERE "Tags".id = "Invoices".tag_id and "Invoices".group_id = '${groupID}'
                                        GROUP BY tag_id, color, name`
        const invoicsGroupedByTag = await db.customQuery(invoicsGroupedByTagQuery);

        return { paidAndUnpaidInvoices, invoicsGroupedByTag};
    } catch (error) {
        console.error('Error during database operations', error);
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
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await db.close();
    }
}


module.exports = { getGroups, getAllData};