'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PageSchema = new Schema({
	_id: String,
	isStartPage: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		trim: true
	},
	body:{
		type: String
	},
	imageUrl: String,
	tags: [{
		_id: false,
		text: String
	}],
	choices:[{
		_id: false,
		displayText: String,
		page: {
			type: Schema.ObjectId,
			ref: 'Page'
		}
	}]
});

/**
 * Bookito Schema
 */
var BookitoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Bookito name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	coverImageUrl: {
		type: String,
		default: '',
		trim: true
	},
	pages: [],
	isPublic: {
		type: Boolean,
		default: true
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

mongoose.model('Page', PageSchema);
mongoose.model('Bookito', BookitoSchema);