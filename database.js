/**
 * manages the mysql database operations
 */
var mysql = require('mysql');

const databaseName = "todo_backend";

//database credentials
var con = mysql.createConnection( {
    host: "localhost",
    user: "todo-backend",
    password: "todo-backend"
});

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
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".todos (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), ordering INT, completed VARCHAR(255))";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Tables created");
});

//insert a new todo
exports.insertTodo = function (title, ordering, completed) {
    var sql = "INSERT INTO "+databaseName+".todos (title, ordering, completed) VALUES('"+title+"', '"+ordering+"', '"+completed+"')";
    con.query(sql, function (err, result) {
       if(err) throw err;
       console.log("Todo inserted");
       return result;
    });
};

//get all todos using callback function
exports.getAllTodos = function (callback) {
    var sql = "SELECT * FROM "+databaseName+".todos";
    con.query(sql, function (err, result) {
        if(err) throw err;            
        
        callback(processSqlToArray(result));
    });
};

//helper function. Brings sql request into the right order for the API
function processSqlToArray(results) {
    var todos = [];
    
    results.forEach(function(item) {
        
        var todo = {
            title: item.title,
            completed: (item.completed === 'true'),
            order: item.ordering,
            url: server.info.uri + '/todos/' + item.id
        };
        
        todos.push(todo);
    });
    
    return todos;
};