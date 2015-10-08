var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf'); 
var ContentModel = require("/lib/ContentModel.js");

exports.get = function() {

  var article = new ContentModel(); 
  article.setPublishDateFormatted(); 

  article.data.introduction = article.data.introduction || "Her kommer ingress.";
  article.data.body = article.data.body || "<p>Her kommer brødtekst.</p>";
  article.displayName = article.displayName || "Her kommer tittel";

  var model = {
    article: article
  };

  var view = resolve('article-show.html');

  var body = thymeleaf.render(view, model);

  return {
    body: body,
    contentType: 'text/html'
  };

};  