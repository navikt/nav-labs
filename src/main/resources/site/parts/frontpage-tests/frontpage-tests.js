var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");

exports.get = function() {

  var view = resolve('frontpage-tests.html');
  var badgeView = resolve('../../views/status-badge.html')
  var component = portal.getComponent();
  var body = "";

  var tests = utils.getContentKeys(component.config.test);

  tests = tests.map(function(testObject) {
    var image = null; 

    if(testObject.image) {
      image = content.get({
        key: testObject.image
      });
    } 

    var test = new TestModel(testObject["related-test"]);
    var badgeHtml = thymeleaf.render(badgeView, test);

    return { 
      test: test,
      image: image,
      badgeHtml: badgeHtml
    }
  }); 

  body = thymeleaf.render(view, {
    sectionTitle: component.config.sectionTitle || "Hjelp oss å teste",
    tests: tests
  });

  return {
    body: body,
    contentType: 'text/html'
  };

}; 