ons.bootstrap('app', ['ui.bootstrap', 'ngMessages','ngCordova','truncate', 'timer', 'angularLoad','onsen','famous.angular']).run(function($cordovaStatusbar){
	document.addEventListener('deviceready', function () {
	  $cordovaStatusbar.overlaysWebView(true);
	}, false);
}).run(function(ServerAddress){

}).run(function(angularLoad,ServerAddress){
   
}).filter('countdown', function() {
  return function(input) {
  	var now  = new Date();
  	var countdown = input - now.getTime();

  	if(countdown<0)
  		return '00:00:00:00';

	// the difference timestamp
	var timestamp = input - Date.now();

	timestamp /= 1000; // from ms to seconds

	var component = function (x, v) {
	    return Math.floor(x / v);
	}

	var $div = $('div');

	var days    = component(timestamp, 24 * 60 * 60),      // calculate days from timestamp
		hours   = component(timestamp,      60 * 60) % 24, // hours
		minutes = component(timestamp,           60) % 60, // minutes
		seconds = component(timestamp,            1) % 60; // seconds

 	var numberFixedLen=	function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
    };
    return numberFixedLen(days, 2)+':'+numberFixedLen(hours, 2)+':'+numberFixedLen(minutes, 2)+':'+numberFixedLen(seconds, 2);
  };
}).filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });
  