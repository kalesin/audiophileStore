create table users (
	id SERIAL PRIMARY KEY,
	username varchar(50) UNIQUE,
	hash varchar(100) NOT NULL
);
create table tokens (
	id SERIAL PRIMARY KEY,
	username varchar(50) UNIQUE,
	token varchar(200) NOT NULL,
	isResetToken boolean NOT NULL
);
create table addresses (
	id SERIAL PRIMARY KEY,
	order_id int NOT NULL,
	is_shipping_address boolean NOT NULL,
	phone varchar(100) NOT NULL,
	name varchar(100) NOT NULL,
	address varchar(100) NOT NULL,
	zip varchar(100) NOT NULL,
	city varchar(100) NOT NULL,
	country varchar(100) NOT NULL
);
create table items (
	id SERIAL PRIMARY KEY,
	order_id int NOT NULL,
	item_name varchar(100) NOT NULL,
	item_amount int NOT NULL
);
create table orders (
	id SERIAL PRIMARY KEY,
	username varchar(50) NOT NULL,
	payment_received varchar(50) NOT NULL,
	email_sent boolean NOT NULL,
	order_total int NOT NULL
);
