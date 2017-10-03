global.Hapi = require('hapi');
global.Inert = require('inert');
global.Vision = require('vision');
global.HapiSwagger = require('hapi-swagger');
global.Joi = require('joi');
const init_database = require('./initialize_database');
global.database = require('./database');
const server = require('./server');
global.schemas = require('./schemas');
global.replyManager = require('./replyManager');

// Routes
var tags = require('./tags');
var todos = require('./todos');
