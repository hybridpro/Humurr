'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Hum = mongoose.model('Hum'),
	_ = require('lodash');

/**
 * Create a Hum
 */
exports.create = function(req, res) {
	var hum = new Hum(req.body);
	hum.user = req.user;

	hum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hum);
		}
	});
};

/**
 * Show the current Hum
 */
exports.read = function(req, res) {
	res.jsonp(req.hum);
};

/**
 * Update a Hum
 */
exports.update = function(req, res) {
	var hum = req.hum ;

	hum = _.extend(hum , req.body);

	hum.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hum);
		}
	});
};

/**
 * Delete an Hum
 */
exports.delete = function(req, res) {
	var hum = req.hum ;

	hum.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hum);
		}
	});
};

/**
 * List of Hums
 */
exports.list = function(req, res) { 
	Hum.find().sort('-created').populate('user', 'displayName').exec(function(err, hums) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hums);
		}
	});
};

/**
 * Hum middleware
 */
exports.humByID = function(req, res, next, id) { 
	Hum.findById(id).populate('user', 'displayName').exec(function(err, hum) {
		if (err) return next(err);
		if (! hum) return next(new Error('Failed to load Hum ' + id));
		req.hum = hum ;
		next();
	});
};

/**
 * Hum authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hum.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
