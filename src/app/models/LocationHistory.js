const db = require('../../config/db');

const tbName = 'LocationHistory';

class LocationHistory {    
    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in LocationHistory/One: ' + err.message);
            return null;
        }
    }

    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in LocationHistory/All: ' + err.message);
        }
    }
}

module.exports = new LocationHistory();