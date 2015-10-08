var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');

exports.get = function() {

  var archiveContent = portal.getContent(); 
  var archivedContents; 

  if(archiveContent.hasChildren) {
    archivedContents = content.getChildren({
      key: archiveContent._path
    });
  }

  var view = resolve('content-archive.html');

  var body = thymeleaf.render(view, {
      content: archiveContent,
      archivedContents: archivedContents.hits
  });

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

}; 