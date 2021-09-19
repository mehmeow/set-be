# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Alternavitely you can open via Heroku:
[https://dream-lake-72835.herokuapp.com/](https://dream-lake-72835.herokuapp.com/) to view the app online

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Database

Using PostGresql. There are 3 tables:
`cart`: to store all cart/order details
`products`: to store all available products
`status_constant`: to store available status `created`, `confirmed`, `delivered`, `cancelled`

### status_constant

```sql
CREATE TABLE public.status_constant (
	status_id int4 NOT NULL,
	status_text varchar NULL
);
```

### cart

```sql
CREATE TABLE public.cart (
	order_id serial4 NOT NULL,
	product_id int4 NOT NULL,
	count int4 NULL DEFAULT 1,
	status_id int4 NOT NULL DEFAULT 1,
	"timestamp" timestamp NULL
);
```

### products

```sql
CREATE TABLE public.products (
	product_id serial4 NOT NULL,
	"name" text NULL,
	description text NULL,
	price numeric NULL
);
```