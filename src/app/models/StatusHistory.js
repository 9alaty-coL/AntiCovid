const db = require('../../config/db');

const tbName = 'StatusHistory';

class StatusHistory {    
    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in StatusHistory/One: ' + err.message);
            return null;
        }
    }

    async append(conditionValue, object) {
        try {
            await db.append('P_ID', conditionValue, object, tbName);
            console.log("StatusHistory: ", conditionValue);
            console.log("StatusHistory: ", object);
            return null;
        } catch (err) {
            console.log('error in StatusHistory/Append: ' + err.message);
            return null;
        }

    }

    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in StatusHistory/All: ' + err.message);
        }
    }
}

module.exports = new StatusHistory();