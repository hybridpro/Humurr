'use strict';

(function() {
	// Hums Controller Spec
	describe('Hums Controller Tests', function() {
		// Initialize global variables
		var HumsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Hums controller.
			HumsController = $controller('HumsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hum object fetched from XHR', inject(function(Hums) {
			// Create sample Hum using the Hums service
			var sampleHum = new Hums({
				name: 'New Hum'
			});

			// Create a sample Hums array that includes the new Hum
			var sampleHums = [sampleHum];

			// Set GET response
			$httpBackend.expectGET('hums').respond(sampleHums);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hums).toEqualData(sampleHums);
		}));

		it('$scope.findOne() should create an array with one Hum object fetched from XHR using a humId URL parameter', inject(function(Hums) {
			// Define a sample Hum object
			var sampleHum = new Hums({
				name: 'New Hum'
			});

			// Set the URL parameter
			$stateParams.humId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hums\/([0-9a-fA-F]{24})$/).respond(sampleHum);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hum).toEqualData(sampleHum);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Hums) {
			// Create a sample Hum object
			var sampleHumPostData = new Hums({
				name: 'New Hum'
			});

			// Create a sample Hum response
			var sampleHumResponse = new Hums({
				_id: '525cf20451979dea2c000001',
				name: 'New Hum'
			});

			// Fixture mock form input values
			scope.name = 'New Hum';

			// Set POST response
			$httpBackend.expectPOST('hums', sampleHumPostData).respond(sampleHumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hum was created
			expect($location.path()).toBe('/hums/' + sampleHumResponse._id);
		}));

		it('$scope.update() should update a valid Hum', inject(function(Hums) {
			// Define a sample Hum put data
			var sampleHumPutData = new Hums({
				_id: '525cf20451979dea2c000001',
				name: 'New Hum'
			});

			// Mock Hum in scope
			scope.hum = sampleHumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hums\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hums/' + sampleHumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid humId and remove the Hum from the scope', inject(function(Hums) {
			// Create new Hum object
			var sampleHum = new Hums({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hums array and include the Hum
			scope.hums = [sampleHum];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hums\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHum);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hums.length).toBe(0);
		}));
	});
}());