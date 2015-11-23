var TestModel = require("./TestModel.js");
var utils = require("./utilities.js");
var content = require('/lib/xp/content');
var thymeleaf = require('/lib/xp/thymeleaf');

module.exports = function(dataArray) {
  var tests = utils.getContentKeys(dataArray);
  var badgeView = resolve("../views/status-badge.html");

  return tests.map(function(testObject) {
    var image = null; 

    if(testObject.image) {
      image = content.get({
        key: testObject.image
      });
    } 

    if(!testObject["related-test"] || !testObject["image"]) {
      return null; 
    } else {
      var test = new TestModel(testObject["related-test"]);
      
      if(test.isDeleted) {
        return null;
      } else {
        var badgeHtml = thymeleaf.render(badgeView, test);

        return { 
          test: test,
          image: image,
          badgeHtml: badgeHtml
        }        
      }
    }
  }); 	
};