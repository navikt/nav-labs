var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var moment = require("../node_modules/moment/moment.js");
var utils = require("/lib/utilities.js");
var ContentModel = require("/lib/ContentModel.js");

exports.get = function(req) {

	var view = resolve("newsletter-admin.html");

	var subscriberId = req.params.s;

	if(typeof subscriberId !== "string") {
		return {
			contenttype: "text/html",
			body: thymeleaf.render(view, {
				title: "Vennligst oppgi ID"
			})
		}
	} else {
		var subscriber = new ContentModel(subscriberId);
		if(subscriber && !subscriber.isDeleted) {
			if(subscriber.data.isConfirmed) {
				return {
					contenttype: "text/html",
					body: thymeleaf.render(view, {
						title: "Du er allerede abonnent!"
					})
				};
			} else {
				var res = content.modify({
					key: subscriber._id,
					editor: function(c) {
						c.data.isConfirmed = true;
						return c;
					}
				});
				if(res && res.data && res.data.isConfirmed) {
					return {
						contenttype: "text/html",
						body: thymeleaf.render(view, {
							title: "Du er nå blitt abonnent!"
						})
					};
				} else {
					return {
						contenttype: "text/html",
						body: thymeleaf.render(view, {
							title: "Det oppstod en feil!"
						})
					};
				} 
			}
		} else { 
			return {
				contenttype: "text/html",
				body: thymeleaf.render(view, {
					title: "Fant ingen abonnent!"
				})
			};
		}
	}

};