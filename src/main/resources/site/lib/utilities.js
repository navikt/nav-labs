var portal = require('/lib/xp/portal');

module.exports = {

  log: function(o) {
      var s = typeof o === "object" ? JSON.stringify(o) : o;
      log.info(s);
  },  

	getContentKeys: function(contentKeys) {

    var keys; 

    if(contentKeys) {
      if(typeof contentKeys === "string") {
        keys = [contentKeys]
        } else if(typeof contentKeys === "object" && contentKeys.length) {
          keys = contentKeys; 
        } else if(JSON.stringify(contentKeys) === "{}") {
          keys = [];
        } else {
          keys = [contentKeys];
        }
      } else {
        keys = [];
      }

    return keys; 
  },

  getAuthorsString: function(authorContents) {
    var authors = authorContents.map(function(author) {
      return author.data.firstName
    });

    var authorString = "av "

    if(authors.length === 1) {
        return authorString + authors[0];
    } else if(authors.length > 1) {
      var comma = ", ";
      var replace = " og ";
      authors = authors.join(comma);
      var index = authors.lastIndexOf(comma);
      return authorString + authors.substring(0, index) + replace + authors.substring(index + comma.length);
    } else {
      return null; 
    } 
  },

  getShareModel: function(content) {

    var title = content.displayName;
    var url = portal.pageUrl({
      path: content._path,
      type: "absolute"
    });
    var domain = "navlabs.no";

    return {
      facebookUrl: "http://www.facebook.com/sharer/sharer.php?u=" + url + "&title=" + title,
      twitterUrl: "http://twitter.com/intent/tweet?status=" + title + ": " + url,
      linkedInUrl: "http://www.linkedin.com/shareArticle?mini=true&url=" + url + "&title=" + title + "&source=" + domain
    }
  }

};

