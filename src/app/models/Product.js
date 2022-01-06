const db = require('../../config/db');

const tbName = 'Products';

class Products {
    
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Product/All: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in Product/One: ' + err.message);
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
            console.log('error in Product/Rows: ' + err.message);
            return null;
        }
    }

    async update(value){
        try{
            const res = await db.update('Product_ID', value, tbName);
            return res;
        }catch(err){
            console.log('error in Product/update: ' + err.message);
            return null;
        }
    }
}

module.exports = new Products();