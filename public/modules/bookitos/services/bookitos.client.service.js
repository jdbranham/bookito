'use strict';

//Bookitos service used to communicate Bookitos REST endpoints
angular.module('bookitos').factory('Bookitos', ['$resource',
	function($resource) {
		return $resource('bookitos/:bookitoId', { bookitoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);