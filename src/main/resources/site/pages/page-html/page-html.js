var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf');

exports.get = function(req) { 

  var view = resolve('page-html.html');

  var content = portal.getContent(); 
  var site = portal.getSite(); 
  var siteConfig = site.data.siteConfig.config; 

  var headerRegion = content.page.regions.header;
  var mainRegion = content.page.regions.main;
  var footerRegion = content.page.regions.footer;

  var siteTitle = siteConfig.siteTitle;
  var siteUrl = portal.pageUrl({
    path: site._path,
    type: "absolute"
  });

  var model = { 
      mainRegion: mainRegion,
      headerRegion: headerRegion, 
      footerRegion: footerRegion,
      footerLinks: siteConfig.footerLinks,
      pageTitle: content.displayName ? content.displayName + ' | ' + siteTitle : siteTitle,
      language: content.language || "no",
      siteTitle: siteTitle,
      siteUrl: siteUrl,
      departmentNameAndYear: siteConfig.departmentName || "Arbeids- og velferdsetaten" + " " + new Date().getFullYear()
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};