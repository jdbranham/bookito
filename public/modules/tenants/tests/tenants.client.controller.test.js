'use strict';

(function() {
	// Tenants Controller Spec
	describe('Tenants Controller Tests', function() {
		// Initialize global variables
		var TenantsController,
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

			// Initialize the Tenants controller.
			TenantsController = $controller('TenantsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tenant object fetched from XHR', inject(function(Tenants) {
			// Create sample Tenant using the Tenants service
			var sampleTenant = new Tenants({
				name: 'New Tenant'
			});

			// Create a sample Tenants array that includes the new Tenant
			var sampleTenants = [sampleTenant];

			// Set GET response
			$httpBackend.expectGET('tenants').respond(sampleTenants);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tenants).toEqualData(sampleTenants);
		}));

		it('$scope.findOne() should create an array with one Tenant object fetched from XHR using a tenantId URL parameter', inject(function(Tenants) {
			// Define a sample Tenant object
			var sampleTenant = new Tenants({
				name: 'New Tenant'
			});

			// Set the URL parameter
			$stateParams.tenantId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tenants\/([0-9a-fA-F]{24})$/).respond(sampleTenant);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tenant).toEqualData(sampleTenant);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tenants) {
			// Create a sample Tenant object
			var sampleTenantPostData = new Tenants({
				name: 'New Tenant'
			});

			// Create a sample Tenant response
			var sampleTenantResponse = new Tenants({
				_id: '525cf20451979dea2c000001',
				name: 'New Tenant'
			});

			// Fixture mock form input values
			scope.name = 'New Tenant';

			// Set POST response
			$httpBackend.expectPOST('tenants', sampleTenantPostData).respond(sampleTenantResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tenant was created
			expect($location.path()).toBe('/tenants/' + sampleTenantResponse._id);
		}));

		it('$scope.update() should update a valid Tenant', inject(function(Tenants) {
			// Define a sample Tenant put data
			var sampleTenantPutData = new Tenants({
				_id: '525cf20451979dea2c000001',
				name: 'New Tenant'
			});

			// Mock Tenant in scope
			scope.tenant = sampleTenantPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tenants\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tenants/' + sampleTenantPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tenantId and remove the Tenant from the scope', inject(function(Tenants) {
			// Create new Tenant object
			var sampleTenant = new Tenants({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tenants array and include the Tenant
			scope.tenants = [sampleTenant];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tenants\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTenant);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tenants.length).toBe(0);
		}));
	});
}());