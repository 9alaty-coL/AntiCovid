const db = require('../../config/db');

const tbName = 'District';

class District {    
    async one(ProvinceID, DistrictID) {
        try {
            let byDis = await db.rows("DistrictID", DistrictID, tbName);
            let filterPro = byDis.filter(g => g.ProvinceID === parseInt(ProvinceID));
            if (filterPro !== null) return filterPro[0];
            else return null;
        } catch (err) {
            console.log('error in District/One: ' + err.message);
            return null;
        }
    }

    // async all(ProvinceID) {
    //     try {
    //         let byPro = await db.rows("ProvinceID", ProvinceID, tbName);
    //         return filterPro;
    //     } catch (err) {
    //         console.log('error in District/All: ' + err.message);
    //         return null;
    //     }
    // }

    async all() {
        try {
            let res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in District/All: ' + err.message);
            return null;
        }
    }
}

module.exports = new District();