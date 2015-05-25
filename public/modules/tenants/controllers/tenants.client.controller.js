'use strict';

// Tenants controller
angular.module('tenants').controller('TenantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tenants',
	function($scope, $stateParams, $location, Authentication, Tenants) {
		$scope.authentication = Authentication;

		// Create new Tenant
		$scope.create = function() {
			// Create new Tenant object
			var tenant = new Tenants ({
				name: this.name
			});

			// Redirect after save
			tenant.$save(function(response) {
				$location.path('tenants/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tenant
		$scope.remove = function(tenant) {
			if ( tenant ) { 
				tenant.$remove();

				for (var i in $scope.tenants) {
					if ($scope.tenants [i] === tenant) {
						$scope.tenants.splice(i, 1);
					}
				}
			} else {
				$scope.tenant.$remove(function() {
					$location.path('tenants');
				});
			}
		};

		// Update existing Tenant
		$scope.update = function() {
			var tenant = $scope.tenant;

			tenant.$update(function() {
				$location.path('tenants/' + tenant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tenants
		$scope.find = function() {
			$scope.tenants = Tenants.query();
		};

		// Find existing Tenant
		$scope.findOne = function() {
			$scope.tenant = Tenants.get({ 
				tenantId: $stateParams.tenantId
			});
		};
	}
]);