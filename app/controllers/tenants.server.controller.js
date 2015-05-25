'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tenant = mongoose.model('Tenant'),
	_ = require('lodash');

/**
 * Create a Tenant
 */
exports.create = function(req, res) {
	var tenant = new Tenant(req.body);
	tenant.user = req.user;

	tenant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tenant);
		}
	});
};

/**
 * Show the current Tenant
 */
exports.read = function(req, res) {
	res.jsonp(req.tenant);
};

/**
 * Update a Tenant
 */
exports.update = function(req, res) {
	var tenant = req.tenant ;

	tenant = _.extend(tenant , req.body);

	tenant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tenant);
		}
	});
};

/**
 * Delete an Tenant
 */
exports.delete = function(req, res) {
	var tenant = req.tenant ;

	tenant.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tenant);
		}
	});
};

/**
 * List of Tenants
 */
exports.list = function(req, res) { 
	Tenant.find().sort('-created').populate('user', 'displayName').exec(function(err, tenants) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tenants);
		}
	});
};

/**
 * Tenant middleware
 */
exports.tenantByID = function(req, res, next, id) { 
	Tenant.findById(id).populate('user', 'displayName').exec(function(err, tenant) {
		if (err) return next(err);
		if (! tenant) return next(new Error('Failed to load Tenant ' + id));
		req.tenant = tenant ;
		next();
	});
};

/**
 * Tenant authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tenant.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
