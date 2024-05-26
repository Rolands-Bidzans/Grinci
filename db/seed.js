const path = require('path');
const database = require(path.join(__dirname, 'Database'));
async function seedDatabase() {
    try {
        database.open();

     // Insert initial users
        const user1 = await database.insertUser('Rolandinio', 'Rolandsnorigas@gmail.com', '123');
        await database.insertUser('Kopninio','Kopnins@gmail.com', '123');
        await database.insertUser('Velmerio','Velmeris@gmail.com', '123');

        // Insert initial member roles
        await database.insertMemberRoles(1, 'Admin');
        await database.insertMemberRoles(2, 'RW');
        await database.insertMemberRoles(3, 'R');

        // Insert initial groups
        const groupID = await database.insertGroups('RolandsGroup2');

        // Insert initial group members
        await database.insertGroupMembers(user1[0].id, groupID[0].id, 1);

        // Insert initial budget statuses
        await database.insertBudgetStatuses(1, 'Active');
        await database.insertBudgetStatuses(2, 'Inactive');

        // Insert initial budgets
        await database.insertBudgets('July 2024', groupID[0].id, 1, 23000, new Date(), new Date()) 

        // Insert initial monitorin emails
        const monitoringEmail = await database.insertMonitoringEmail('Rolandsnorigas@gmai.com', groupID[0].id) 

        // Insert initial tags
        const tagDefault = await database.insertTags(groupID[0].id, 'No tag') 
        // const tag = await database.insertTags(groupID[0].id, 'Elektrība') 

        // Insert initial invoice
        const invoice = await database.insertInvoice(200, false, groupID[0].id, monitoringEmail[0].id, tagDefault[0].id) 

        // Insert initial items
        await database.insertItems('Elektrība', invoice[0].id)

    } 
    catch (error) {
        console.error('Error seeding database', error);
    }
    finally {
        // Close the database connection
        await database.close();
        console.log('Database seeded successfully');
    }
}

seedDatabase();