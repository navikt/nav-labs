var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js");
var content = require("/lib/xp/content");

exports.get = function() {

	var view = resolve('social-media-share.html');

	var result = portal.getContent(); 

	if(result.data["content-to-share"]) {
		result = content.get({
			key: result.data["content-to-share"]
		});
	}

	var body; 

	if(!result) {
		body = ""; 
	} else {
		body = thymeleaf.render(view, utils.getShareModel(result));
	}

	return {
		body: body,
		contentType: 'text/html'
	};

};