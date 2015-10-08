var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');

exports.get = function() {

  var view = resolve('header-banner.html');
  var component = portal.getComponent(); 
  var site = portal.getSite(); 

  var model = component.config; 
  var titleArray = site.displayName.trim().split(" ");

  model.tagline = site.description;
  model.titleOne = titleArray.shift();
  model.titleTwo = titleArray.join(" ");

  var body = thymeleaf.render(view, model);   

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};  