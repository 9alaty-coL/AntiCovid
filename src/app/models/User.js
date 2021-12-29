const db = require('../../config/db');

const tbName = 'Users';

class Users {    
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in User/All: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in User/One: ' + err.message);
            return null;
        }
    }

    async userLocationHistory(userID) {
        try {
            const res = await db.one('P_ID', userID, 'LocationHistory');
            return res;
        } catch (err) {
            console.log('error in User/LocationHistory: ' + err.message);
            return null;
        }
    }

    async relate(arrayID) {
        try {
            let res = [];
            for (let element of arrayID) {
                let user = await db.one('P_ID', element, tbName);
                if (user != null) res.push(user);
            }
            return res;
        } catch (err) {
            console.log('error in User/Rows: ' + err.message);
            return null;
        }
    }
}

module.exports = new Users();
