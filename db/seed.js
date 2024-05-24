const path = require('path');
const database = require(path.join(__dirname, 'Database'));
async function seedDatabase() {
    try {
        database.open();
        // Insert initial users
        const user1 = await database.insertUser('Rolandsnorigas@gmail.com', '123', 'Rolands', 'Bidzans');
        await database.insertUser('Kopnins@gmail.com', '123', 'Andrejs', 'Kopnins');
        await database.insertUser('Velmeris@gmail.com', '123', 'Reinis', 'Velmeris');

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
        await database.insertBudgets('July 2024', 23000, new Date(), new Date(), groupID[0].id, 1) 

        database.close();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database', error);
    }
}

seedDatabase();