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

exports.post = function(req) {

	var response = null; 
	
	var emailAddress = req.params.email.trim(); 
	var contentOfInterest = req.params.contentOfInterest;

	var contentOfInterestModel = new ContentModel(contentOfInterest || "--");
	var contentOfInterestTitle = contentOfInterestModel.isDeleted ? "nav-lab" : contentOfInterestModel._name; 
	var contentOfInterestDisplayName = contentOfInterestModel.isDeleted ? "Nav Lab" : contentOfInterestModel.displayName;

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
		var name = emailAddress.replace("@", "-") + "---" + contentOfInterestTitle;

		response = content.create({
			name: name,
			parentPath: getSubscribersPath(),
			displayName: emailAddress + " - " + contentOfInterestDisplayName,
			contentType: "no.nav.navlabs:subscriber",
			data: {
				emailAddress: emailAddress,
				isConfirmed: false,
				contentOfInterest: contentOfInterest
			}
		});
		
		var mailModel = {
			confirmationPageUrl: portal.pageUrl({
		  		id: getConfirmationPageId(),
		      	type: "absolute",
		      	params: {
		      		"s": response._id
		      	}
		  	})
		};
		var mailBody = thymeleaf.render(confirmationMailView, mailModel);

		var isMailSent = mail.send({
			from: "helgefredheim@gmail.com",
			to: "helge.fredheim@bekk.no",
			subject: "Hei, husk å bekrefte " + emailAddress,
			contentType: 'text/html; charset="UTF-8"',
			body: mailBody
		});

		var title = isMailSent ? "Takk!" : "Ooops!";
		var message = isMailSent ? "Det gjenstår bare en liten ting. Vi har sendt en bekreftelse til din e-post-adresse med en lenke som du må klikke på." : "Beklager, det oppstod en feil :-( Prøv igjen litt senere!";
		var isContentDeleted = false; 

		if(!isMailSent) {
			isContentDeleted = content.delete({
				key: response._path
			});
		}

		if(response && response._id && isMailSent && !isContentDeleted) {
			timestamps.push({
				"JSESSIONID": req.JSESSIONID,
				"timestamp": new Date(),
				"contentOfInterestId": contentOfInterest
			});
		}

		return {
			status: isMailSent && !isContentDeleted ? 201 : 200, 
			body: {
				message: message,
				title: title,
				success: isMailSent && !isContentDeleted
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