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
    console.log("Connected to mysql database");       
});

// Create database if not exist
con.query("CREATE DATABASE IF NOT EXISTS todo_backend", function (err, result) {
if (err) throw err;
console.log("Database created");
});

//Create tables
var sql = "CREATE TABLE IF NOT EXISTS todo_backend.todos (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), ordering INT, completed VARCHAR(255))";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Tables created");
});
