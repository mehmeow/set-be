var express = require('express');
var router = express.Router();
require('dotenv').config();

const { Pool, Client } = require('pg');
const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

/* GET users listing. */
router.get('/', function (req, res, next) {
  client.query('SELECT * FROM cart;', (err, d) => {
    if (err) throw err;
    // send response
    res.status(200).send(d.rows);
  });
});

module.exports = router;
