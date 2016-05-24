var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js");

exports.get = function() {

  var view = resolve('thank-you.html');
  var contentModel = portal.getContent();
  var siteConfig = portal.getSiteConfig(); 

  var model = {};
  model.displayName = contentModel.displayName === "" ? "Tittel kommer her" : contentModel.displayName;
  model.body = contentModel.data.body || siteConfig.defualtThankYouText || "<p>Tekst kommer her.</p>";
  model.displayNext = contentModel.data.nextUrl && contentModel.data.nextLabel && contentModel.data.nextUrl.trim() !== "" && contentModel.data.nextLabel.trim() !== "";
  model.nextUrl = contentModel.data.nextUrl;
  model.nextLabel = contentModel.data.nextLabel;

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

}; 