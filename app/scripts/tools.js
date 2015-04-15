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
	$(".adult_body .name input[type='text']").val('');
	$(".adult_body .credential_num input[type='text']").val('');
	$(".adult_body").removeAttr('contact_id');


};
tools.addExtraAdult = function() {
	var extraAdult = $("#adult_template .adult_body").clone();
	$('#passenger_section').append(extraAdult);
};
tools.addExistingPassenger = function(obj) {
	var contact_id = obj.attr('contact_id');
	var name = obj.attr('passenger_name');
	var number = obj.attr('passenger_card_no');

	$(".adult_body").attr('contact_id', contact_id);
	$(".adult_body .name input[type='text']").val(name);
	$(".adult_body .credential_num input[type='text']").val(number);
};

$('body').on('click', '.per_pass input[type="checkbox"]', function(event) {
	event.stopPropagation();
	/* Act on the event */

	// add passenger
	if ($(this).is(':checked')) {
		tools.addExtraAdult();
		// tools.addExistingPassenger($(this));
	// remove passenger
	} else {
		tools.removeAddedPassenger($(this));
	};
});
