const db = require('../../config/db');

const tbName = 'LocationHistory';

class Users {    
    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in User/One: ' + err.message);
            return null;
        }
    }
}

module.exports = new Users();