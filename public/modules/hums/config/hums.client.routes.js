'use strict';

//Setting up route
angular.module('hums').config(['$stateProvider',
	function($stateProvider) {
		// Hums state routing
		$stateProvider.
		state('listHums', {
			url: '/hums',
			templateUrl: 'modules/hums/views/list-hums.client.view.html'
		}).
		state('createHum', {
			url: '/hums/create',
			templateUrl: 'modules/hums/views/create-hum.client.view.html'
		}).
		state('viewHum', {
			url: '/hums/:humId',
			templateUrl: 'modules/hums/views/view-hum.client.view.html'
		}).
		state('editHum', {
			url: '/hums/:humId/edit',
			templateUrl: 'modules/hums/views/edit-hum.client.view.html'
		});
	}
]);