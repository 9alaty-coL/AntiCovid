const db = require('../../config/db');

const tbName = 'Products';

class Products {
    
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

    async relate(arrayID) {
        try {
            let res = [];
            for (let element of arrayID) {
                let product = await db.one('Product_ID', element, tbName);
                if (product != null) res.push(product);
            }
            return res;
        } catch (err) {
            console.log('error in User/Rows: ' + err.message);
            return null;
        }
    }
}

module.exports = new Products();