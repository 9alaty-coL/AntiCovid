const db = require('../../config/db');

const tbName = 'Managers';

class Managers {    
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Manager/All: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in Manager/One: ' + err.message);
            return null;
        }
    }
}

module.exports = new Managers();
