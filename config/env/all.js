'use strict';

module.exports = {
	app: {
		title: 'bookito',
		description: 'Build "Choose your own adventure" books or "Expert System" online',
		keywords: 'book, adventure, cyoa, expert system, decision tree'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/ng-tags-input/ng-tags-input.css',
				'public/lib/angular-notify/dist/angular-notify.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-tags-input/ng-tags-input.js',
				'public/lib/angular-notify/dist/angular-notify.js',
				'public/lib/showdown/compressed/Showdown.js',
				'public/lib/angular-markdown-directive/markdown.js',
				'public/lib/ngSmoothScroll/angular-smooth-scroll.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};