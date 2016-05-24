var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var moment = require("../node_modules/moment/moment.js");
var content = require('/lib/xp/content');
var utils = require("/lib/utilities.js");
var httpClientLib = require('/lib/xp/http-client');

var timestamps = [];

var getSubscribersPath = function() {
	var config = portal.getSiteConfig(); 
	var content = new ContentModel(config.newsletterSubscriberArchive);
	return content._path;
};

var getConfirmationPageId = function() {
	var config = portal.getSiteConfig();
	return config.newsletterConfirmationPage;
};

var getSubscribers = function () {
	return content.getChildren({
		key: getSubscribersPath()
	}).hits;
};

var isSubscriber = function (email, contentId) {
	return false; 
};

var hasAttempted = function(JSESSIONID, contentOfInterestId) {
	var attempts = timestamps.filter(function(timestamp) {
		return timestamp.JSESSIONID === JSESSIONID && timestamp.contentOfInterestId === contentOfInterestId;
	});
	return attempts.length > 5;
};

exports.post = function(req) {

	var config = portal.getSiteConfig();
	var mailchimpApiKey = config.mailchimpApiKey

	var response = null; 
	var emailAddress = req.params.email.trim(); 
	var contentOfInterest = "";

	if(emailAddress.trim() === "" || !emailAddress) {
		return {
			body: JSON.stringify({
				success: false,
				title: "Ugyldig e-post",
				message: "Vennligst oppgi en gyldig e-post-adresse"
			}),
			contentType: 'application/json'	
		};
	} else if(hasAttempted(req.JSESSIONID, contentOfInterest)) {
		return {
			body: JSON.stringify({
				success: false, 
				title: "Du har nettopp opprettet et abonnement",
				message: "Vennligst prøv igjen senere."
			}),
			contentType: 'application/json'
		};
	} else {

		var apiKey = mailchimpApiKey;
		var url = "https://us12.api.mailchimp.com/3.0/lists/9d11cc9f32/members/";

		var response = httpClientLib.request({
		    url: url,
		    method: 'POST',
		    connectionTimeout: 20000,
		    readTimeout: 5000,
		    body: JSON.stringify({
		    	"email_address": emailAddress,
		    	"status": "pending"
		    }),
		    contentType: 'application/json',
		    headers: {
			    "authorization": "Basic YWJjOmQ1MTYyZmY2Y2FjYWI2MzljZGYxYmZmNWZhMjMyYjRjLXVzMTI=",
			    "cache-control": "no-cache"
			}
		});

		if(response.status === 400) {
			return {
				body: {
					success: false,
					title: "Du har allerede registrert deg som abonnent!",
					message: "Prøv med en annen adresse."
				}, 
				contentType: 'application/json'
			}
		} else {
			return {
				body: {
					title: "Straks ferdig!",
					message: "Vi har sendt deg en e-post med en lenke som du må klikke på for å aktivere ditt abonnement.",
					success: true
				},
				contentType: 'application/json'
			}
		}
	}
};