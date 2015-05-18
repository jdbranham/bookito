'use strict';

(function() {
	// Bookitos Controller Spec
	describe('Bookitos Controller Tests', function() {
		// Initialize global variables
		var BookitosController,
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

			// Initialize the Bookitos controller.
			BookitosController = $controller('BookitosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Bookito object fetched from XHR', inject(function(Bookitos) {
			// Create sample Bookito using the Bookitos service
			var sampleBookito = new Bookitos({
				name: 'New Bookito'
			});

			// Create a sample Bookitos array that includes the new Bookito
			var sampleBookitos = [sampleBookito];

			// Set GET response
			$httpBackend.expectGET('bookitos').respond(sampleBookitos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bookitos).toEqualData(sampleBookitos);
		}));

		it('$scope.findOne() should create an array with one Bookito object fetched from XHR using a bookitoId URL parameter', inject(function(Bookitos) {
			// Define a sample Bookito object
			var sampleBookito = new Bookitos({
				name: 'New Bookito'
			});

			// Set the URL parameter
			$stateParams.bookitoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/bookitos\/([0-9a-fA-F]{24})$/).respond(sampleBookito);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bookito).toEqualData(sampleBookito);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Bookitos) {
			// Create a sample Bookito object
			var sampleBookitoPostData = new Bookitos({
				name: 'New Bookito'
			});

			// Create a sample Bookito response
			var sampleBookitoResponse = new Bookitos({
				_id: '525cf20451979dea2c000001',
				name: 'New Bookito'
			});

			// Fixture mock form input values
			scope.name = 'New Bookito';

			// Set POST response
			$httpBackend.expectPOST('bookitos', sampleBookitoPostData).respond(sampleBookitoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Bookito was created
			expect($location.path()).toBe('/bookitos/' + sampleBookitoResponse._id);
		}));

		it('$scope.update() should update a valid Bookito', inject(function(Bookitos) {
			// Define a sample Bookito put data
			var sampleBookitoPutData = new Bookitos({
				_id: '525cf20451979dea2c000001',
				name: 'New Bookito'
			});

			// Mock Bookito in scope
			scope.bookito = sampleBookitoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/bookitos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/bookitos/' + sampleBookitoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid bookitoId and remove the Bookito from the scope', inject(function(Bookitos) {
			// Create new Bookito object
			var sampleBookito = new Bookitos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Bookitos array and include the Bookito
			scope.bookitos = [sampleBookito];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/bookitos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBookito);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.bookitos.length).toBe(0);
		}));
	});
}());