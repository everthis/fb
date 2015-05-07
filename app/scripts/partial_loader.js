'use strict';
$('#user_nav').load('./partials/user_nav.html');
$('#header').load('./partials/header.html', function() {
	auth.check();
});
$('#footer').load('./partials/footer.html');