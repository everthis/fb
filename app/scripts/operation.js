'use strict';
var auth = {};
auth.check = function() {
	if (tools.cookies.hasItem("user_name")) {
		var user_name = tools.cookies.getItem("user_name");
		var _uid = document.getElementsByClassName("uid")[0];
		_uid.innerHTML =  " " + user_name + " ";
		$('.login_signup .login, .login_signup .signup').addClass('hide');
	} else if (tools.cookies.hasItem("user_id")){
		var uid = tools.cookies.getItem("user_id");
		var _uid = document.getElementsByClassName("uid")[0];
		_uid.innerHTML =  " " + uid + " ";
		$('.login_signup .login, .login_signup .signup').addClass('hide');
	} else {
		$('.login_signup .login, .login_signup .login').removeClass('hide');
		$('.login_signup .logout').addClass('hide');
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
	var str = "?origin_code=" + _origin_code + "&origin_name=" + _origin_name + "&dest_code=" + _dest_code + "&dest_name=" + _dest_name + "&date=" + ymd + "&query_type=" + query_type;
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
operations.fullTicketsPrice = function() {
	var adult_bodies = $('#passenger_section .adult_body');
	var adults_len = adult_bodies.length;
	var selected = $('#passenger_section .seat_type option:selected');
	var full_ticket_price = +($(selected[0]).attr('ticket_price'));
	var ft = {
		"price": full_ticket_price,
		"quantity": adults_len
	};
	return ft;
};

operations.processHalfPrice = function() {
	var child_len = tools.childPassengers();
	var half_price = ($('.full_per_price').text() / 2).toFixed(2);
	child_len > 0 ? $('.right_area .child_ticket_price').removeClass('hide') : $('.right_area .child_ticket_price').addClass('hide');
	// $('.right_area .child_ticket_price').removeClass('hide');
	$('.half_price_quantity').text(child_len);
	$('.half_per_price').text(half_price);
	var hp = {
		"price": half_price,
		"quantity": child_len
	};
	return hp;
};


operations.calculatePrice = function() {
	var fulls = this.fullTicketsPrice();
	var halves = this.processHalfPrice();
	var total_price = fulls.price * fulls.quantity + halves.price * halves.quantity;
	$('.full_price_quantity').text(fulls.quantity);
	$('.total_passenger_quantity').text(fulls.quantity + halves.quantity);
	$('.full_per_price').text(fulls.price.toFixed(2));
	$('.total_ticket_price').text(total_price.toFixed(1));
};