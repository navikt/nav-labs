var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js"); 
var ContentModel = require("/lib/ContentModel.js"); 

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

  // sharing

  var shareImage = (function() {
    if(content.data.socialMediaImage) {
      return portal.imageUrl({
        id: content.data.socialMediaImage,
        scale: 'width(700)',
        type: 'absolute'
      });
    } else {
      return null; 
    }
  })();
  var shareUrl = portal.pageUrl({
    path: content._path,
    type: "absolute"
  });

  // global menu

  var globalMenuItems = siteConfig.globalMenuItems;
  globalMenuItems = typeof globalMenuItems === "object" && globalMenuItems.length === undefined ? [globalMenuItems] : globalMenuItems;

  globalMenuItems = globalMenuItems.map(function(item) {
    var contentModel = new ContentModel(item.menuItem);
    if(contentModel.isDeleted) {
      return null;
    } else {
      return {
        text: item.text,
        url: portal.pageUrl({
          path: contentModel._path
        }),
        isActive: content._path.indexOf(contentModel._path) > -1 
      }      
    }
  });

  // footer

  var footerLinks = siteConfig.footerLinks;
  footerLinks = typeof footerLinks === "object" && footerLinks.length === undefined ? [footerLinks] : footerLinks;

  var model = { 
      mainRegion: mainRegion,
      headerRegion: headerRegion, 
      footerRegion: footerRegion,
      footerLinks: footerLinks,
      pageTitle: content.displayName && content.displayName !== siteTitle && content.displayName !== "" ? content.displayName + ' | ' + siteTitle : siteTitle,
      language: content.language || "no",
      siteTitle: siteTitle,
      siteUrl: siteUrl,
      departmentNameAndYear: siteConfig.departmentName || "Arbeids- og velferdsetaten" + " " + new Date().getFullYear(),
      header: {
        typoLogo: siteConfig.logoTypoText || "Lab.",
        menuItems: globalMenuItems
      },
      share: {
        title: content.data.socialMediaTitle || content.displayName || siteTitle,
        description: content.data.socialMediaIntroduction,
        image: shareImage,
        url: shareUrl,
        siteTitle: siteTitle,
        facebookAppId: siteConfig.facebookAppId || null
      }
  };

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};