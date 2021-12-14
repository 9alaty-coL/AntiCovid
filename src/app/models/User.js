const db = require('../../config/db');

const tbName = 'Users';

class Users {
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in User: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in User: ' + err.message);
            return null;
        }
    }

    async insert(value) {
        try {
            const res = await db.insert(value, tbName);
            return res;
        } catch (err) {
            console.log('error in User: ' + err.message);
            return null;
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

module.exports = new Users();
