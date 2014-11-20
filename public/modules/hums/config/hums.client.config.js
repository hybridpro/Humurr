'use strict';

// Configuring the Articles module
angular.module('hums').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hums', 'hums', 'dropdown', '/hums(/create)?');
		Menus.addSubMenuItem('topbar', 'hums', 'List Hums', 'hums');
		Menus.addSubMenuItem('topbar', 'hums', 'New Hum', 'hums/create');
	}
]);