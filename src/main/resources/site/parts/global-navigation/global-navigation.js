var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');

exports.get = function() {

	var view = resolve("global-navigation.html");
	var model = {}; 

	var siteConfig = portal.getSiteConfig(); 
	var site = portal.getSite(); 
	
	model.title = site.displayName;

	model.homeUrl = portal.pageUrl({
		path: site._path,
		type: "absolute"
	});

	var body = thymeleaf.render(view, model);

	return {
		body: body,
		contentType: 'text/html'
	};

};