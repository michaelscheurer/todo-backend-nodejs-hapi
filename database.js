var init_database = require("./initialize_database");
var con = init_database.con;
var databaseName = init_database.databaseName;

/**
 * 
 * TODOS TABLE
 * 
 */

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
//get all tags from database
exports.getAllTags = function (callback) {
    var sql = "SELECT * FROM " + databaseName + ".tags";
    con.query(sql, function (err, result) {
        if(err) throw err;        
        
        console.log("Read all tags from database");
        callback(processSqlTagToArray(result));
    });
};

//get a specific tag by id from database
exports.getTag = function (callback, tagId) {
    var sql = "SELECT * FROM " + databaseName + ".tags WHERE id = '" + tagId + "'";
    con.query(sql, function (err, result) {
       if(err) throw err;
       
       console.log("Get tag id " + tagId);
       callback(processSqlTagToArray(result));
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

/**
 * 
 * Database operations on the todos_tags table
 * 
 */

//tag a todo with (optional) multiple tags
/**
 * @todo: check if the combination of todo_id and tag_id exists
 * @todo: check, if todo_id exists
 * @todo: create new tag, if not exists
 * @todo: return json result to callback function
 */
exports.tagTodo = function (callback, todoId, tags) {
    splitedTags = tags.split(",");
    console.log(splitedTags);
    
    //Check each tag, if already in table.
    splitedTags.forEach( function (item) {
        var sql = "SELECT id FROM " + databaseName + ".tags WHERE title = '" + item + "'";
        con.query(sql, function (err, result) {
            if(err) throw err;
            
            result = JSON.parse(JSON.stringify(result));
            
            if(result.length != 0) {
                //insert into tags_todos
                var sqlTodosTags = "INSERT INTO " + databaseName + ".todos_tags (todo_id, tag_id) VALUES ('" + todoId + "', '" + result[0].id + "')";
                con.query(sqlTodosTags, function(err, resultTodosTags) {
                   if(err) throw err;                   
                });
            }
        });
    });  
    
    callback("success");
};

//List all todos with a specific tag
exports.getAllTodosOfTag = function (callback, tagId) {
    var sql = "SELECT todos_tags.tag_id AS todos_tagsId, todos.id AS id, todos.title AS title, todos.ordering AS ordering, todos.completed AS completed FROM " + databaseName + ".todos_tags JOIN " + databaseName + ".todos ON todos_tags.todo_id = todos.id  WHERE todos_tags.tag_id = '" + tagId + "'";
    con.query(sql, function (err, result) {
       if(err) throw err;
        result = processSqlToArray(result); 
        
        console.log(result);
        
        console.log("Getting all todos of the tag");
        callback(result);
    });
};


//List all tags of a todo
exports.getAllTagsOfTodo = function (callback, todoId) {
    var sql = "SELECT todos_tags.todo_id AS todos_tagsId, tags.id AS id, tags.title AS title FROM " + databaseName + ".todos_tags JOIN " + databaseName + ".tags ON todos_tags.tag_id = tags.id  WHERE todos_tags.todo_id = '" + todoId + "'";
    con.query(sql, function (err, result) {
       if(err) throw err;
        result = processSqlTagToArray(result);             
        
        console.log("Getting all tags of a todo");
        callback(result);
    });
};

/**
 * 
 *  common used queries
 * 
 */

//delete
exports.delete = function (callback, withWhereClause, table, id) {
    var whereClause = "WHERE id = '" + id + "'";
    
    var sql = "DELETE FROM " + databaseName + "."+table;
    
    if(withWhereClause) {
        sql = sql + " " + whereClause;
    }
    
    con.query(sql, function(err, result) {
       if(err) throw err;
       
       callback(result);
    });
};

//create
exports.insert = function (callback, rows, values, table) {

    var sql = "INSERT INTO "+databaseName+"." + table + " " + getRowDescription(rows) + " VALUES" + getSqlValues(values);
    
    con.query(sql, function (err, result) {
        if(err) throw err;
       
        callback(result);
    });
};

//helper function of insert function
function getRowDescription(rows) {
    var rowDescriptions = "(";

    rows.forEach(function(item) {
        rowDescriptions += item + ", ";
    });
    rowDescriptions = rowDescriptions.slice(0, -2);    
    
    return rowDescriptions += ")";
}

//helper function of insert function
function getSqlValues(values) {
    var sqlVAlues = "(";

    values.forEach(function(item) {
        sqlVAlues += "'" + item + "', ";        
    });
    
    sqlVAlues = sqlVAlues.slice(0, -2);
    
    return sqlVAlues + ")";
}