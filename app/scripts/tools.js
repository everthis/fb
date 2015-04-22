"use strict";
var tools = {};
var _useful_user_id_hashTable = {},
	_contain_specific_user_hashTable = {};

tools.parseQueryString = function() {
    var str = window.location.search;
    var objURL = {};
    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
};

tools.getAllUsersID = function() {
	var user_id,
		id_range = 99;
	for (var i = 1; i <= id_range; i++) {
		// add specific contact name to 2nd para of callback.
		FBAPI.get_contacts(i, tools.getAllUsersIDCallback(i));
	};
};


tools.getAllUsersIDCallback = function(user_id, passenger_name) {
	return function(data, textStatus, jqXHR) {
			if (data.data !== "") {
				_useful_user_id_hashTable[user_id] = data.data;
				for (var i = data.data.length - 1; i >= 0; i--) {
					if (passenger_name && data.data[i].passenger_name === passenger_name) {
						_contain_specific_user_hashTable[user_id] = data.data;
					};
				};
			};
	   };
};

tools.batchBookTickets = function(date, origin, destination, passenger_type) {
    var query_train_data = {
        "train_date": date,
        "from_station": origin,
        "to_station": destination,
        "purpose_codes": passenger_type
    };
    FBAPI.general_input("U0109", query_train_data, "Query", "POST", tools.batchBookTicketsCallback.bind(this));
};
tools.batchBookTicketsCallback = function(data) {
	for (var per_id in _useful_user_id_hashTable) {
		var _first_contact = _useful_user_id_hashTable[per_id][0].contact_id;

		for (var i = data.data.length - 1; i >= 0; i--) {
		    var dt= data.data[i],
		        train_code = dt.train_code,
		        start_time = dt.start_time,
		        price, seat_type;
	        for (var j = dt.listdata.length - 1; j >= 0; j--) {
	            if (dt.listdata[j].remain_num !== "无" && dt.listdata[j].seat_type === "一等座") {
	                price = dt.listdata[j].ticket_price;
	                seat_type = "M";
	                FBAPI.book_train_tickets(per_id, train_code, "SHH", "NJH", "20150425", start_time, price, "M", [{"passenger_id": _first_contact, "ticket_type": 1}])
	            };
	        };
		};
	};
};

tools.removeAddedPassenger = function(obj) {
	var contact_id = obj.attr('contact_id');
	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;

	if (_bodies_length === 1) {
		_bodies.find(".name input[type='text']").val('');
		_bodies.find(".credential_num input[type='text']").val('');
		_bodies.removeAttr('contact_id');
	} else{
		$("#passenger_section > div[contact_id=" + contact_id + "]").remove();
	};
};
tools.addExtraAdult = function(obj, contact_id, name, number) {
	var extraAdult = $("#adult_template .adult_body").clone();
	extraAdult.attr('contact_id', contact_id)
			  .find(".name input[type='text']").val(name)
			  .end()
			  .find(".credential_num input[type='text']").val(number);
	$('#passenger_section').append(extraAdult);
};
tools.addExistingPassenger = function(obj) {

	var contact_id = obj.attr('contact_id');
	var name = obj.attr('passenger_name');
	var number = obj.attr('passenger_card_no');

	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;
	if ($(_bodies[_bodies_length - 1]).find(".name input[type='text']").val() !== '' ||
		$(_bodies[_bodies_length - 1]).find(".credential_num input[type='text']").val() !== '' ) {
		tools.addExtraAdult(obj, contact_id, name, number);
	} else{
		$(_bodies[_bodies_length - 1]).attr('contact_id', contact_id);
		$(_bodies[_bodies_length - 1]).find(".name input[type='text']").val(name);
		$(_bodies[_bodies_length - 1]).find(".credential_num input[type='text']").val(number);
	};
};

tools.generatePassengers = function() {
	var passengers = [];
	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;
	for (var i = _bodies_length - 1; i >= 0; i--) {
		var per_pass = {};
		per_pass.passenger_id = $(_bodies[i]).attr('contact_id');
		per_pass.ticket_type = 1;
		passengers.push(per_pass);
	};
	return passengers;
};
tools.submitPreservation = function() {
	var user_id,
		train_number,
		from_station_code,
		to_station_code,
		train_date,
		depart_time,
		ticket_price,
		seat_code,
		passengers_info;

	var index_query_params = tools.parseQueryString();


	user_id = "2";
	train_number = index_query_params.train_code;
	from_station_code = index_query_params.origin_code;
	to_station_code = index_query_params.dest_code;
	train_date = index_query_params.date.replace(/-/g,'');
	depart_time = query_specific_train_result.data.start_time;
	seat_code = tools.seatTypeCode(tools.seatCodeProcess(decodeURIComponent(index_query_params.seat_type)));
	passengers_info = tools.generatePassengers();

	ticket_price = tools.generatePrice(index_query_params.seat_type);

	FBAPI.book_train_tickets(user_id,
		train_number,
		from_station_code,
		to_station_code,
		train_date,
		depart_time,
		ticket_price,
		seat_code,
		passengers_info);
};

