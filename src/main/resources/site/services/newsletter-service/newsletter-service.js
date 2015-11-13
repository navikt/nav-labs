var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var moment = require("../node_modules/moment/moment.js");
var content = require('/lib/xp/content');
var utils = require("/lib/utilities.js");
var mail = require('/lib/xp/mail');
var confirmationMailView = resolve("confirmation-mail.html");
var ContentModel = require("/lib/ContentModel.js");

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
	var subscribers = getSubscribers(); 
	var subscriber = subscribers.filter(function(sub) {
		return sub.data.emailAddress === email && sub.data.contentOfInterest === contentId; 
	});
	return subscriber.length > 0; 
};

var hasAttempted = function(JSESSIONID, contentOfInterestId) {
	var attempts = timestamps.filter(function(timestamp) {
		return timestamp.JSESSIONID === JSESSIONID && timestamp.contentOfInterestId === contentOfInterestId;
	});
	return attempts.length > 5;
};

exports.get = function() {
	return {
		body: JSON.stringify({
			subscribersPath: getSubscribersPath()	
		}), 
		contentType: 'application/json'
	};
};

exports.post = function(req) {

	var response = null; 
	
	var emailAddress = req.params.email.trim(); 
	var contentOfInterest = req.params.contentOfInterest;

	var contentModel = new ContentModel(contentOfInterest || "--");
	var title = contentModel.isDeleted ? "nav-lab" : contentModel._name; 
	var displayName = contentModel.isDeleted ? "Nav Lab" : contentModel.displayName;

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
	} else if(!isSubscriber(emailAddress, contentOfInterest)) {
		var name = emailAddress.replace("@", "-") + "---" + title;

		response = content.create({
			name: name,
			parentPath: getSubscribersPath(),
			displayName: emailAddress + " - " + displayName,
			contentType: "no.nav.navlabs:subscriber",
			data: {
				emailAddress: emailAddress,
				isConfirmed: false,
				contentOfInterest: contentOfInterest
			}
		});

		if(response && response._id) {
			timestamps.push({
				"JSESSIONID": req.JSESSIONID,
				"timestamp": new Date(),
				"contentOfInterestId": contentOfInterest
			});
		}
		
		var model = {
			confirmationPageUrl: portal.pageUrl({
		  		id: getConfirmationPageId(),
		      	type: "absolute",
		      	params: {
		      		"s": response._id
		      	}
		  	})
		};
		var body = thymeleaf.render(confirmationMailView, model);

		var isMailSent = mail.send({
			from: "helgefredheim@gmail.com",
			to: "helge.fredheim@bekk.no",
			subject: "Hei, husk å bekrefte " + emailAddress ,
			contentType: 'text/html; charset="UTF-8"',
			body: body
		});

		return {
			status: 201, 
			body: {
				success: response.valid === true,
				message: response.data.emailAddress + " ble opprettet. Vi har sendt en bekreftelse til din e-post-adresse.",
				title: "Takk!",
				isMailSent: isMailSent
			},
			contentType: 'application/json'
		};
	} else {
		return {
			body: {
				success: false,
				title: "Du har allerede registrert deg som abonnent!",
				message: "Prøv med en annen adresse."
			}, 
			contentType: 'application/json'
		}
	} 
};