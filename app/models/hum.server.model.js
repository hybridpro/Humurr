'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hum Schema
 */
var HumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hum name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Hum', HumSchema);