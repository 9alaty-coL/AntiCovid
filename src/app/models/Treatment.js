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

}

module.exports = new Users();
