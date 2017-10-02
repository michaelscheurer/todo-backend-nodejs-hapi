/**
 * 
 * @todo: delete all tags
 * @todo: make callback function on insert tag
 */

//create a tag POST /tags/
server.route({
    method: 'POST',
    path: '/tags/',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(201);
        }

        database.insert(dbCallback, ["title"], [request.payload.title], "tags");
    },
    config: {
        tags: ['api'],
        description: 'Create a tag',
        validate: {
            payload: {
                title: Joi.string().required()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            201: {
                description: 'Created',
                schema: schemas.tagResourceSchema.label('Result')
            }
        }}}
    }
});

//list all tags GET /tags/
server.route({
    method: 'GET',
    path: '/tags/',
    handler: function (request, reply) {
        
        function dbCallback(tags) {
            reply(tags).code(200);
        };
        
        database.getEntries(dbCallback, false, "tags", null);        
    },
    config: {
        tags: ['api'],
        description: 'List all tags',
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: Joi.array().items(
                    schemas.tagResourceSchema.label('Result')
                )
            }
        }}}
    }
});

//Fetch a tag by id
server.route({
    method: 'GET',
    path: '/tags/{tag_id}',
    handler: function (request, reply) {
        
        function dbCallback(tags) {            
            reply(tags).code(200);
        };
        
        database.getEntries(dbCallback, true, "tags", request.params.tag_id);
    },
    config: {
        tags: ['api'],
        description: 'Fetch a given tag',
        validate: {
            params: {
                tag_id: schemas.tagIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: schemas.tagResourceSchema.label('Result')
            },
            404: {description: 'Tag not found'}
        }}}
    }
});

//Update a tag by id
server.route({
    method: 'PATCH',
    path: '/tags/{tag_id}',
    handler: function (request, reply) {
        
        function dbCallback(answer) {
            reply(answer).code(200);
        }
        
        database.updateTag(dbCallback, request.params.tag_id, request.payload.title);
    },
    config: {
        tags: ['api'],
        description: 'Update a given tag',
        validate: {
            params: {
                tag_id: schemas.tagIdSchema
            },
            payload: {
                title: Joi.string()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: schemas.tagResourceSchema.label('Result')
            },
            404: {description: 'Tag not found'}
        }}}
    }
});

//delete all tags
server.route({
    method: 'DELETE',
    path: '/tags/',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(204);
        }
        
        database.delete(dbCallback, false, "tags", null);
    },
    config: {
        tags: ['api'],
        description: 'Delete all tags',
        validate: {
            params: {
            }
        },
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'All tags deleted'},
            404: {description: 'No tag found'}
        }}}
    }
});

//delete tag from database by id
server.route({
    method: 'DELETE',
    path: '/tags/{tag_id}',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(204);
        }
        
        database.delete(dbCallback, true, "tags", request.params.tag_id);
    },
    config: {
        tags: ['api'],
        description: 'Delete a given tag',
        validate: {
            params: {
                tag_id: schemas.tagIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'Tag deleted'},
            404: {description: 'Tag not found'}
        }}}
    }
});

/**
 * list all tags of a todo
 * 
 * @todo return 404 if no content
 */
server.route({
    method: 'GET',
    path: '/tags/{todo_id}/tags/',
    handler: function (request, reply) {
        
        function dbCallback(tags) {            
            reply(tags).code(200);
        };        
        
        database.getAllTagsOfTodo(dbCallback, request.params.todo_id);        
    },
    config: {
        tags: ['api'],
        description: 'List all tags of a todo',
        validate: {
            params: {
                todo_id: schemas.todoIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: schemas.tagResourceSchema.label('Result')
            },
            404: {description: 'Tags not found'}
        }}}
    }
});