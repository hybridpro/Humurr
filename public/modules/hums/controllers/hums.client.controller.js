'use strict';

// Hums controller
angular.module('hums').controller('HumsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hums',
	function($scope, $stateParams, $location, Authentication, Hums) {
		$scope.authentication = Authentication;

		// Create new Hum
		$scope.create = function() {
			// Create new Hum object
			var hum = new Hums ({
				name: this.name
			});

			// Redirect after save
			hum.$save(function(response) {
				$location.path('hums/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hum
		$scope.remove = function(hum) {
			if ( hum ) { 
				hum.$remove();

				for (var i in $scope.hums) {
					if ($scope.hums [i] === hum) {
						$scope.hums.splice(i, 1);
					}
				}
			} else {
				$scope.hum.$remove(function() {
					$location.path('hums');
				});
			}
		};

		// Update existing Hum
		$scope.update = function() {
			var hum = $scope.hum;

			hum.$update(function() {
				$location.path('hums/' + hum._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hums
		$scope.find = function() {
			$scope.hums = Hums.query();
		};

		// Find existing Hum
		$scope.findOne = function() {
			$scope.hum = Hums.get({ 
				humId: $stateParams.humId
			});
		};
	}
]);