'use strict';


// Bookitos controller
angular.module('bookitos').controller('BookitosController', ['$scope', '$stateParams', '$location', 'smoothScroll', 'Authentication', 'Bookitos', 'GuidGen', 'notify',
	function($scope, $stateParams, $location, smoothScroll, Authentication, Bookitos, GuidGen, notify) {
		$scope.authentication = Authentication;

		$scope.scrollTo = function(id) {
			var element = document.getElementById(id);
			smoothScroll(element);
		};

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
				$location.path('bookitos/' + response._id + '/edit');

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
			Bookitos.get({
				bookitoId: $stateParams.bookitoId
			}).$promise.then(function(bookito){
				$scope.bookito = bookito;
				$scope.startPage = $scope.getStartPage(bookito);
				$scope.checkForPages();
			});
		};

		// Notify if there are no pages and the edit screen is active
		$scope.checkForPages = function(){
			if($scope.bookito.pages.length === 0){
				if(S($location.path()).endsWith('edit')){
					notify({
						messageTemplate: '<span>There are no pages! <br />' +
							'<a class="btn" data-ng-click="addPage()">Add a page now</a></span>',
						scope: $scope,
						duration: '10000',
						position: 'right',
						classes: ['warning']
					});
				} else{
					notify({
						message: 'There is no Starting Page set!',
						duration: '5000',
						position: 'right',
						classes: ['warning']
					});
				}
			}
		};

		// Find existing Bookito and set active page
		$scope.findPage = function() {
			Bookitos.get({
				bookitoId: $stateParams.bookitoId
			}).$promise.then(function(bookito){
				$scope.bookito = bookito;
				$scope.startPage = $scope.getStartPage(bookito);
				$scope.activatePageById($stateParams.pageId);
			});
		};

		// Add a page to the bookito
		$scope.addPage = function(){
			var bookito = $scope.bookito;
			var page = {
							_id: GuidGen.generate(),
							title: 'Page ' + (bookito.pages.length + 1),
							body: '',
							imageUrl: '',
							tags: [],
							choices:[]
						};
			if(bookito.pages.length === 0){
				page.isStartPage = true;
			}
			bookito.pages.push(page);
			$scope.activatePageThenScroll(page, 'pageEditor');
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

		// Activate a page
		$scope.activatePageThenScroll = function(page, elementId){
			$scope.activatePage(page);
			$scope.scrollTo(elementId);
		};

		// Activate a page by the id
		$scope.activatePageById = function(pageId){
			for (var pageIndex = 0; pageIndex < $scope.bookito.pages.length; pageIndex++) {
				if(pageId === $scope.bookito.pages[pageIndex]._id){
					$scope.activatePage($scope.bookito.pages[pageIndex]);
				}
			}
		};

		// Set the starting page
		$scope.setStartPage = function(page){
			for (var pageIndex = 0; pageIndex < $scope.bookito.pages.length; pageIndex++) {
				if(page === $scope.bookito.pages[pageIndex]){
					$scope.bookito.pages[pageIndex].isStartPage = true;
				}
				else{
					$scope.bookito.pages[pageIndex].isStartPage = false;
				}
			}
		};

		// Get the starting page
		$scope.getStartPage = function(bookito){
			for (var pageIndex = 0; pageIndex < bookito.pages.length; pageIndex++) {
				if(bookito.pages[pageIndex].isStartPage){
					return bookito.pages[pageIndex];
				}
			}
		};

		$scope.deletePage = function(page){
			if(confirm('Delete this page?')){
				$scope.activePage = undefined;
				for (var pageIndex = 0; pageIndex < $scope.bookito.pages.length; pageIndex++) {
					if(page._id === $scope.bookito.pages[pageIndex]._id){
						$scope.bookito.pages.splice([pageIndex], 1);
					}
				}
			}

		};
	}
]);