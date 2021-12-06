const client = require('../../config/db');

class User {
    async all() {
        try {
            let res = await client.query('SELECT * FROM "Users"');
            return res;
        } catch (error) {
            console.log('error in User: ', error.message);
        }
    }

    async getUserByUN(username) {
        try {
            let res = await client.query(
                'SELECT * FROM "Users" WHERE username = $1',
                [username],
            );
            return res.rows[0];
        } catch (error) {
            console.log('error in User: ', error.message);
        }
    }

    async getUserById(_id) {
        try {
            let res = await client.query(
                'SELECT * FROM "Users" WHERE _id = $1',
                [_id],
            );
            return res.rows[0];
        } catch (error) {
            console.log('error in User: ', error.message);
        }
    }
}

module.exports = new User();
