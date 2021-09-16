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

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// get products
router.get('/products', function (req, res, next) {
  client.query('SELECT * FROM products;', (err, d) => {
    if (err) throw err;
    // send response
    res.status(200).send(d.rows);

    // close connection
    // client.end();
  });
  
});

module.exports = router;
