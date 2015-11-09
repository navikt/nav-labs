var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js"); 
var ContentModel = require("/lib/ContentModel.js"); 

exports.post = function(req) { 

  var editModeView = resolve('page-json-edit-mode.html');
  var viewModeView = resolve("page-json-view-mode.html");
  var content = portal.getContent(); 
  var mainRegion = content.page.regions.main;

  var model = { 
      mainRegion: mainRegion
  };

  if(req.mode === "edit") {
    return {
      body: thymeleaf.render(editModeView, model),
      contentType: "text/html"
    }
  } else {
    return {
      body: thymeleaf.render(viewModeView, model),
      contentType: 'application/json'
    };
  }

};

exports.get = exports.post; 