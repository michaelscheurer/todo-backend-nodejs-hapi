var todoResourceSchema = Joi.object({
    title: Joi.string(),
    completed: Joi.boolean(),
    order: Joi.number().integer(),
    url: Joi.string()
});

var todoIdSchema = Joi.number().integer().positive()
    .required().description('The Todo ID');
    
exports.todoResourceSchema = todoResourceSchema;
exports.todoIdSchema = todoIdSchema;

//server.route({
//    method: 'GET',
//    path: '/todos/',
//    handler: function (request, reply) {
//        
//        function dbCallback(todos) {
//            reply(todos).code(200);
//        };
//        
//        database.getAllTodos(dbCallback);
//        
//    },
//    config: {
//        tags: ['api'],
//        description: 'List all todos',
//        plugins: {'hapi-swagger': {responses: {
//            200: {
//                description: 'Success',
//                schema: Joi.array().items(
//                    todoResourceSchema.label('Result')
//                )
//            }
//        }}}
//    }
//});

server.route({
    method: 'DELETE',
    path: '/todos/',
    handler: function (request, reply) {
        todos = {};
        reply();
    },
    config: {
        tags: ['api'],
        description: 'Delete all todos',
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'Todos deleted'}
        }}}
    }
});

//Tag a todo
server.route({
    method: 'POST',
    path: '/todos/{todo_id}',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(201);
        }
        
        database.tagTodo(dbCallback, request.params.todo_id, request.payload.titles);        
    },
    config: {
        tags: ['api'],
        description: 'Tag a todo (multiple tags comma separated. Tag which does not exist will be ignored)',
        validate: {
            params: {
                todo_id: todoIdSchema
            },
            payload: {
                titles: Joi.string().required()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            201: {
                description: 'Todo was taged',
                schema: todoResourceSchema.label('Result')
            }
        }}}
    }
});



server.route({
    method: 'PATCH',
    path: '/todos/{todo_id}',
    handler: function (request, reply) {
        todoId = request.params.todo_id;
        if (! (todoId in todos)) {
            reply().code(404);
        } else {
            for (var attrName in request.payload) {
                todos[todoId][attrName] = request.payload[attrName];
            }
            reply(getTodo(todoId)).code(200);
        }
    },
    config: {
        tags: ['api'],
        description: 'Update a given todo',
        validate: {
            params: {
                todo_id: todoIdSchema
            },
            payload: {
                title: Joi.string(),
                completed: Joi.boolean(),
                order: Joi.number()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: todoResourceSchema.label('Result')
            },
            404: {description: 'Todo not found'}
        }}}
    }
});

server.route({
    method: 'DELETE',
    path: '/todos/{todo_id}',
    handler: function (request, reply) {
        if( !(request.params.todo_id in todos)) {
            reply('Todo Not Found').code(404);
            return;
        }
        delete todos[request.params.todo_id];
        reply().code(204);
    },
    config: {
        tags: ['api'],
        description: 'Delete a given todo',
        validate: {
            params: {
                todo_id: todoIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'Todo deleted'},
            404: {description: 'Todo not found'}
        }}}
    }
});