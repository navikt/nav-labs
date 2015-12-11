var portal = require('/lib/xp/portal'); 
var thymeleaf = require('/lib/xp/thymeleaf'); 
var ContentModel = require("/lib/ContentModel.js");
var utils = require("/lib/utilities.js");


exports.get = function() {

  var article = new ContentModel(); 
  article.setPublishDateFormatted();
  article.setModifiedDateFormatted(); 

  var authorsString, authorKeys = []; 
  if(article.data.authors) {
    authorKeys = utils.getContentKeys(article.data.authors);
    var authorContents = authorKeys.map(function(key) {
      return new ContentModel(key);
    });
    authorsString = utils.getAuthorsString(authorContents);
  }

  article.data.introduction = article.data.introduction || "Her kommer ingress.";
  article.data.body = article.data.body || "<p>Her kommer brødtekst.</p>";
  article.displayName = article.displayName || "Her kommer tittel";
  article.hasAuthors = authorKeys.length > 0;
  article.authorsString = authorsString + ", "; 
  
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