const pgp = require('pg-promise')({
    capSQL: true,
});

const cn = {
    user: 'sdpirshaxpgwud',
    host: 'ec2-174-129-16-183.compute-1.amazonaws.com',
    database: 'd55vb335pru2ea',
    password:
        '6de3f165f80e3dcf9e4d253ac0b0675ce5fed3c1203e0cffcb16c99d132482d6',
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
            console.log('error: ' + err.message);
        }
    }

    async one(colName, cprName, tbName) {
        try {
            const res = await db.oneOrNone(
                `SELECT * FROM "${tbName}" WHERE "${colName}" = '${cprName}'`,
            );
            return res;
        } catch (err) {
            console.log('error : ' + err.message);
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
            console.log('error: ' + err.message);
            return null;
        }
    }

    async insert(value, tbName) {
        try {
            const res = await db.one(
                pgp.helpers.insert(value, null, tbName) + ' RETURNING *',
            );
            return res;
        } catch (err) {
            console.log('error: ' + err.message);
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
            console.log('error in db: ' + err.message);
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
            console.log('error: ' + err.message);
            return null;
        }
    }
}

module.exports = new dbQuery();
