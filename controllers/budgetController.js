const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

const addBudget = async (req, res) => {
    const groupID = req.cookies.currentGroupID;

    if(req.body.startdatetime >= req.body.enddatetime) return res.status(409).json({ 'message': 'Data is not correct'});
    try {
        await db.open();

        // Budget is defined
        const duplicate = await db.customQuery(`SELECT id FROM "Budgets" WHERE group_id = '${groupID}'`);
        if (duplicate.length){ //budget exists
            await db.customQuery(`UPDATE "Budgets" 
                        SET 
                            name = '${req.body.title}',
                            amount = '${req.body.amount}',
                            budget_active_from = '${req.body.startdatetime}',
                            budget_active_to= '${req.body.enddatetime}'
                        WHERE id = '${duplicate[0].id}' AND group_id = '${groupID}'`);
        }else{  // Create new budget
            await db.insertBudgets(req.body.title, groupID, 1, req.body.amount, req.body.startdatetime, req.body.enddatetime);
        }

        return res.status(200).json({ 'added': true});
    } catch (error) {
        console.log('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}

const changeBudgetStatus = async (req, res) => {
    const groupID = req.cookies.currentGroupID;

    try {
        await db.open();
        const oppositeStatus = (req.body.status == 1)? 2 : 1;
        await db.customQuery(`UPDATE "Budgets" 
                            SET status = '${oppositeStatus}'
                            WHERE group_id = '${groupID}'`);

        return res.status(200).json({ 'changed': true});
    } catch (error) {
        console.log('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}

const getAllBudgets = async (req, res) => {
    const groupID = req.cookies.currentGroupID;

    try {
        await db.open();
        
        // Get budget for group
        const allBudgets = await db.customQuery(`SELECT 
                                                id, name, amount, TO_CHAR(budget_active_from, 'DD.MM.YYYY') AS budget_active_from, TO_CHAR(budget_active_to, 'DD.MM.YYYY') AS budget_active_to, group_id, status
                                                FROM "Budgets" WHERE group_id = '${groupID}'`);

        return res.status(200).json({ 'data': allBudgets});
    } catch (error) {
        console.log('Error during database operations', error);
        return res.status(500).json({ 'Error': error});
    } finally {
        await db.close();
    }
}


module.exports = { addBudget, changeBudgetStatus, getAllBudgets};