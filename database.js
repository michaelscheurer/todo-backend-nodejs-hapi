/**
 * 
 * Handles all database requests
 * 
 */

var init_database = require("./initialize_database");
var con = init_database.con;
var databaseName = init_database.databaseName;

//tag a todo with (optional) multiple tags
/**
 * @todo: check if the combination of todo_id and tag_id exists
 * @todo: check, if todo_id exists
 * @todo: create new tag, if not exists
 * @todo: return json result to callback function
 */
exports.tagTodo = function (callback, todoId, tags) {
    splitedTags = tags.split(",");   
    
    //Check each tag, if already in table.
    splitedTags.forEach( function (item) {
        item = item.trim();
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

//List all x.entries from a y.id
exports.getAllOf = function (callback, asTitles, table, ofIdTableSingular, id) {
    var sql = "SELECT " + getAs(table, asTitles) 
            + " FROM " + databaseName + ".todos_tags JOIN " + databaseName + "." + table 
            + " ON todos_tags." + table.slice(0, -1) + "_id = " + table + ".id  WHERE todos_tags." + ofIdTableSingular + "_id = '" + id + "'";

    con.query(sql, function (err, result) {
       if(err) throw err;
        
        result = processResult(result, table); 

        callback(result);
    });    
};

//helper function for getAllOf
function getAs(table, asTitles) {
    var sql = table + ".id AS id, ";
    
    asTitles.forEach(function(item) {
        sql += table + "." + item + " AS " + item + ", ";
    });
    
    return sql.slice(0, -2);
}

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

//get
exports.getEntries = function (callback, withWhereClause, table, id) {
    var sql = "SELECT * FROM " + databaseName + "." + table; 
    
    if(withWhereClause) {
        sql = sql + " WHERE id = '" + id + "'";
    }
    
    con.query(sql, function (err, result) {
       if(err) throw err;

       callback(processResult(result, table));
    });    
};


//helper function to generate proper tag json object
function processResult(results, table) {
    var entries = [];
    
    if(table == "tags") {
        results.forEach(function(item) {
            var tag = {
                title: item.title,
                url: server.info.uri + '/tags/' + item.id
            };

            entries.push(tag);
        });  
    }
    
    else {
        results.forEach(function(item) {        
            var todo = {
                title: item.title,
                completed: (item.completed === 'true'),
                order: item.ordering,
                url: server.info.uri + '/todos/' + item.id
            };

            entries.push(todo);
        });
    }
    
    return entries;
};

//update
exports.update = function (callback, setTitles, setValues, table, id) {
    var sql = "UPDATE " + databaseName + "." + table + " SET " + getSet(setTitles, setValues) + " WHERE id = '" + id + "'";
    
    con.query(sql, function (err, result) {
        if(err) throw err;
        
        console.log("Tag updated");
        callback(result);
    });
};

//helper function for update
function getSet(setTitles, setValues) {

    var sql = "";
    
    for(var i = 0; i < setTitles.length; i++) {
        sql += setTitles[i] + " = '" + setValues[i] + "', ";
    }
    
    sql = sql.slice(0, -2);
    return sql;
}