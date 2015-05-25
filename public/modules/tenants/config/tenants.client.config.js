'use strict';

// Configuring the Articles module
angular.module('tenants').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		/*Menus.addMenuItem('topbar', 'Tenants', 'tenants', 'dropdown', '/tenants(/create)?');
		Menus.addSubMenuItem('topbar', 'tenants', 'List Tenants', 'tenants');
		Menus.addSubMenuItem('topbar', 'tenants', 'New Tenant', 'tenants/create');*/
	}
]);