var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) {

  // Find the current component.
  var component = portal.getComponent(); 

  // Resolve the view
  var view = resolve('layout-max-width.html');

  // Define the model
  var model = {
    component: component,
    centerRegion: component.regions["center"],
  };

  // Render a thymeleaf template
  var body = thymeleaf.render(view, model);

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};