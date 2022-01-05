const db = require('../../config/db');
const strSup = require('../../utils/stringSupport')
const TreatmentPlacesModel = require('../models/TreatmentPlaces')

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

    async search(key) {
        try {
            if (key.length === 0) return null;

            // First condition
            let users = [];
            
            // Other condition
            for (let eachKey in key) {           
                let res = [];

                // Filter conditions
                if (eachKey === "P_FullName"|| eachKey === "P_Address" ) {
                    res = await db.likes(eachKey, key[eachKey],"Users");
                } else if (eachKey === "P_TreatmentPlace") {
                    let userTreatPlaceID = await db.all("Users")
                    for (let i = 0; i < userTreatPlaceID.length; i++) {
                        let treatmentPlace = (await TreatmentPlacesModel.one('_id', userTreatPlaceID[i].P_TreatmentPlace)).name
                        if (strSup.nonAccentVietnamese(treatmentPlace).includes(strSup.nonAccentVietnamese(key[eachKey]))) res.push(userTreatPlaceID[i])
                    }
                } else {
                    res = await db.rows(eachKey, key[eachKey], tbName);
                }

                // Null mean no result
                if (res === null) return [];

                if (users.length > 0) {
                    users = users.filter(user => res.some(re => re.P_ID === user.P_ID));
                }
                else {
                    users = res;                
                }
            }

            // Return
            return users;
        } catch (err) {
            console.log('error in User/Search: ' + err.message);
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
            console.log('error in User/updateUser: ' + err.message);
            return null;
        }
    }
}

module.exports = new Users();
