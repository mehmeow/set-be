var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

const { Pool, Client } = require('pg');
const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// general functions
function getSum(items, key) {
  return items.reduce(function (a, b) {
    return parseFloat(a) + parseFloat(b[key]);
  }, 0);
};

// const timestamp = new Date().getTime();

/* GET cart listing. */
router.get('/', function (req, res, next) {
  client.query(`SELECT * FROM cart
    LEFT JOIN products on (products.product_id = cart.product_id)
    LEFT JOIN status_constant on (status_constant.status_id = cart.status_id)
    WHERE cart.status_id = 1;
    `, (err, d) => {
    if (err) throw err;
    // handle cart data
    const cart = {
      count: d.rows.length,
      cart: d.rows,
      sum: getSum(d.rows, "price")
    }
    // send response
    res.status(200).send(cart);
  });
});

/* ADD cart listing. */
router.post('/addcart', function (req, res, next) {
  client.query(`INSERT INTO cart
    (product_id) VALUES (${req.body.product_id})
    RETURNING *;
    `, (err, d) => {
    if (err) throw err;
    // send response
    res.status(200).send({ inserted: true, order: d.rows[0] });
  });
});

/* REMOVE cart listing. */
router.delete('/removeone/:order_id', function (req, res, next) {
  let order_id = req.params.order_id;
  client.query(`DELETE FROM cart
    WHERE order_id=${order_id}
    RETURNING *;
    `, (err, d) => {
    if (err) throw err;
    // send response
    res.status(200).send({ removed: true, order: d.rows[0] });
  });
});

module.exports = router;

/* GET history listing. */
router.get('/history', function (req, res, next) {
  client.query(`SELECT * FROM cart
    LEFT JOIN products on (products.product_id = cart.product_id)
    LEFT JOIN status_constant on (status_constant.status_id = cart.status_id)
    WHERE cart.status_id != 1
    ORDER BY cart.order_id DESC;
    `, (err, d) => {
    if (err) throw err;
    // handle cart data
    const cart = {
      count: d.rows.length,
      cart: d.rows,
      sum: getSum(d.rows, "price")
    }
    // send response
    res.status(200).send(cart);
  });
});

/* ADD make payment listing. */
router.post('/makepayment/:rate?', async function (req, res, next) {
  // Math.random() < 0.5
  const rate = req.params.rate;
  let randAll = Math.random() < 0.5;
  let values = "";
  switch (rate) {
    case "Success":
      values = req.body.map(order => {
        return `(${order.order_id}, ${2})`;
      });
      break;

    case "Failed":
      values = req.body.map(order => {
        return `(${order.order_id}, ${4})`;
      });
      break;

    case "RandomEach":
      values = req.body.map(order => {
        let rand = Math.random() < 0.5;
        return `(${order.order_id}, ${rand ? 2 : 4})`;
      });
      break;

    default:
      values = req.body.map(order => {
        return `(${order.order_id}, ${randAll ? 2 : 4})`;
      });
      break;
  }

  const query = `UPDATE cart as x SET
  status_id = c.status_id
    FROM (values
      ${values.join(', ')} 
    ) as c(order_id, status_id) 
    WHERE c.order_id = x.order_id`;

  // res.status(200).send({ values, rate, query });
  client.query(`${query}
    RETURNING *;
    `, (err, d) => {
    if (err) throw err;
    // send response
    res.status(200).send({ inserted: true, order: d.rows[0] });
  });
});
