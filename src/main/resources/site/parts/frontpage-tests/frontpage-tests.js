var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");
var featuredTestsDecorator = require("/lib/featuredTestsDecorator.js");

exports.get = function() {

  var view = resolve('../../views/featured-tests.html');
  var badgeView = resolve('../../views/status-badge.html');
  var component = portal.getComponent();
  var body = "";

  var tests = featuredTestsDecorator(component.config.test);

  body = thymeleaf.render(view, {
    sectionTitle: component.config.sectionTitle || "Hjelp oss å teste",
    tests: tests
  });

  body = '<div class="block-xl">' + body + '</div>';

  return {
    body: body,
    contentType: 'text/html'
  };

}; 