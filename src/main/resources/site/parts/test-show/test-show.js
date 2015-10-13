var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");

exports.get = function() {

  var testModel = new TestModel(); 

  var view = resolve('test-show.html');
  var badgeView = resolve("../../views/status-badge.html");

  utils.log(testModel);

  var badgeHtml = ""; // thymeleaf.render(badgeView, testModel);

  var body = thymeleaf.render(view, {
    test: testModel,
    badgeHtml: badgeHtml
  }); 

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};