tools.seatCodeProcess = function(str) {
	if (str === "无座") {
		var price_list = query_specific_train_result.data.listdata;
		var price_list_length = price_list.length;
		return	price_list[price_list_length - 2].seat_type;
	} else{
		return str;
	};
};

tools.generatePrice = function(seat_type) {
	var price_list = query_specific_train_result.data.listdata;
	var price_list_length = price_list.length;

	for (var i = price_list_length - 1; i >= 0; i--) {
		if (price_list[i].seat_type === decodeURIComponent(seat_type)) {
			return price_list[i].ticket_price;
		};
	};
};

tools.seatTypeCode = function(str) {
	var seat_code;
	switch (str) {
	    case "商务座":
	        seat_code = 9;
	        break;
	    case "特等座":
	        seat_code = "P";
	        break;
	    case "一等座":
	        seat_code = "M";
	        break;
	    case "二等座":
	        seat_code = "O";
	        break;
	    case "高级软卧":
	        seat_code = 6;
	        break;
	    case "软卧":
	        seat_code = 4;
	        break;
	    case "硬卧":
	        seat_code = 3;
	        break;
	    case "软座":
	        seat_code = 2;
	        break;
	    case "硬座":
	        seat_code = 1;
	        break;
	}
	return seat_code;
};

tools.codeToSeatType = function(code) {
	var seat_type;
	switch (code) {
	    case 9:
	        seat_type = "商务座";
	        break;
	    case "p":
	        seat_type = "特等座";
	        break;
	    case "M":
	        seat_type = "一等座";
	        break;
	    case "O":
	        seat_type = "二等座";
	        break;
	    case 6:
	        seat_type = "高级软卧";
	        break;
	    case 4:
	        seat_type = "软卧";
	        break;
	    case 3:
	        seat_type = "硬卧";
	        break;
	    case 2:
	        seat_type = "软座";
	        break;
	    case 1:
	        seat_type = "硬座";
	        break;
	}
	return seat_type;
};

$('body').on('click', '.per_pass input[type="checkbox"]', function(event) {
	event.stopPropagation();
	/* Act on the event */

	// add passenger
	if ($(this).is(':checked')) {
		// tools.addExtraAdult($(this));
		tools.addExistingPassenger($(this));
	// remove passenger
	} else {
		tools.removeAddedPassenger($(this));
	};
});

$('body').on('click', '.train.submit_ticket_btn', function(event) {
	event.stopPropagation();
	/* Act on the event */
	tools.submitPreservation();

});

tools.coach = {};
tools.nullToEmptyString = function(obj) {
	if (obj === null || obj === "null") {
		return "";
	} else{
		return obj;
	};
};
tools.replacer = function(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2].join(':');
}
tools.timeFix = function(date) {
	var reg = /(\d+):(\d+):(\d+)/;
	if (reg.test(date)) {
		return date.replace(reg, tools.replacer);
	} else{
		return date;
	};
};
tools.coach.generatePassengers = function() {
	var passengers = [];
	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;
	for (var i = _bodies_length - 1; i >= 0; i--) {
		var per_pass = {};
		per_pass.contact_id = $(_bodies[i]).attr('contact_id');
		passengers.push(per_pass);
	};
	return passengers;
};
tools.coach.submitPreservation = function() {
	var index_query_params = tools.parseQueryString();

	var riding_date = index_query_params.depart_date;
	// var depart_date_time = index_query_params.depart_date_time;
	var depart_time = index_query_params.depart_time;
	var departure_land = decodeURIComponent(index_query_params.departure_land);
	var destination_land = decodeURIComponent(index_query_params.destination_land);
	var destination_station = decodeURIComponent(index_query_params.destination_station);
	var extend_data1 = tools.nullToEmptyString(index_query_params.extend_data1);
	var extend_data2 = tools.nullToEmptyString(index_query_params.extend_data2);
	// var is_bookable = index_query_params.is_bookable;
	// var motorcycle_type = index_query_params.motorcycle_type;
	var operation_type = index_query_params.operation_type;
	var site_code = index_query_params.site_code;
	var starting_station = decodeURIComponent(index_query_params.starting_station);
	var the_ticket_price = index_query_params.ticket_price;
	var train_number = index_query_params.train_number;
	var riding_user_list = tools.coach.generatePassengers();
	var collect_user_id = "2";
	var user_id = "2";

	FBAPI.coach.book_tickets(train_number, departure_land, starting_station, destination_land, destination_station, riding_date, depart_time, the_ticket_price, operation_type, site_code, extend_data1, extend_data2, riding_user_list, collect_user_id, user_id);
};

$('body').on('click', '.coach.submit_ticket_btn', function(event) {
	event.stopPropagation();
	/* Act on the event */
	tools.coach.submitPreservation();

});


