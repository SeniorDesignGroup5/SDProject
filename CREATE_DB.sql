drop database garaginator;
create database garaginator;

use garaginator;

CREATE TABLE users(
	account_id		INTEGER		NOT NULL PRIMARY KEY,
	salt			VARCHAR(16),
	passcode 		VARCHAR(256)	
);

CREATE TABLE garages(
	garage_id 		INTEGER		NOT NULL AUTO_INCREMENT,
	garage_name 	VARCHAR(20) 	NOT NULL,
	number_of_floors 	INTEGER 	NOT NULL,
	number_of_spots		INTEGER 	NOT NULL,
	number_of_current_vehicles INTEGER	NOT NULL,
	PRIMARY KEY(garage_id)
);

CREATE TABLE vehicle_location(
	account_id		INTEGER		NOT NULL,
	garage_id 		INTEGER		NOT NULL,
	floor_level		VARCHAR(10)     NOT NULL,
	current_numbered_spot	INTEGER NOT NULL, 
	PRIMARY KEY (account_id),
	FOREIGN KEY (account_id) REFERENCES users(account_id),
	FOREIGN KEY (garage_id) REFERENCES garages(garage_id)
);

CREATE TABLE day_parking_pass(
	account_id		INTEGER		NOT NULL,
	vehicle_make 	VARCHAR(20) NOT NULL,
	vehicle_model	VARCHAR(20)	NOT NULL,
	vehicle_color	VARCHAR(20) NOT NULL,
	license_plate	VARCHAR(20) NOT NULL,
	PRIMARY KEY (account_id),
	FOREIGN KEY (account_id) REFERENCES users(account_id)
);