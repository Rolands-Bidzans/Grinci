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
        const tag = await database.insertTags(groupID[0].id, 'Elektrība') 

        // Insert initial invoice
        //async insertInvoice(sender_email, total_amount, is_paid, group_id, tag_id, monitoring_email, email_text=null, supplier_name=null, supplier_address=null, customer_name=null, customer_address=null, purchase_date=null, due_date=null, paid_date=null) {
        await database.insertInvoice('Karlis@dons.lv', 200, false, groupID[0].id, tag[0].id, monitoringEmail[0].id) 

        database.close();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database', error);
    }
}

seedDatabase();