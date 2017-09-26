const swaggerOptions = {
    info: {
        'title': 'Todo API',
        'version': '1.0',
        'description': 'A simple TODO API',
    },
    documentationPath: '/doc',
    tags: [
        {
            description: 'TODO operations',
            name: 'todos'
        }
    ]
};

global.server = new Hapi.Server();
server.connection({
    host: '127.0.0.1',
    port: 5000,
    routes: {cors: true}
});

server.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: swaggerOptions
    }
]);

server.start((err) => {
    console.log('Server running at:', server.info.uri);
});