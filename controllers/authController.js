const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

const handleLogin = async (req, res) => {

    let { email, pwd, username } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    email = email.toLowerCase();
    try {
        await db.open();

        const query = `SELECT email, password, member_role, username, "Groups".name, "Groups".id
                       FROM "Users", "GroupMembers", "Groups"
                       WHERE "Users".id = "GroupMembers".user_id and "Groups".id = "GroupMembers".group_id and email = '${email}'
                       ORDER BY member_role DESC`
        const users = await db.customQuery(query);

        let groups = [];
        for (const user of users) {
            groups.push({
                id: user.id,
                name: user.name,
            });
        }

        if (users.length === 0) return res.status(401).json({ 'message': 'The email address or password is incorrect. Please retry...' }); //Unauthorized
        // evaluate password
        const match = await bcrypt.compare(pwd, users[0].password);

        if (match) {
            // create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": users[0].email,
                        "username": users[0].username,
                        "role": users[0].member_role,
                        "groups": groups
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1200s' }
            );
           
            const refreshToken = jwt.sign(
                { "email": users[0].email,
                    "username": users[0].username,
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            const updateQuery = `UPDATE "Users"
                                SET refresh_token = '${refreshToken}'
                                WHERE email = '${users[0].email}'`;

            await db.customQuery(updateQuery);

            res.cookie('jwt', `Bearer ${accessToken}`, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.cookie('refreshToken', `${refreshToken}`, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

            return res.status(200).json({
                redirect: true,
                redirectUrl: '/dashboard',
                accessToken: accessToken,
                groups: groups
            });
        } else {
            res.status(401).json({ 'message': 'Incorrect password!' });
        }
    } catch (error) {
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await db.close();
    }
}

const redirectLogin = async (req, res) => {
    const authHeader = req.cookies.jwt;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.render(path.join(__dirname, '..', 'views', 'index.ejs'));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.render(path.join(__dirname, '..', 'views', 'index.ejs'));
            return res.redirect('/dashboard');
        }
    );
}

module.exports = { handleLogin, redirectLogin };