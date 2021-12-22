const db = require('../config/db')

module.exports = async (tbName)=>{

    let _id, res;

    do {
        _id = Math.floor(Math.random() * 1000);
        res = await db.one('_id', _id, tbName);
    }while(res)
    return _id;

}