'use strict';

//Setting up route
angular.module('tenants').config(['$stateProvider',
	function($stateProvider) {
		// Tenants state routing
		$stateProvider.
		state('listTenants', {
			url: '/tenants',
			templateUrl: 'modules/tenants/views/list-tenants.client.view.html'
		}).
		state('createTenant', {
			url: '/tenants/create',
			templateUrl: 'modules/tenants/views/create-tenant.client.view.html'
		}).
		state('viewTenant', {
			url: '/tenants/:tenantId',
			templateUrl: 'modules/tenants/views/view-tenant.client.view.html'
		}).
		state('editTenant', {
			url: '/tenants/:tenantId/edit',
			templateUrl: 'modules/tenants/views/edit-tenant.client.view.html'
		});
	}
]);