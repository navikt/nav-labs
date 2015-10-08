var portal = require('/lib/xp/portal');
var content = require('/lib/xp/content');
var moment = require("../node_modules/moment/moment.js");
moment.locale("nb");

var ContentModel = function(key) {
	var data; 
	if(key) {
		data = content.get({
			key: key
		});
	} else {
		data = portal.getContent(); 
	}
	for(var d in data) {
		this[d] = data[d]
	}   
	return this; 
};

ContentModel.prototype.setPublishDateFormatted = function(format) {
	this.publishDateFormatted = moment(this.createdTime).format(format || "DD.MM.YYYY"); 
	return this; 
};

module.exports = ContentModel; 