var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var ContentModel = require('/lib/ContentModel.js');

exports.get = function() {

  var archiveContent = portal.getContent(); 
  var hits = [];

  if(archiveContent.hasChildren) {
    var archivedContents = content.getChildren({
      key: archiveContent._path
    });
    hits = archivedContents.hits; 
    hits = hits.map(function(hit) {
      var article = new ContentModel(hit._id);
      article.setPublishDateFormatted(); 
      return article;
    });
  }

  var view = resolve('../../views/featured-articles.html');

  var body = thymeleaf.render(view, {
      sectionTitle: archiveContent.displayName || "Arkiverte artikler",
      articles: hits  
  });

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};