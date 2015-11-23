var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");

exports.get = function() {
	
  var badgeView = resolve('../../views/status-badge.html');	

  var archiveContent = portal.getContent(); 
  var hits = [];

  if(archiveContent.hasChildren) {
    var archivedContents = content.getChildren({
      key: archiveContent._path
    });
    hits = archivedContents.hits; 
  }

  var tests = hits.map(function(hit) {
  	return new TestModel(hit._id);
  });

  var contentRows = [];
  var row = []
  for(var i = 0; i < tests.length; i++) {
  	var test = tests[i];
  	test.badgeHtml = thymeleaf.render(badgeView, test);
  	row.push(test);
  	if(row.length === 2) {
  		contentRows.push(row)
  		row = []
  	}
  } 

  var view = resolve('test-archive.html');

  var body = thymeleaf.render(view, {
      content: archiveContent,
      contentRows: contentRows
  });

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};