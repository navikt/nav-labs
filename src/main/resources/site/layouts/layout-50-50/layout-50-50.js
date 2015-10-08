var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) {

  var component = portal.getComponent(); 

  var view = resolve('layout-50-50.html');

  var model = {
    component: component,
    leftRegion: component.regions["left"],
    rightRegion: component.regions["right"]
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};