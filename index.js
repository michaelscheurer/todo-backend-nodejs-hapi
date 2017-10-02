global.Hapi = require('hapi');
global.Inert = require('inert');
global.Vision = require('vision');
global.HapiSwagger = require('hapi-swagger');
global.Joi = require('joi');
global.database = require('./database');
const server = require('./server');

var tags = require('./tags');
var todos = require('./todos');
var todos_tags = require('./todos_tags');
