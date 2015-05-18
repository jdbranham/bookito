'use strict';

//Setting up route
angular.module('bookitos').config(['$stateProvider',
	function($stateProvider) {
		// Bookitos state routing
		$stateProvider.
		state('listBookitos', {
			url: '/bookitos',
			templateUrl: 'modules/bookitos/views/list-bookitos.client.view.html'
		}).
		state('createBookito', {
			url: '/bookitos/create',
			templateUrl: 'modules/bookitos/views/create-bookito.client.view.html'
		}).
		state('viewBookito', {
			url: '/bookitos/:bookitoId',
			templateUrl: 'modules/bookitos/views/view-bookito.client.view.html'
		}).
		state('editBookito', {
			url: '/bookitos/:bookitoId/edit',
			templateUrl: 'modules/bookitos/views/edit-bookito.client.view.html'
		});
	}
]);