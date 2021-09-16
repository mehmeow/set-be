var express = require('express');
var router = express.Router();
const { Pool, Client } = require('pg');
const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// get db
router.get('/db', function (req, res, next) {
  client.connect();
  client.query('SELECT * FROM products;', (err, res) => {
    console.log('res',{DB_URL:process.env.USER_ID,err,res});
    // if (err) throw err;
    // for (let row of res.rows) {
    //   console.log('row', JSON.stringify(row));
    // }
    client.end();
  });
  res.status(200).send({ test: 'ok lah' });
});

module.exports = router;
