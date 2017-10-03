/**
 * initializes the database
 */
var mysql = require('mysql');

const databaseName = "todo_backend";

//database credentials
var con = mysql.createConnection( {
    host: "localhost",
    user: "todo-backend",
    password: "todo-backend"
});

exports.con = con;
exports.databaseName = databaseName;

//create database connection
con.connect(function(err) {
    if(err) throw err;
    console.log("Connected to mysql");       
});

// Create database if not exist
con.query("CREATE DATABASE IF NOT EXISTS "+databaseName, function (err, result) {
if (err) throw err;
console.log("Database created");
});

//Create tables
//todos
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".todos (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), ordering INT, completed VARCHAR(255))";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table todos created");
});

//tags
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".tags (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) UNIQUE)";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table tags created");
});

//todos_tags
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".todos_tags (todo_id INT, tag_id INT, PRIMARY KEY (todo_id, tag_id), FOREIGN KEY(todo_id) REFERENCES " + databaseName + ".todos(id) ON DELETE CASCADE, FOREIGN KEY(tag_id) REFERENCES " + databaseName + ".tags(id) ON DELETE CASCADE)";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table todos_tags created");
});