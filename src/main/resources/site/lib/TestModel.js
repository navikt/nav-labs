var ContentModel = require("./ContentModel.js");
var moment = require("../../node_modules/moment/moment.js");
var utils = require("./utilities.js");
moment.locale("nb");

var statusesFormatted = {
  "analyzing": {
    "label": "Analyserer",
    "className": "status-badge status-badge--analyzing"
  },
  "testing": {
    "label": "Test nå!",
    "className": "status-badge status-badge--testing"
  },
  "finished": {
    "label": "Ferdig",
    "className": "status-badge status-badge--done"
  }
}; 

var TestModel = function(key) {
	ContentModel.call(this, key, "Tittel kommer her", {
    body: "<p>Innhold kommer her</p>",
    introduction: "Ingress kommer her"
  });
  if(!this.isDeleted) {
    this.displayTest = typeof this.data.testUrl === "string" && this.data.testUrl.trim() !== "";
    ContentModel.prototype.setPublishDateFormatted.call(this);
    ContentModel.prototype.setModifiedDateFormatted.call(this);
    this.setDays(); 
    this.setStatus();    
  }
	return this; 
};

TestModel.prototype.setDays = function () {
    var expiryMoment = moment(this.data.expiryDate);
    var daysToExpiry = expiryMoment.diff(moment().startOf("day"), "days"); 
    this.daysToExpiry = daysToExpiry !== undefined ? daysToExpiry + "" : "0";
    this.daysToExpiryLabel = this.daysToExpiry === "1" ? "1 dag igjen" : this.daysToExpiry + " dager igjen"
    return this; 
};

TestModel.prototype.setStatus = function() {
  var isFinished = this.data.isFinished;
  var status;
  if(isFinished) {
    status = "finished";
    this.daysToExpiry = "0"; 
  } else {
    if(Number(this.daysToExpiry) > 0) {
      status = "testing";
    } else {
      status = "analyzing"
    }
  }
  this.status = statusesFormatted[status];
	return this; 
};

module.exports = TestModel; 