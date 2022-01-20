const db = require('../../config/db');

const tbName = 'Province';

class Province {    
    async one(ProvinceID) {
        try {
            let res = await db.one("ProvinceID", ProvinceID, tbName);
            return res;
        } catch (err) {
            console.log('error in Province/One: ' + err.message);
            return null;
        }
    }

    async all() {
        try {
            let res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Province/All: ' + err.message);
            return null;
        }
    }
}

module.exports = new Province();