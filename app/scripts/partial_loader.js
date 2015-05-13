'use strict';
$('#user_nav').load('./partials/user_nav.html');
$('#header').load('./partials/header.html', function() {
	auth.check();
	var pn = window.location.pathname;
	var tr = pn.indexOf('train');
	var co = pn.indexOf('coach');
	var pl = pn.indexOf('plane');
	if (tr !== -1 && tr < 10) {
		$('.nav_bar .train').addClass('active');
	};
	if (co !== -1 && co < 10) {
		$('.nav_bar .coach').addClass('active');

	};
	if (pl !== -1 && pl < 10) {
		$('.nav_bar .plane').addClass('active');

	};
});
$('#footer').load('./partials/footer.html');