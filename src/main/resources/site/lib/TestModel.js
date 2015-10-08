var ContentModel = require("./ContentModel.js");
var moment = require("../node_modules/moment/moment.js");
var utils = require("./utilities.js");
moment.locale("nb");

var statusesFormatted = {
  "analyzing": {
    "label": "Analyserer",
    "className": "status-badge status-badge--analyzing"
  },
  "testing": {
    "label": "Tester nå!",
    "className": "status-badge status-badge--testing"
  },
  "finished": {
    "label": "Ferdig",
    "className": "status-badge status-badge--done"
  }
}; 

var TestModel = function(key) {
	ContentModel.call(this, key);
	ContentModel.prototype.setPublishDateFormatted.call(this);
	this.setDays(); 
	this.setStatus();
	return this; 
};

TestModel.prototype.setDays = function () {
    var expiryMoment = moment(this.data.expiryDate);
    var daysToExpiry = expiryMoment.diff(moment(), "days");
    this.daysToExpiry = daysToExpiry !== undefined ? daysToExpiry + "" : "0";
    return this; 
};

TestModel.prototype.setStatus = function() {
	var s = this.data.status; 
	this.status = statusesFormatted[s];
	return this; 
};

module.exports = TestModel; 