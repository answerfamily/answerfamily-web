const nextRoutes = require('next-routes');
const routes = (module.exports = nextRoutes());

routes.add('article', '/article/:id');
routes.add('reply', '/reply/:id');
