const db = require('../../config/db');

const tbName = 'TreatmentPlaces';

class Users {
    
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in User: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in User: ' + err.message);
            return null;
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

    async delete(colName, cprName){
        try{
            let res = await db.delete(colName, cprName, tbName);
            return res;
        }catch(err){
            console.log('error: ' + err.message);
            return null;
        }
    }

    async getTreatmentById(_id) {
        try {
            let res = await db.one('_id', _id, tbName);
            return res;
        } catch (error) {
            console.log('error in Treatment getTreatmentById: ', error.message);
        }
    }

    async update(value){
        try{
            const res = await db.update('_id', value, tbName);
            return res;
        }catch(err){
            console.log('error in treatment update: ' + err.message);
            return null;
        }
    }

}

module.exports = new Users();
