/**
 * manages the mysql database operations
 */
var mysql = require('mysql');

    //database credentials
    var con = mysql.createConnection( {
        host: "localhost",
        user: "todo-backend",
        password: "todo-backend"
    });
    
    //create database connection
    con.connect(function(err) {
       if(err) throw err;
       console.log("Connected");
    });
    
    