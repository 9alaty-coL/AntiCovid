const db = require('../../config/db');

const tbName = 'Ward';

class Ward {    
    async one(ProvinceID, DistrictID, WardID) {
        try {
            let byPro = await db.rows("ProvinceID", ProvinceID, tbName);
            let byDis = byPro.filter(g => g.DistrictID === DistrictID);
            let byWard = byDis.filter(g => g.WardID === WardID);
            if (byWard !== null) return byWard[0];
            else return null;
        } catch (err) {
            console.log('error in Ward/One: ' + err.message);
            return null;
        }
    }

    // async all(ProvinceID, DistrictID) {
    //     try {
    //         let byPro = await db.rows("ProvinceID", ProvinceID, tbName);
    //         let byDis = byPro.filter(g => g.DistrictID === DistrictID);
    //         return byDis;
    //     } catch (err) {
    //         console.log('error in Ward/All: ' + err.message);
    //         return null;
    //     }
    // }

    async all() {
        try {
            let res = await db.all(tbName);
            return res;
        } catch (err) {
            console.log('error in Ward/All: ' + err.message);
            return null;
        }
    }
}

module.exports = new Ward();