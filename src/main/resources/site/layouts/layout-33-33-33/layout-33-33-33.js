var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) {

  var component = portal.getComponent(); 

  var view = resolve('layout-33-33-33.html');

  var model = {
    component: component,
    leftRegion: component.regions["left"],
    centerRegion: component.regions["center"],
    rightRegion: component.regions["right"]
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};