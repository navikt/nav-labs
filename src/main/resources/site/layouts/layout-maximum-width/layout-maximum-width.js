var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) {

  var component = portal.getComponent(); 

  var view = resolve('layout-maximum-width.html');

  var model = {
    component: component,
    centerRegion: component.regions["center"],
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};