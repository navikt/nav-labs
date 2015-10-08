var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");

exports.get = function() {

  var view = resolve('thank-you.html');
  var component = portal.getComponent();
  var content = portal.getContent();

  var model = content;
  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

}; 