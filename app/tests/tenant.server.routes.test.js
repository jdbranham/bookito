'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tenant = mongoose.model('Tenant'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tenant;

/**
 * Tenant routes tests
 */
describe('Tenant CRUD tests', function() {
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

		// Save a user to the test db and create new Tenant
		user.save(function() {
			tenant = {
				name: 'Tenant Name'
			};

			done();
		});
	});

	it('should be able to save Tenant instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tenant
				agent.post('/tenants')
					.send(tenant)
					.expect(200)
					.end(function(tenantSaveErr, tenantSaveRes) {
						// Handle Tenant save error
						if (tenantSaveErr) done(tenantSaveErr);

						// Get a list of Tenants
						agent.get('/tenants')
							.end(function(tenantsGetErr, tenantsGetRes) {
								// Handle Tenant save error
								if (tenantsGetErr) done(tenantsGetErr);

								// Get Tenants list
								var tenants = tenantsGetRes.body;

								// Set assertions
								(tenants[0].user._id).should.equal(userId);
								(tenants[0].name).should.match('Tenant Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tenant instance if not logged in', function(done) {
		agent.post('/tenants')
			.send(tenant)
			.expect(401)
			.end(function(tenantSaveErr, tenantSaveRes) {
				// Call the assertion callback
				done(tenantSaveErr);
			});
	});

	it('should not be able to save Tenant instance if no name is provided', function(done) {
		// Invalidate name field
		tenant.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tenant
				agent.post('/tenants')
					.send(tenant)
					.expect(400)
					.end(function(tenantSaveErr, tenantSaveRes) {
						// Set message assertion
						(tenantSaveRes.body.message).should.match('Please fill Tenant name');
						
						// Handle Tenant save error
						done(tenantSaveErr);
					});
			});
	});

	it('should be able to update Tenant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tenant
				agent.post('/tenants')
					.send(tenant)
					.expect(200)
					.end(function(tenantSaveErr, tenantSaveRes) {
						// Handle Tenant save error
						if (tenantSaveErr) done(tenantSaveErr);

						// Update Tenant name
						tenant.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tenant
						agent.put('/tenants/' + tenantSaveRes.body._id)
							.send(tenant)
							.expect(200)
							.end(function(tenantUpdateErr, tenantUpdateRes) {
								// Handle Tenant update error
								if (tenantUpdateErr) done(tenantUpdateErr);

								// Set assertions
								(tenantUpdateRes.body._id).should.equal(tenantSaveRes.body._id);
								(tenantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tenants if not signed in', function(done) {
		// Create new Tenant model instance
		var tenantObj = new Tenant(tenant);

		// Save the Tenant
		tenantObj.save(function() {
			// Request Tenants
			request(app).get('/tenants')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tenant if not signed in', function(done) {
		// Create new Tenant model instance
		var tenantObj = new Tenant(tenant);

		// Save the Tenant
		tenantObj.save(function() {
			request(app).get('/tenants/' + tenantObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tenant.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tenant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tenant
				agent.post('/tenants')
					.send(tenant)
					.expect(200)
					.end(function(tenantSaveErr, tenantSaveRes) {
						// Handle Tenant save error
						if (tenantSaveErr) done(tenantSaveErr);

						// Delete existing Tenant
						agent.delete('/tenants/' + tenantSaveRes.body._id)
							.send(tenant)
							.expect(200)
							.end(function(tenantDeleteErr, tenantDeleteRes) {
								// Handle Tenant error error
								if (tenantDeleteErr) done(tenantDeleteErr);

								// Set assertions
								(tenantDeleteRes.body._id).should.equal(tenantSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tenant instance if not signed in', function(done) {
		// Set Tenant user 
		tenant.user = user;

		// Create new Tenant model instance
		var tenantObj = new Tenant(tenant);

		// Save the Tenant
		tenantObj.save(function() {
			// Try deleting Tenant
			request(app).delete('/tenants/' + tenantObj._id)
			.expect(401)
			.end(function(tenantDeleteErr, tenantDeleteRes) {
				// Set message assertion
				(tenantDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tenant error error
				done(tenantDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tenant.remove().exec();
		done();
	});
});