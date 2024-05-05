// seed.js
async function seedDatabase() {
    const database = require("./Database");
    try {
        // Insert initial users
        await database.insertUser('Rolands', 'Bidzans', 'Rolandsnorigas@gmail.com', '123');
        await database.insertUser('Andrejs', 'Kopnins', 'Kopnins@gmail.com', '123');
        await database.insertUser('Reinis', 'Velmeris', 'Velmeris@gmail.com', '123');
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database', error);
    }
}

seedDatabase();