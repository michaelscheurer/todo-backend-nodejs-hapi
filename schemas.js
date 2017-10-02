//tag schemas
var tagResourceSchema = Joi.object({
    title: Joi.string(),
    url: Joi.string()
});

var tagIdSchema = Joi.number().integer().positive()
    .required().description('The tag ID');
    
exports.tagIdSchema = tagIdSchema;
exports.tagResourceSchema = tagResourceSchema;

//todo schemas
var todoResourceSchema = Joi.object({
    title: Joi.string(),
    completed: Joi.boolean(),
    order: Joi.number().integer(),
    url: Joi.string()
});

var todoIdSchema = Joi.number().integer().positive()
    .required().description('The Todo ID');
    
exports.todoIdSchema = todoIdSchema;
exports.todoResourceSchema = todoResourceSchema;