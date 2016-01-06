var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var content = require('/lib/xp/content');
var ContentModel = require("/lib/ContentModel.js");
var utils = require("/lib/utilities.js");
var TestModel = require("/lib/TestModel.js");
var featuredTestsDecorator = require("/lib/featuredTestsDecorator.js");

exports.get = function() {
	
  var badgeView = resolve('../../views/status-badge.html');	
  var featuredTestsView = resolve('../../views/featured-tests.html'); 
  var archiveView = resolve('test-archive.html');

  var archiveContent = new ContentModel(); 

  // Featured tests - the same as the tests featured on the frontpage

  var site = portal.getSite();
  var frontpageTests = site.page.regions.main.components.filter(function(component) {
    return component.descriptor === "no.nav.navlabs:frontpage-tests";
  });
  frontpageTests = frontpageTests[0];

  var featuredTests = featuredTestsDecorator(frontpageTests.config.test);
  var featuredBody = thymeleaf.render(featuredTestsView, {
    tests: featuredTests,
    sectionTitle: archiveContent.displayName
  });

  // Other tests

  var hits = []; 
  var featuredTestsIds = [];

  if(frontpageTests.config.test) {
    /* If there are any tests on the front page, 
    we place the IDs of those tests in this array */
    featuredTestsIds = frontpageTests.config.test.map(function(item) {
      return item["related-test"];
    });
  }

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
    if(featuredTestsIds.indexOf(test._id) === -1) {
      // Only display tests that are not featured on frontpage
      test.badgeHtml = thymeleaf.render(badgeView, test);
      row.push(test);
      if(row.length === 2) {
        contentRows.push(row)
        row = []
      }  
    }
  }

  var body = thymeleaf.render(archiveView, {
      contentRows: contentRows
  });

  // Return the result
  return {
    body: '<div class="block-xl">' + featuredBody + body + '</div>',
    contentType: 'text/html'
  };

};