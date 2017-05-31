var portal = require('/lib/xp/portal');
var content = require('/lib/xp/content');
var utils = require('/lib/utilities.js');
var moment = require("../../node_modules/moment/moment.js");
moment.locale("nb");

var ContentModel = function(key, displayName, defaults) {
	var data; 
	if(key) {
		data = content.get({
			key: key
		});
	} else {
		data = portal.getContent(); 
	}
	this.isDeleted = data === null; 
	if(!this.isDeleted) {
		for(var d in data) {
			this[d] = data[d]
		}

		defaults = defaults || ContentModel.prototype.defaults;

		for(var p in defaults) {
			if(!this.data[p] || this.data[p] === "") {
				this.data[p] = defaults[p];
			}
		}
	} else {
		this.didplayName = "Innholdet er slettet";
	}
	return this; 
};

ContentModel.prototype.defaults = {};

ContentModel.prototype.setPublishDateFormatted = function(format) {
	this.publishDateFormatted = moment(this.createdTime).format(format || "DD.MM.YYYY"); 
	return this; 
};

ContentModel.prototype.setModifiedDateFormatted = function(format) {
	this.modifiedDateFormatted = moment(this.modifiedTime).format(format || "DD.MM.YYYY"); 
	return this; 
}

module.exports = ContentModel; 