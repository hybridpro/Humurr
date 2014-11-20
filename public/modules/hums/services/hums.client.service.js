'use strict';

//Hums service used to communicate Hums REST endpoints
angular.module('hums').factory('Hums', ['$resource',
	function($resource) {
		return $resource('hums/:humId', { humId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);