/**
 * 
 * @todo: update a given todo
 * @todo: list all todos
 */


//create a todo POST /todos/
server.route({
    method: 'POST',
    path: '/todos/',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(201);
        }        

        database.insert(
            dbCallback, 
            ["title", "ordering", "completed"], 
            [request.payload.title, request.payload.order || 0, request.payload.completed || false], 
            "todos"
        );
    },
    config: {
        tags: ['api'],
        description: 'Create a todo',
        validate: {
            payload: {
                title: Joi.string().required(),
                order: Joi.number().integer(),
                completed: Joi.boolean()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            201: {
                description: 'Created',
                schema: schemas.todoResourceSchema.label('Result')
            }
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
                todo_id: schemas.todoIdSchema
            },
            payload: {
                titles: Joi.string().required()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            201: {
                description: 'Todo was taged',
                schema: schemas.todoResourceSchema.label('Result')
            }
        }}}
    }
});

//list all todos GET /todos/
server.route({
    method: 'GET',
    path: '/todos/',
    handler: function (request, reply) {
        
        function dbCallback(todos) {
            reply(todos).code(200);
        };
        
        database.getEntries(dbCallback, false, "todos", null);        
    },
    config: {
        tags: ['api'],
        description: 'List all todos',
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: Joi.array().items(
                    schemas.todoResourceSchema.label('Result')
                )
            }
        }}}
    }
});

//Fetch a todo by id
server.route({
    method: 'GET',
    path: '/todos/{todo_id}',
    handler: function (request, reply) {
        
        function dbCallback(todos) {            
            reply(todos).code(200);
        };
        
        database.getEntries(dbCallback, true, "todos", request.params.todo_id);
    },
    config: {
        tags: ['api'],
        description: 'Fetch a given todo',
        validate: {
            params: {
                todo_id: schemas.todoIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: schemas.todoResourceSchema.label('Result')
            },
            404: {description: 'Todo not found'}
        }}}
    }
});

//Update a todo by id
server.route({
    method: 'PATCH',
    path: '/todos/{todo_id}',
    handler: function (request, reply) {
        
        function dbCallback(todos) {
            reply(todos).code(200);
        }
        
        database.update(
            dbCallback, 
            ["title", "ordering", "completed"], 
            [request.payload.title, request.payload.order, request.payload.completed], 
            "todos", 
            request.params.todo_id);
    },
    config: {
        tags: ['api'],
        description: 'Update a given tag',
        validate: {
            params: {
                todo_id: schemas.todoIdSchema
            },
            payload: {
                title: Joi.string(),
                order: Joi.number().integer(),
                completed: Joi.boolean()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: schemas.todoResourceSchema.label('Result')
            },
            404: {description: 'Todo not found'}
        }}}
    }
});

/**
 * list all todos of a tag
 * 
 * @todo return 404 if no content
 */
server.route({
    method: 'GET',
    path: '/todos/{tag_id}/todos/',
    handler: function (request, reply) {
        
        function dbCallback(todos) {            
            reply(todos).code(200);
        };        
        
        database.getAllOf(dbCallback, ["title", "ordering", "completed"], "todos", "tag", request.params.tag_id);
    },
    config: {
        tags: ['api'],
        description: 'List all todos of a tag',
        validate: {
            params: {
                tag_id: schemas.tagIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: schemas.todoResourceSchema.label('Result')
            },
            404: {description: 'Todos not found'}
        }}}
    }
});

//delete all todos
server.route({
    method: 'DELETE',
    path: '/todos/',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(204);
        }
        
        database.delete(dbCallback, false, "todos", null);
    },
    config: {
        tags: ['api'],
        description: 'Delete all todos',
        validate: {
            params: {
            }
        },
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'All todos deleted'},
            404: {description: 'No todo found'}
        }}}
    }
});

//delete a given todo
server.route({
    method: 'DELETE',
    path: '/todos/{todo_id}',
    handler: function (request, reply) {
         
        function dbCallback(result) {
            reply(result).code(204);
        }
        
        database.delete(dbCallback, true, "todos", request.params.todo_id);
    },
    config: {
        tags: ['api'],
        description: 'Delete a given todo',
        validate: {
            params: {
                todo_id: schemas.todoIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'Todo deleted'},
            404: {description: 'Todo not found'}
        }}}
    }
});