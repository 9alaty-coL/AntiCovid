const db = require('../../config/db');

const tbName = 'Packages';

class Packages {
    
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Package/All: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in Package/One: ' + err.message);
            return null;
        }
    }

    async relate(arrayID) {
        try {
            let res = [];
            for (let element of arrayID) {
                let packages = await db.one('Packages_ID', element, tbName);
                if (packages != null) res.push(packages);
            }
            return res;
        } catch (err) {
            console.log('error in Package/Rows: ' + err.message);
            return null;
        }
    }

    async update(value){
        try{
            const res = await db.update('P_ID', value, tbName);
            return res;
        }catch(err){
            console.log('error in Package/update: ' + err.message);
            return null;
        }
    }
}

module.exports = new Packages();