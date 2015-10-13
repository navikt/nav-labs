var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js");

exports.get = function(req) { 

  var view = resolve('page-html.html');

  var content = portal.getContent(); 
  var site = portal.getSite(); 
  var siteConfig = site.data.siteConfig.config; 

  var headerRegion = content.page.regions.header;
  var mainRegion = content.page.regions.main;
  var footerRegion = content.page.regions.footer;

  var siteTitle = site.displayName;
  var siteUrl = portal.pageUrl({
    path: site._path,
    type: "absolute"
  });

  var footerLinks = siteConfig.footerLinks;
  footerLinks = typeof footerLinks === "object" && footerLinks.length === undefined ? [footerLinks] : footerLinks;

  var model = { 
      mainRegion: mainRegion,
      headerRegion: headerRegion, 
      footerRegion: footerRegion,
      footerLinks: footerLinks,
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