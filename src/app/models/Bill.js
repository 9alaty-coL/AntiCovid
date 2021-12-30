const db = require('../../config/db');

const tbName = 'Bills';

class Bills {
    
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Bills: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in Bills: ' + err.message);
            return null;
        }
    }

    async rows(colName, cprName) {
        try {
            const res = await db.rows(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in Bills: ' + err.message);
            return null;
        }
    }

    async insert(value) {
        try {
            const res = await db.insert(value, tbName);
            return res;
        } catch (err) {
            console.log('error in Bills: ' + err.message);
            return null;
        }
    }

    async getBillsByUserID(B_UserID) {
        try {
            let res = await db.rows('B_UserID', B_UserID, tbName);
            return res;
        } catch (error) {
            console.log('error in Bills getBillsByUserID: ', error.message);
        }
    }

    async getBillById(B_ID) {
        try {
            let res = await db.one('B_ID', B_ID, tbName);
            return res;
        } catch (error) {
            console.log('error in Bills getBillById: ', error.message);
        }
    }

    async update(value){
        try{
            const res = await db.update('B_ID', value, tbName);
            return res;
        }catch(err){
            console.log('error in Bills update: ' + err.message);
            return null;
        }
    }

    async delete(colName, cprName){
        try{
            let res = await db.delete(colName, cprName, tbName);
            return res;
        }catch(err){
            console.log('error delete Bill: ' + err.message);
            return null;
        }
    }

}

module.exports = new Bills();
