var $ = require("./vendor/jquery.js");

var init = function(el) {

	el.on("click", function(event) {
	    var width  = 575,
	        height = 400,
	        left   = ($(window).width()  - width)  / 2,
	        top    = ($(window).height() - height) / 2,
	        url    = this.href,
	        title  = $(this).text(), 
	        opts   = 'status=1' +
	                 ',width='  + width  +
	                 ',height=' + height +
	                 ',top='    + top    +
	                 ',left='   + left;
	    
	    window.open(url, title, opts);
	 
	    return false;		
	})

};

module.exports = {
	init: init
}