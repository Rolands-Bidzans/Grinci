const path = require('path');
const bcrypt = require('bcrypt');
const db = require(path.join(__dirname, '..', 'db', 'Database'));
const { validatePassword, validateEmail, validateUsername } = require(path.join(__dirname, 'dataValidation'));

const handleNewUser = async (req, res) => {
    let { email, pwd, username } = req.body;

    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });
    email = email.toLowerCase();
    // Validate username
    if (!validateUsername(username)) {
        return res.status(400).json({ message: 'Invalid username format.' });
    }

    // Validate email
    if(validateEmail(email)) return res.status(400).json({ 'message': 'Invalid email format.'});

    // Validate password
    const passwordValidation = validatePassword(pwd);
    if (!passwordValidation.valid) return res.status(400).json({ 'message': passwordValidation.message });

    try {
        await db.open();
        // check for duplicate usernames in the db
        const duplicate = await db.customQuery(`SELECT email FROM "Users" WHERE email = '${email}'`);
        if (duplicate.length) return res.status(409).json({ 'message': 'Such user already exists' }); //Conflict 

        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //store the new user
        const newUser = await db.insertUser(email, hashedPwd);

        //store the new group
        const newGroup = await db.insertGroups('firstGroup');

        //store the new group member
        await db.insertGroupMembers(newUser[0].id, newGroup[0].id, 1);

        res.status(201).json({ 'success': 'New user created!' });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    } finally {
        // Close the database connection
        await db.close();
    }
}

module.exports = { handleNewUser };