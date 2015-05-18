'use strict';

// Configuring the Articles module
angular.module('bookitos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Bookitos', 'bookitos', 'dropdown', '/bookitos(/create)?');
		Menus.addSubMenuItem('topbar', 'bookitos', 'List Bookitos', 'bookitos');
		Menus.addSubMenuItem('topbar', 'bookitos', 'New Bookito', 'bookitos/create');
	}
]);