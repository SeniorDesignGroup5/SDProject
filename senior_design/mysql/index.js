app = require('../app');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var express   =    require("express");
var mysql     =    require('mysql');
var crypto = require('crypto');


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'garaginator',
    debug    :  false
});


var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha256 = function(password, salt){
    const hash = crypto.createHash('sha256');/** Hashing algorithm sha256 */
    hash.update(salt+password)
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};








//When a car enters update garage column
app.post('/carEnters',function(req,res){

  console.log("we here");

  var garageName = req.body.garageID;

  pool.getConnection(function(err,connection){


          if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }

          console.log("we here");

          var sql = "UPDATE garages SET number_of_current_vehicles = number_of_current_vehicles + 1 WHERE garage_name = ?";

          
          connection.query(sql, garageName,function(err,rows){
          
            connection.release();
            
            if(err)
              res.status(403).send('Error with garageID');
            else
              res.status(200).send("Success");

        });

  });

});

//when a car leaves update the garages column
app.post('/carLeaves',function(req,res){

  console.log("we here");

  var garageName = req.body.garageID;

  pool.getConnection(function(err,connection){


          if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }

          console.log("we here");

          var sql = "UPDATE garages SET number_of_current_vehicles = number_of_current_vehicles - 1 WHERE garage_name = ? AND number_of_current_vehicles > 0";

          
          connection.query(sql, garageName,function(err,rows){
          
            connection.release();
            console.log(err);
            if(err)
              res.status(403).send('Error with garageID');
            else
              res.status(200).send("Success");

        });

  });

});



//logs a user into the application
app.post('/saveSpot',function(req,res){

  console.log("testing git");

  var username = req.body.userid;
  var password = req.body.pass;
  var garage_ID = req.body.garageID;
  var floorLevel = req.body.floorLevel;
  var currentSpot = req.body.spotNumber;

  console.log(username);
  console.log(password);
  console.log(garage_ID);
  console.log(floorLevel);
  console.log(currentSpot);

  if((!username) || (!password) || (!garage_ID) || (!floorLevel) || (!currentSpot)){
    console.log("check worked");
    res.status(403).send('Missing Required Paramters');
    return;
  }

  pool.getConnection(function(err,connection){

          if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }


          var sql = "SELECT salt,passcode FROM users WHERE account_id = ?";

          //get salt
          connection.query(sql, username,function(err,rows){
            //connection.release();
            
           if(err || !(rows.length > 0)){
              res.status(403).send('User doesnt exit');
              return;
           }
              

            var salt = rows[0].salt;

            var enc_pass = sha256(password, salt);
            var passcode = rows[0].passcode;

            console.log(enc_pass);
            console.log(passcode);

            if(enc_pass.passwordHash == passcode){
	              console.log("weeeee goooooood");
	              console.log(req.body.garageID);

            		
                var saveSpot = "INSERT INTO vehicle_location (account_id, garage_id, floor_level, current_numbered_spot) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE garage_id=?, floor_level=?, current_numbered_spot=?";
                var inserts = [username, garage_ID, floorLevel, currentSpot, garage_ID, floorLevel, currentSpot];
                saveSpot = mysql.format(saveSpot, inserts);
                console.log(saveSpot);
           

                connection.query(saveSpot,function(err,rows){

                  if(err){
                    connection.release();
                    res.status(403).send('Could not save spot');
                    return;
                  }
                  else{
                    connection.release();
                    res.send('Spot Saved');
                  }
                });  
            }
            else{
              connection.release();
              res.status(400).send("password incorrect");
            }
      
        });

  });

});

//create a user account
app.post('/create',function(req,res){

  console.log("we here");


  var username = req.body.userid;
  var password = req.body.pass;

  var salt = genRandomString(16);
  var passwordData = sha256(password, salt);

  console.log('Passwordhash = '+passwordData.passwordHash);
  console.log('nSalt = '+passwordData.salt);

  pool.getConnection(function(err,connection){

          if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }   

          console.log('connected as id ' + connection.threadId);

          var sql = "INSERT INTO users (account_id, salt, passcode) VALUES ?";

          var values = [
            [username, passwordData.salt, passwordData.passwordHash]
          ];

          connection.query(sql, [values] ,function(err, result){
              connection.release();
              if(!err) {

                  console.log("Number of records inserted: " + result.affectedRows);
                  res.send('Success');

              }
              else{

                  if(err.code == 'ER_DUP_ENTRY'){
                    res.status(404).send('Duplicate User');
                  }
              }
          });
    });
});


//Recieve garageID send back that garages max amount of levels
app.put('/garageLevels',function(req,res){

  console.log("we here");

  var garageName = req.body.garageID;

  pool.getConnection(function(err,connection){

      if (err) {
        connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }

      var sql = "SELECT number_of_floors FROM garages WHERE garage_name = ?";

      
      connection.query(sql, garageName,function(err,rows){
      
        connection.release();
        
        if(err)
          res.status(403).send('Error with garageID');
        else
          res.status(200).send(rows[0]);

    });
  });
});





app.post('/retrieveSpot',function(req,res){

  console.log("testing git");

  var username = req.body.userid;
  var password = req.body.pass;
  

  console.log(username);
  console.log(password);

  if((!username) || (!password)){
    console.log("check worked");
    res.status(403).send('Missing Required Paramters');
    return;
  }

  pool.getConnection(function(err,connection){

          if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }


          var sql = "SELECT salt,passcode FROM users WHERE account_id = ?";

          //get salt
          connection.query(sql, username,function(err,rows){
            //connection.release();
            
           if(err){
              res.status(403).send('User doesnt exit');
              return;
           }
              

            var salt = rows[0].salt;

            var enc_pass = sha256(password, salt);
            var passcode = rows[0].passcode;

            console.log(enc_pass);
            console.log(passcode);

            if(enc_pass.passwordHash == passcode){
                console.log("weeeee goooooood");
                console.log(req.body.garageID);
   
                var retrieveSpot = "SELECT garage_id, floor_level, current_numbered_spot FROM vehicle_location WHERE account_id = ?";
                var inserts = [username];
                retrieveSpot = mysql.format(retrieveSpot, inserts);
                console.log(retrieveSpot);
           

                connection.query(retrieveSpot,function(err,rows){

                  if(err){
                    connection.release();
                    res.status(403).send('Could not retrieve spot');
                    return;
                  }
                  else{
                    connection.release();
                    res.send(rows);
                  }
                });
                 
            }
            else{
              connection.release();
              res.status(400).send("password incorrect");
            }
      
        });

  });

});



//When a car enters update garage column
app.get('/garageData',function(req,res){

  

  pool.getConnection(function(err,connection){


          if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
          }

          console.log("we here");

          var sql = "SELECT garage_name, number_of_spots, number_of_current_vehicles FROM garages";
         
          connection.query(sql,function(err,rows){
          
            connection.release();
            
            if(err)
              res.status(404).send("Unable to find garage data");
            else
              res.status(200).send(rows);

        });

  });

});
