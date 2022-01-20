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
            console.log('error in treatment update: ' + err.message);
            return null;
        }
    }
    async delete(colName, cprName){
        try{
            let res = await db.delete(colName, cprName, tbName);
            return res;
        }catch(err){
            console.log('error: ' + err.message);
            return null;
        }
    }
    async getProductById(Product_ID) {
        try {
            let res = await db.one('Product_ID', Product_ID, tbName);
            return res;
        } catch (error) {
            console.log('error in Treatment getTreatmentById: ', error.message);
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

    async nextID() {
        try{
            const res = await db.maximum('P_ID', tbName);
            return res + 1;
        }catch(err){
            console.log('error in product next: ' + err.message);
            return null;
        }
    }
}

module.exports = new Products();