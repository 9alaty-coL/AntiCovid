// require('dotenv').config();

const pgp = require('pg-promise')({
    capSQL: true,
});

const cn = {
    user: 'sdpirshaxpgwud',
    host: 'ec2-174-129-16-183.compute-1.amazonaws.com',
    database: 'd55vb335pru2ea',
    password:
    process.env.POSTGRE_PASSWORD,
    port: 5432,
    max: 30, // use up to 30 connections
    ssl: { rejectUnauthorized: false },

    // "types" - in case you want to set custom type parsers on the pool level
};

const db = pgp(cn);

// const client = new pg.Client({
//     user: 'sdpirshaxpgwud',
//     host: 'ec2-174-129-16-183.compute-1.amazonaws.com',
//     database: 'd55vb335pru2ea',
//     password:
//         '6de3f165f80e3dcf9e4d253ac0b0675ce5fed3c1203e0cffcb16c99d132482d6',
//     port: 5432,
//     ssl: { rejectUnauthorized: false },
// });

// client.connect();

class dbQuery {
    async all(tbName) {
        try {
            const res = await db.any(`SELECT * FROM "${tbName}"`);
            return res;
        } catch (err) {
            console.log('error in db/all: ' + err.message);
        }
    }

    async top(tbName, total) {
        try {
            const res = await db.any(`SELECT * FROM "${tbName}" LIMIT ${total}`);
            return res;
        } catch (err) {
            console.log('error in db/top: ' + err.message);
        }
    }

    async order(colName, byOrder, tbName) {
        try {
            const res = await db.any(`SELECT * FROM "${tbName}" ORDER BY "${colName}" ${byOrder}`);
            return res;
        } catch (err) {
            console.log('error in db/order: ' + err.message);
        }
    }

    async one(colName, cprName, tbName) {
        try {
            const res = await db.oneOrNone(
                `SELECT * FROM "${tbName}" WHERE "${colName}" = '${cprName}'`,
            );
            return res;
        } catch (err) {
            console.log('error in db/one: ' + err.message);
            return null;
        }
    }

    async rows(colName, cprName, tbName) {
        try {
            const res = await db.any(
                `SELECT * FROM "${tbName}" WHERE "${colName}" = '${cprName}'`,
            );
            return res;
        } catch (err) {
            console.log('error in db/rows: ' + err.message);
            return null;
        }
    }

    async cols(colName, tbName) {
        try {
            const res = await db.any(
                `SELECT "${colName}" FROM "${tbName}"`,
            );
            return res;
        } catch (err) {
            console.log('error in db/cols: ' + err.message);
            return null;
        }
    }

    async likes(colName, cprName, tbName) {
        try {
            const res = await db.any(`SELECT * FROM "${tbName}" WHERE "${colName}" LIKE '%' || '${cprName}' || '%'`);
            return res;
        } catch (err) {
            console.log('error in db/likes: ' + err.message);
        }
    }

    async insert(value, tbName) {
        try {
            const res = await db.one(
                pgp.helpers.insert(value, null, tbName) + ' RETURNING *',
            );
            return res;
        } catch (err) {
            console.log('error in db/insert: ' + err.message);
            return null;
        }
    }

    async update(idName, value, tbName) {
        try {
            // const table = new pgp.helpers.TableName({ table: tbName , schema: 'public'});
            const condition = pgp.as.format(
                'WHERE "' + idName + '" = ${' + idName + '}',
                value,
            );
            let qr = pgp.helpers.update(value, null, tbName) + condition + ' RETURNING *';
            let res = await db.one(qr);
            return res;
        } catch (err) {
            console.log('error in db/update: ' + err.message);
            return null;
        }
    }

    async append(conditionCol, conditionValue, object, tbName) {
        try {
            for (const appCol in object) {
                await db.oneOrNone(`UPDATE public."${tbName}" SET "${appCol}" = array_append("${appCol}", '${object[appCol]}') WHERE "${conditionCol}" = ${conditionValue}`);
            }
            return null;
        } catch (err) {
            console.log('error in db/append: ' + err.message);
            return null;
        }
    }

    async delete(colName, cprName, tbName) {
        try {
            await db.oneOrNone(
                `DELETE FROM "${tbName}" WHERE "${colName}" = '${cprName}'`,
            );
            return 0;
        } catch (err) {
            console.log('error in db/delete: ' + err.message);
            return null;
        }
    }

    async maximum(colName, tbName) {
        try{
            let res = await db.one(`SELECT MAX("${colName}") FROM public."${tbName}"`);
            return res.max;
        }catch(err){
            console.log('error db/maximum: ' + err.message);
            return null;
        } 
    }
}

module.exports = new dbQuery();
