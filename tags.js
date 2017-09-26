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
        
        database.insertTag(
            request.payload.title
        );
        
        reply().code(201);
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