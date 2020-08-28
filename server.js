// eslint-disable-next-line import/no-extraneous-dependencies
const jsonServer = require('json-server');
// eslint-disable-next-line import/no-extraneous-dependencies
const auth = require('json-server-auth');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(auth);
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
});
