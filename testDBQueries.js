// test.js
const db = require('./db/Database');

const testDatabaseOperations = async () => {
    try {
        // Insert a user
        const insertResult = await db.selectQuery('SELECT * FROM "Users"');
        console.log(`Inserted ${insertResult} user(s)`);

        // Get all users
        const users = await db.getAllUsers();
        console.log('Users:', users);
    } catch (error) {
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await db.close();
    }
};

testDatabaseOperations();