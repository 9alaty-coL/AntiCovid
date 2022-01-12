const db = require('../../config/db');

const tbName = 'Accounts';

class Users {
    async all() {
        try {
            const res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Authen: ' + err.message);
        }
    }

    async one(colName, cprName) {
        try {
            const res = await db.one(colName, cprName, tbName);
            return res;
        } catch (err) {
            console.log('error in Authen: ' + err.message);
            return null;
        }
    }

    async insert(value) {
        try {
            const res = await db.insert(value, tbName);
            return res;
        } catch (err) {
            console.log('error in Authen: ' + err.message);
            return null;
        }
    }

    async getUserByUN(username) {
        try {
            let res = await db.one('username', username, tbName);
            return res;
        } catch (error) {
            console.log('error in Authen: ', error.message);
        }
    }

    async getUserById(_id) {
        try {
            let res = await db.one('_id', _id, tbName);
            return res;
        } catch (error) {
            console.log('error in Authen: ', error.message);
        }
    }

    async getManagerAccounts(){
        try {
            let res = await db.rows('role', 'manager', tbName)
            return res;
        } catch (error) {
            console.log('error in Authen: ', error.message);
        }
    }

    async update(value){
        try{
            const res = await db.update('_id', value, tbName);
            return res;
        }catch(err){
            console.log('error in account update: ' + err.message);
            return null;
        }
    }
    
    async nextID() {
        try{
            const res = await db.maximum('_id', tbName);
            return res + 1;
        }catch(err){
            console.log('error in account next: ' + err.message);
            return null;
        }
    }
}

module.exports = new Users();
