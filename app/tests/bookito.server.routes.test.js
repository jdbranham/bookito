'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Bookito = mongoose.model('Bookito'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, bookito;

/**
 * Bookito routes tests
 */
describe('Bookito CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Bookito
		user.save(function() {
			bookito = {
				name: 'Bookito Name'
			};

			done();
		});
	});

	it('should be able to save Bookito instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bookito
				agent.post('/bookitos')
					.send(bookito)
					.expect(200)
					.end(function(bookitoSaveErr, bookitoSaveRes) {
						// Handle Bookito save error
						if (bookitoSaveErr) done(bookitoSaveErr);

						// Get a list of Bookitos
						agent.get('/bookitos')
							.end(function(bookitosGetErr, bookitosGetRes) {
								// Handle Bookito save error
								if (bookitosGetErr) done(bookitosGetErr);

								// Get Bookitos list
								var bookitos = bookitosGetRes.body;

								// Set assertions
								(bookitos[0].user._id).should.equal(userId);
								(bookitos[0].name).should.match('Bookito Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Bookito instance if not logged in', function(done) {
		agent.post('/bookitos')
			.send(bookito)
			.expect(401)
			.end(function(bookitoSaveErr, bookitoSaveRes) {
				// Call the assertion callback
				done(bookitoSaveErr);
			});
	});

	it('should not be able to save Bookito instance if no name is provided', function(done) {
		// Invalidate name field
		bookito.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bookito
				agent.post('/bookitos')
					.send(bookito)
					.expect(400)
					.end(function(bookitoSaveErr, bookitoSaveRes) {
						// Set message assertion
						(bookitoSaveRes.body.message).should.match('Please fill Bookito name');
						
						// Handle Bookito save error
						done(bookitoSaveErr);
					});
			});
	});

	it('should be able to update Bookito instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bookito
				agent.post('/bookitos')
					.send(bookito)
					.expect(200)
					.end(function(bookitoSaveErr, bookitoSaveRes) {
						// Handle Bookito save error
						if (bookitoSaveErr) done(bookitoSaveErr);

						// Update Bookito name
						bookito.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Bookito
						agent.put('/bookitos/' + bookitoSaveRes.body._id)
							.send(bookito)
							.expect(200)
							.end(function(bookitoUpdateErr, bookitoUpdateRes) {
								// Handle Bookito update error
								if (bookitoUpdateErr) done(bookitoUpdateErr);

								// Set assertions
								(bookitoUpdateRes.body._id).should.equal(bookitoSaveRes.body._id);
								(bookitoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Bookitos if not signed in', function(done) {
		// Create new Bookito model instance
		var bookitoObj = new Bookito(bookito);

		// Save the Bookito
		bookitoObj.save(function() {
			// Request Bookitos
			request(app).get('/bookitos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Bookito if not signed in', function(done) {
		// Create new Bookito model instance
		var bookitoObj = new Bookito(bookito);

		// Save the Bookito
		bookitoObj.save(function() {
			request(app).get('/bookitos/' + bookitoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', bookito.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Bookito instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bookito
				agent.post('/bookitos')
					.send(bookito)
					.expect(200)
					.end(function(bookitoSaveErr, bookitoSaveRes) {
						// Handle Bookito save error
						if (bookitoSaveErr) done(bookitoSaveErr);

						// Delete existing Bookito
						agent.delete('/bookitos/' + bookitoSaveRes.body._id)
							.send(bookito)
							.expect(200)
							.end(function(bookitoDeleteErr, bookitoDeleteRes) {
								// Handle Bookito error error
								if (bookitoDeleteErr) done(bookitoDeleteErr);

								// Set assertions
								(bookitoDeleteRes.body._id).should.equal(bookitoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Bookito instance if not signed in', function(done) {
		// Set Bookito user 
		bookito.user = user;

		// Create new Bookito model instance
		var bookitoObj = new Bookito(bookito);

		// Save the Bookito
		bookitoObj.save(function() {
			// Try deleting Bookito
			request(app).delete('/bookitos/' + bookitoObj._id)
			.expect(401)
			.end(function(bookitoDeleteErr, bookitoDeleteRes) {
				// Set message assertion
				(bookitoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Bookito error error
				done(bookitoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Bookito.remove().exec();
		done();
	});
});