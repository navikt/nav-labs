var thymeleaf = require('/lib/xp/thymeleaf');
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");
var ContentModel = require("/lib/ContentModel.js");

exports.get = function() {

  var testModel = new TestModel(); 
  var authorsString, authorKeys = []; 
  if(testModel.data.authors) {
    authorKeys = utils.getContentKeys(testModel.data.authors);
    var authorContents = authorKeys.map(function(key) {
      return new ContentModel(key);
    });
    authorsString = utils.getAuthorsString(authorContents);
  }  
  testModel.hasAuthors = authorKeys.length > 0; 
  testModel.authorsString = authorsString;

  var view = resolve('test-show.html');
  var badgeView = resolve("../../views/status-badge.html");

  var badgeHtml = thymeleaf.render(badgeView, testModel);

  var body = thymeleaf.render(view, {
    test: testModel,
    badgeHtml: badgeHtml
  }); 

  // Return the result
  return {
    body: body,
    contentType: 'text/html'
  };

};