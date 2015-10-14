(function() {

	var openWindow = function(e) {

		if(e && e.preventDefault) {
			e.preventDefault()
		}

		var windowWidth = document.documentElement.clientWidth;
		var windowHeight = document.documentElement.clientHeight;

	    var width  = 575,
	        height = 400,
	        left   = (windowWidth  - width)  / 2,
	        top    = (windowHeight - height) / 2,
	        url    = this.href,
	        title  = this.innerHTML, 
	        opts   = 'status=1' +
	                 ',width='  + width  +
	                 ',height=' + height +
	                 ',top='    + top    +
	                 ',left='   + left;
	    
	    window.open(url, title, opts);		
	};	

	var socialMediaElements = document.getElementsByClassName("js-share");

	for(var i = 0; i < socialMediaElements.length; i++) {
		socialMediaElements[i].addEventListener("click", openWindow);
	}

})(); 