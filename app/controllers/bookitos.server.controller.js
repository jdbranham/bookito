'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Bookito = mongoose.model('Bookito'),
	_ = require('lodash');

/**
 * Create a Bookito
 */
exports.create = function(req, res) {
	var bookito = new Bookito(req.body);
	bookito.user = req.user;

	bookito.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bookito);
		}
	});
};

/**
 * Show the current Bookito
 */
exports.read = function(req, res) {
	res.jsonp(req.bookito);
};

/**
 * Update a Bookito
 */
exports.update = function(req, res) {
	var bookito = req.bookito ;

	bookito = _.extend(bookito , req.body);

	bookito.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bookito);
		}
	});
};

/**
 * Delete an Bookito
 */
exports.delete = function(req, res) {
	var bookito = req.bookito ;

	bookito.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bookito);
		}
	});
};

/**
 * List of Bookitos
 */
exports.list = function(req, res) {
	Bookito.find().sort('-created').populate('user', 'displayName').exec(function(err, bookitos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bookitos);
		}
	});
};

/**
 * Bookito middleware
 */
exports.bookitoByID = function(req, res, next, id) {
	Bookito.findById(id).populate('user', 'displayName').exec(function(err, bookito) {
		if (err) return next(err);
		if (! bookito) return next(new Error('Failed to load Bookito ' + id));
		req.bookito = bookito ;
		next();
	});
};

/**
 * Bookito authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.bookito.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
