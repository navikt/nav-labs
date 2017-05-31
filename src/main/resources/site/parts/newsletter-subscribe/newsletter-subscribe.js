var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var moment = require("../../node_modules/moment/moment.js");
var utils = require("/lib/utilities.js");

exports.get = function(req) {

	var contentOfInterest = null; 
	var component = portal.getComponent();

	if(component.config.subscriptionType === "relatedTest") {
		var content = portal.getContent(); 
		contentOfInterest = content.data.testOfInterest;
	}

	var view = resolve("newsletter-subscribe.html");
	var body = thymeleaf.render(view, {
		title: "Nyhetsbrev",
		contentOfInterest: contentOfInterest
	});

	return {
		body: body,
		contentType: 'text/html'
	};
};