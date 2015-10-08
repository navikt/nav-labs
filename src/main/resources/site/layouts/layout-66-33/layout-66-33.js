exports.get = function(req) {

  // Find the current component.
  var component = execute('portal.getComponent');

  // Resolve the view
  var view = resolve('layout-66-33.html');

  // Define the model
  var model = {
    component: component,
    leftRegion: component.regions["left"],
    rightRegion: component.regions["right"]
  };

  // Render a thymeleaf template
  var body = execute('thymeleaf.render', {
    view: view,
    model: model
  });

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};