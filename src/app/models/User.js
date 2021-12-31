const db = require('../../config/db');

const tbName = 'Users';

class Users {    
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
                let user = await db.one('P_ID', element, tbName);
                if (user != null) res.push(user);
            }
            return res;
        } catch (err) {
            console.log('error in User/relate: ' + err.message);
            return null;
        }
    }

    async update(value){
        try{
            const res = await db.update('_id', value, tbName);
            return res;
        }catch(err){
            console.log('error in User/update: ' + err.message);
            return null;
        }
    }

    async updateUser(value){
        try{
            const res = await db.update('P_ID', value, tbName);
            return res;
        }catch(err){
            console.log('error in User/update: ' + err.message);
            return null;
        }
    }
}

module.exports = new Users();
