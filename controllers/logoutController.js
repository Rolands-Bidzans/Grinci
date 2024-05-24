const path = require('path');
const db = require(path.join(__dirname, '..', 'db', 'Database'));

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.redirect('/'); //No content 204
    const refreshToken = cookies.jwt;

    try {
        await db.open();

        const email = req.email;
        if (!email) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.redirect('/'); // 204
        }

        // Delete refreshToken in db
        const deleteTokenQuery = `UPDATE "Users"
                                SET refresh_token = ''
                                WHERE email = '${email}'`;

        await db.customQuery(deleteTokenQuery);

        // Refresh token in cookies
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        res.redirect('/');; // 204
    } catch (error) {
        console.error('Error during database operations', error);
    } finally {
        // Close the database connection
        await db.close();
    }
}

module.exports = { handleLogout }