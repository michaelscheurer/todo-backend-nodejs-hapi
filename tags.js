/**
 * 
 * @todo: make callback function on insert tag
 */

var tagResourceSchema = Joi.object({
    title: Joi.string(),
    url: Joi.string()
});

var tagIdSchema = Joi.number().integer().positive()
    .required().description('The tag ID');
 
//list all tags GET /tags/
server.route({
    method: 'GET',
    path: '/tags/',
    handler: function (request, reply) {
        
        function dbCallback(tags) {
            reply(tags).code(200);
        };
        
        database.getAllTags(dbCallback);
        
    },
    config: {
        tags: ['api'],
        description: 'List all tags',
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: Joi.array().items(
                    tagResourceSchema.label('Result')
                )
            }
        }}}
    }
});

//create a tag POST /tags/
server.route({
    method: 'POST',
    path: '/tags/',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(201);
        }
        
        database.insertTag(dbCallback, request.payload.title);        
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
                schema: tagResourceSchema.label('Result')
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
        
        database.getTag(dbCallback, request.params.tag_id);
    },
    config: {
        tags: ['api'],
        description: 'Fetch a given tag',
        validate: {
            params: {
                tag_id: tagIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: tagResourceSchema.label('Result')
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
                tag_id: tagIdSchema
            },
            payload: {
                title: Joi.string()
            }
        },
        plugins: {'hapi-swagger': {responses: {
            200: {
                description: 'Success',
                schema: tagResourceSchema.label('Result')
            },
            404: {description: 'Tag not found'}
        }}}
    }
});

server.route({
    method: 'DELETE',
    path: '/tags/{tag_id}',
    handler: function (request, reply) {
        
        function dbCallback(result) {
            reply(result).code(204);
        }
        
        database.deleteTagById(dbCallback, request.params.tag_id);

    },
    config: {
        tags: ['api'],
        description: 'Delete a given tag',
        validate: {
            params: {
                tag_id: tagIdSchema
            }
        },
        plugins: {'hapi-swagger': {responses: {
            204: {description: 'Tag deleted'},
            404: {description: 'Tag not found'}
        }}}
    }
});