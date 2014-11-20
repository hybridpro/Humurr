'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Hum = mongoose.model('Hum'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hum;

/**
 * Hum routes tests
 */
describe('Hum CRUD tests', function() {
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

		// Save a user to the test db and create new Hum
		user.save(function() {
			hum = {
				name: 'Hum Name'
			};

			done();
		});
	});

	it('should be able to save Hum instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hum
				agent.post('/hums')
					.send(hum)
					.expect(200)
					.end(function(humSaveErr, humSaveRes) {
						// Handle Hum save error
						if (humSaveErr) done(humSaveErr);

						// Get a list of Hums
						agent.get('/hums')
							.end(function(humsGetErr, humsGetRes) {
								// Handle Hum save error
								if (humsGetErr) done(humsGetErr);

								// Get Hums list
								var hums = humsGetRes.body;

								// Set assertions
								(hums[0].user._id).should.equal(userId);
								(hums[0].name).should.match('Hum Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hum instance if not logged in', function(done) {
		agent.post('/hums')
			.send(hum)
			.expect(401)
			.end(function(humSaveErr, humSaveRes) {
				// Call the assertion callback
				done(humSaveErr);
			});
	});

	it('should not be able to save Hum instance if no name is provided', function(done) {
		// Invalidate name field
		hum.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hum
				agent.post('/hums')
					.send(hum)
					.expect(400)
					.end(function(humSaveErr, humSaveRes) {
						// Set message assertion
						(humSaveRes.body.message).should.match('Please fill Hum name');
						
						// Handle Hum save error
						done(humSaveErr);
					});
			});
	});

	it('should be able to update Hum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hum
				agent.post('/hums')
					.send(hum)
					.expect(200)
					.end(function(humSaveErr, humSaveRes) {
						// Handle Hum save error
						if (humSaveErr) done(humSaveErr);

						// Update Hum name
						hum.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hum
						agent.put('/hums/' + humSaveRes.body._id)
							.send(hum)
							.expect(200)
							.end(function(humUpdateErr, humUpdateRes) {
								// Handle Hum update error
								if (humUpdateErr) done(humUpdateErr);

								// Set assertions
								(humUpdateRes.body._id).should.equal(humSaveRes.body._id);
								(humUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hums if not signed in', function(done) {
		// Create new Hum model instance
		var humObj = new Hum(hum);

		// Save the Hum
		humObj.save(function() {
			// Request Hums
			request(app).get('/hums')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hum if not signed in', function(done) {
		// Create new Hum model instance
		var humObj = new Hum(hum);

		// Save the Hum
		humObj.save(function() {
			request(app).get('/hums/' + humObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hum.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hum instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hum
				agent.post('/hums')
					.send(hum)
					.expect(200)
					.end(function(humSaveErr, humSaveRes) {
						// Handle Hum save error
						if (humSaveErr) done(humSaveErr);

						// Delete existing Hum
						agent.delete('/hums/' + humSaveRes.body._id)
							.send(hum)
							.expect(200)
							.end(function(humDeleteErr, humDeleteRes) {
								// Handle Hum error error
								if (humDeleteErr) done(humDeleteErr);

								// Set assertions
								(humDeleteRes.body._id).should.equal(humSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hum instance if not signed in', function(done) {
		// Set Hum user 
		hum.user = user;

		// Create new Hum model instance
		var humObj = new Hum(hum);

		// Save the Hum
		humObj.save(function() {
			// Try deleting Hum
			request(app).delete('/hums/' + humObj._id)
			.expect(401)
			.end(function(humDeleteErr, humDeleteRes) {
				// Set message assertion
				(humDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hum error error
				done(humDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Hum.remove().exec();
		done();
	});
});