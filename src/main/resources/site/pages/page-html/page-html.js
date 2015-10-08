var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) { 

  var view = resolve('page-html.html');

  var content = portal.getContent(); 

  var headerRegion = content.page.regions.header;
  var mainRegion = content.page.regions.main;
  var footerRegion = content.page.regions.footer;

  var model = {
      mainRegion: mainRegion,
      headerRegion: headerRegion, 
      footerRegion: footerRegion,
      pageTitle: content.displayName ? content.displayName + ' | ' + "Nav Labs" : "Nav Labs",
      language: content.language || "no"
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};