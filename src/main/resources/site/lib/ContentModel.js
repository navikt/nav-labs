var portal = require('/lib/xp/portal');
var content = require('/lib/xp/content');
var utils = require('/lib/utilities.js');
var moment = require("../node_modules/moment/moment.js");
moment.locale("nb");

var ContentModel = function(key, displayName, defaults) {
	var data; 
	if(key) {
		data = content.get({
			key: key
		});
	} else {
		data = portal.getContent(); 
		utils.log(data);
	}
	for(var d in data) {
		this[d] = data[d]
	}

	defaults = defaults || ContentModel.prototype.defaults;

	for(var p in defaults) {
		if(!this.data[p] || this.data[p] === "") {
			this.data[p] = defaults[p];
		}
	}

	return this; 
};

ContentModel.prototype.defaults = {};

ContentModel.prototype.setPublishDateFormatted = function(format) {
	this.publishDateFormatted = moment(this.createdTime).format(format || "DD.MM.YYYY"); 
	return this; 
};

module.exports = ContentModel; 