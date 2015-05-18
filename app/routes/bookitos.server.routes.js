'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var bookitos = require('../../app/controllers/bookitos.server.controller');

	// Bookitos Routes
	app.route('/bookitos')
		.get(bookitos.list)
		.post(users.requiresLogin, bookitos.create);

	app.route('/bookitos/:bookitoId')
		.get(bookitos.read)
		.put(users.requiresLogin, bookitos.hasAuthorization, bookitos.update)
		.delete(users.requiresLogin, bookitos.hasAuthorization, bookitos.delete);

	// Finish by binding the Bookito middleware
	app.param('bookitoId', bookitos.bookitoByID);
};
