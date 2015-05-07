'use strict';
var auth = {};
auth.check = function() {
	if (tools.cookies.hasItem("user_id")) {
		var uid = tools.cookies.getItem("user_id");
		var _uid = document.getElementsByClassName("uid")[0];
		_uid.innerHTML =  " " + uid + " ";
		$('.login_signup .login, .login_signup .signup').addClass('hide');
	};
};

var operations = {};
operations.coach_query = function() {
	var index_query_params = tools.parseQueryString();
	var _origin_code = $("#from_city_code").val();
	var _origin_name = $("#from_city").val();
	var _dest_code = $("#to_city_code").val();
	var _dest_name = $("#to_city").val();
	var _date = $("#wangdate").val();
	var ymd = $(this).attr('ymd');
	var query_type = index_query_params.query_type;
	ymd = ymd || _date;
	str = "?origin_code=" + _origin_code + "&origin_name=" + _origin_name + "&dest_code=" + _dest_code + "&dest_name=" + _dest_name + "&date=" + ymd + "&query_type=" + query_type;
	window.location.href ="coach_query.html" + str;
};
operations.getCoachOrigins = function(data) {
	var originsArray = [];
		data = data.data;
	for (var i = 0; i < data.length; i++) {
		originsArray.push(data[i]["starting_station"]);
	};
	return originsArray;
};
operations.uniqueArray = function(arr) {
	if (arr.length <= 1) return arr;
	var uniArr = [];
		uniArr[0] = arr[0];
	for (var i = 1; i < arr.length; i++) {
		if (arr.indexOf(arr[i]) === i) {
			uniArr.push(arr[i]);
		};
	};
	return uniArr;
};
operations.calculatePrice = function() {
	var selected = $('#passenger_section .seat_type option:selected');
	var total_price = 0;
	var selected_len = selected.length;
	var full_ticket_price = +($(selected[0]).attr('ticket_price'));
	for (var i = 0; i < selected_len; i++) {
		total_price += +($(selected[i]).attr('ticket_price'));
	};
	$('.passenger_quantity').text(selected_len);
	$('.per_price').text(full_ticket_price.toFixed(2));
	$('.total_ticket_price').text(total_price.toFixed(1));
};