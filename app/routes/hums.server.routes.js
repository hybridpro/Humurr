'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hums = require('../../app/controllers/hums.server.controller');

	// Hums Routes
	app.route('/hums')
		.get(hums.list)
		.post(users.requiresLogin, hums.create);

	app.route('/hums/:humId')
		.get(hums.read)
		.put(users.requiresLogin, hums.hasAuthorization, hums.update)
		.delete(users.requiresLogin, hums.hasAuthorization, hums.delete);

	// Finish by binding the Hum middleware
    app.param('humId', hums.humByID);
};
