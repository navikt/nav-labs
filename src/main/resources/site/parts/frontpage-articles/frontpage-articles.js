var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var ContentModel = require('/lib/ContentModel.js');
var utils = require("/lib/utilities.js");

exports.get = function() {

	var view = resolve('frontpage-articles.html');
	var body = "<p>Velg noen artikler du vil vise på forsiden</p>";
	
	var component = portal.getComponent();
	var articleKeys = utils.getContentKeys(component.config["related-article"]);

	var articles = articleKeys.map(function(key) {
		var article = new ContentModel(key);
		article.setPublishDateFormatted(); 
		return article
	});

	if(articles.length) {
		body = thymeleaf.render(view, {
			sectionTitle: component.config.sectionTitle || "Artikler",
			articles: articles
		});
	}

	return {
		body: body,
		contentType: 'text/html'
	};

};