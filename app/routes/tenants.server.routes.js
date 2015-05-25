'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tenants = require('../../app/controllers/tenants.server.controller');

	// Tenants Routes
	app.route('/tenants')
		.get(tenants.list)
		.post(users.requiresLogin, tenants.create);

	app.route('/tenants/:tenantId')
		.get(tenants.read)
		.put(users.requiresLogin, tenants.hasAuthorization, tenants.update)
		.delete(users.requiresLogin, tenants.hasAuthorization, tenants.delete);

	// Finish by binding the Tenant middleware
	app.param('tenantId', tenants.tenantByID);
};
