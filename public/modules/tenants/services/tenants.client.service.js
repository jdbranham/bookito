'use strict';

//Tenants service used to communicate Tenants REST endpoints
angular.module('tenants').factory('Tenants', ['$resource',
	function($resource) {
		return $resource('tenants/:tenantId', { tenantId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);