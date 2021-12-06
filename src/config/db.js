const pg = require('pg');

const client = new pg.Client({
    user: 'sdpirshaxpgwud',
    host: 'ec2-174-129-16-183.compute-1.amazonaws.com',
    database: 'd55vb335pru2ea',
    password:
        '6de3f165f80e3dcf9e4d253ac0b0675ce5fed3c1203e0cffcb16c99d132482d6',
    port: 5432,
    ssl: { rejectUnauthorized: false },
});

client.connect();

module.exports = client;
