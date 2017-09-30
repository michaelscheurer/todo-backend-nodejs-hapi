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
//todos
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".todos (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), ordering INT, completed VARCHAR(255))";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table todos created");
});
//tags
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".tags (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255))";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table tags created");
});
//todos_tags
var sql = "CREATE TABLE IF NOT EXISTS "+databaseName+".todos_tags (id INT AUTO_INCREMENT PRIMARY KEY, todo_id INT, tag_id INT)";
con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table todos_tags created");
});

/**
 * 
 * DATABASE OPERATIONS TODOS TABLE
 * 
 */

/**
 * Insert a new todo
 * 
 * @param {string} title
 * @param {int} ordering
 * @param {string} completed
 * @returns
 */
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
    var sql = "SELECT * FROM " + databaseName + ".todos";
    con.query(sql, function (err, result) {
        if(err) throw err;            
        
        callback(processSqlToArray(result));
    });
};

//get a specific todo by id using callback function
exports.getTodo = function(callback, todoId) {
    var sql = "SELECT * FROM " + databaseName +".todos WHERE id = '" + todoId + "'";
    con.query(sql, function (err, result) {
        if(err) throw err;
        
        callback(processSqlToArray(result));
    });
}

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

/**
 * 
 * DATABASE OPERATIONS TAGS TABLE
 * 
 */

exports.getAllTags = function (callback) {
    var sql = "SELECT * FROM " + databaseName + ".tags";
    con.query(sql, function (err, result) {
        if(err) throw err;        
        
        callback(processSqlTagToArray(result));
    });
};

exports.getTag = function (callback, tagId) {
    var sql = "SELECT * FROM " + databaseName + ".tags WHERE id = '" + tagId + "'";
    con.query(sql, function (err, result) {
       if(err) throw err;
       
       callback(processSqlTagToArray(result));
    });
};

exports.insertTag = function (title) {
    var sql = "INSERT INTO "+databaseName+".tags (title) VALUES('"+title+"')";
    con.query(sql, function (err, result) {
       if(err) throw err;
       console.log("Tag inserted");
       return result;
    });
};

//update tag by id
exports.updateTag = function (callback, tagId, title) {
    var sql = "UPDATE " + databaseName + ".tags SET title = '" + title + "' WHERE id = '" + tagId + "'";
    con.query(sql, function (err, result) {
        if(err) throw err;
        
        console.log("Tag updated");
        callback(result);
    });
};

//helper function to generate proper tag json object
function processSqlTagToArray (results) {
    var tags = [];
    
    results.forEach(function(item) {
       var tag = {
            title: item.title,
            url: server.info.uri + '/tags/' + item.id
       };
       
       tags.push(tag);
    });
    
    return tags;
};