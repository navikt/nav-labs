var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function() {

  var view = resolve('comments-show.html');
  var content = portal.getContent(); 
  var siteConfig = portal.getSiteConfig(); 

  var model = {
  	id: content._id,
  	title: content.displayName,
  	url: portal.pageUrl({
  		path: content._path,
      type: "absolute"
  	}),
  	shortname: siteConfig.disqusShortName || "nav-labs-test",
    sectionTitle: "Kommentarer"
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};