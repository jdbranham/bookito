'use strict';


// Bookitos controller
angular.module('bookitos').controller('BookitosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bookitos', 'GuidGen', 'notify',
	function($scope, $stateParams, $location, Authentication, Bookitos, GuidGen, notify) {
		$scope.authentication = Authentication;

		// Create new Bookito
		$scope.create = function() {
			// Create new Bookito object
			var bookito = new Bookitos ({
				name: this.name,
				description: this.description,
				coverImageUrl: this.coverImageUrl
			});

			// Redirect after save
			bookito.$save(function(response) {
				$location.path('bookitos/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.description = '';
				$scope.coverImageUrl = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Bookito
		$scope.remove = function(bookito) {
			if ( bookito ) {
				bookito.$remove();

				for (var i in $scope.bookitos) {
					if ($scope.bookitos [i] === bookito) {
						$scope.bookitos.splice(i, 1);
					}
				}
			} else {
				$scope.bookito.$remove(function() {
					$location.path('bookitos');
				});
			}
		};

		// Update existing Bookito
		$scope.update = function() {
			var bookito = $scope.bookito;
			console.info(bookito);

			bookito.$update(function() {
				$location.path('bookitos/' + bookito._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.updateWithNoRedirect = function(){
			var bookito = $scope.bookito;
			console.info(bookito);

			bookito.$update(function() {
				notify({
					message: 'Your Bookito has been saved!',
					duration: '5000',
					position: 'right',
					classes: ['success']
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Bookitos
		$scope.find = function() {
			$scope.bookitos = Bookitos.query();
		};

		// Find existing Bookito
		$scope.findOne = function() {
			$scope.bookito = Bookitos.get({
				bookitoId: $stateParams.bookitoId
			});
		};

		// Add a page to the bookito
		$scope.addPage = function(){
			var bookito = $scope.bookito;
			var page = {
							_id: GuidGen.generate(),
							title: 'Change me!',
							body: 'Type some text',
							imageUrl: '',
							tags: [],
							choices:[]
						};
			bookito.pages.push(page);
			$scope.activatePage(page);
		};

		// Add a choice to the page
		$scope.addChoice = function(page){
			page.choices.push({
				_id: GuidGen.generate()
			});
		};

		// Activate a page
		$scope.activatePage = function(page){
			$scope.activePage = page;
			for (var pageIndex = 0; pageIndex < $scope.bookito.pages.length; pageIndex++) {
				if(page === $scope.bookito.pages[pageIndex]){
					$scope.bookito.pages[pageIndex].isActive = true;
				}
				else{
					$scope.bookito.pages[pageIndex].isActive = false;
				}
			}
		};
	}
]);