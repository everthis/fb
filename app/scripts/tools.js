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
tools.cookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};
tools.getGender = function(id) {
    var sexno,sex
    if(id.length==18){
        sexno=id.substring(16,17)
    }else if(id.length==15){
        sexno=id.substring(14,15)
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var tempid=sexno%2;
    if(tempid==0){
        sex='F'
    }else{
        sex='M'
    }
    return sex
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
	var contact_id = obj.attr('contact_id') || '';
	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;

	if (_bodies_length === 1) {
		_bodies.find(".name input[type='text']").val('').prop("disabled", false);
		_bodies.find(".credential_num input[type='text']").val('').prop("disabled", false);
		_bodies.find(".credential_type select").prop("disabled", false);
		_bodies.removeAttr('contact_id');
	} else{
		if (contact_id === '') {
			obj.remove();
		} else{
			$("#passenger_section > div[contact_id=" + contact_id + "]").remove();
		};
	};
};
tools.addExtraAdult = function(obj, contact_id, name, number, card_type_code) {
	var extraAdult = $("#adult_template .adult_body").clone();
	this.operatePassengerData(extraAdult, contact_id, name, number, card_type_code);
	$('#passenger_section').append(extraAdult);
};
tools.addExistingPassenger = function(obj) {

	var contact_id = obj.attr('contact_id');
	var name = obj.attr('passenger_name');
	var number = obj.attr('passenger_card_no');
	var card_type_code = obj.attr('card_type_code');

	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;
	var findResult = this.findFirstEmptyRow();
	if (findResult === 'not found' ) {
		tools.addExtraAdult(obj, contact_id, name, number, card_type_code);
	} else{
		this.operatePassengerData(findResult, contact_id, name, number, card_type_code);
	};
};
tools.operatePassengerData = function(obj, contact_id, name, number, card_type_code) {
	$(obj).attr('contact_id', contact_id);
	$(obj).find(".name input[type='text']").val(name).prop("disabled", true);
	$(obj).find(".credential_num input[type='text']").val(number).prop("disabled", true);
	$(obj).find(".credential_type select option").filter(function() {
									    return $(this).prop("value") === card_type_code;
									}).prop('selected', true);
	$(obj).find(".credential_type select").prop("disabled", true);
};
tools.findFirstEmptyRow = function() {
	var _bodies = $("#passenger_section > .adult_body");
	var _bodies_length = _bodies.length;
	for(var i = 0; i < _bodies_length; i++) {
		if ($(_bodies[i]).find(".name input[type='text']").val() === '' && $(_bodies[i]).find(".credential_num input[type='text']").val() === '') {
			break;
		};
	}
	return _bodies[i] || 'not found';
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


tools.isTrainOrderComplete = function(code) {
	var isComplete = false;
	switch (code) {
		case 7:
		case 8:
		  isComplete = true;
		  break;
		default:
		  isComplete = false;
	}
	return isComplete;
};

tools.isCoachOrderComplete = function(code) {
	var isComplete = false;
	switch (code) {
		case 1:
		case 8:
		case 11:
		  isComplete = true;
		  break;
		default:
		  isComplete = false;
	}
	return isComplete;
};

tools.generateContactsToAdd = function() {
	var bodies = $("#passenger_section > .adult_body");
	var bodies_length = bodies.length;
	var toAddArray = [];
	for (var i = 0; i < bodies_length; i++) {
		var attr = $(bodies[i]).attr('contact_id');
		// For some browsers, `attr` is undefined; for others,
		// `attr` is false.  Check for both.
		if (typeof attr === typeof undefined || attr === false) {
			 toAddArray.push(bodies[i]);
		}
	};
	return toAddArray;
};
tools.generateContactAddition = function() {
	var add_array = this.generateContactsToAdd();
	var add_array_length =  add_array.length;
	for (var i = 0; i < add_array_length; i++) {
		var real_name = $(add_array[i]).find('.name input').val(),
			id_type_code = $(add_array[i]).find('.credential_type select').val(),
			id_type = $(add_array[i]).find('.credential_type select option:selected').text(),
			id_number = $(add_array[i]).find('.credential_num input').val(),
			mobile_phone = '',
			email = '',
			passenger_type = $(add_array[i]).prop('type'),
			sex_code = this.getGender(id_number) === 'M' ? 1 : 2;
	FBAPI.add_contact(tools.cookies.getItem("user_id"), real_name, id_type_code, id_type, id_number, mobile_phone, email, passenger_type, sex_code);
	};

};

tools.getSpecificCheckbox = function(contact_id) {
	var pass_area = $('.pass_area input[type="checkbox"]:checked');
	for (var i = 0; i < pass_area.length; i++) {
		if ($(pass_area[i]).attr('contact_id') === contact_id) {
			$(pass_area[i]).prop('checked', false)
		};
	};
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
	var depart_time = index_query_params.depart_time;
	var departure_land = decodeURIComponent(index_query_params.departure_land);
	var destination_land = decodeURIComponent(index_query_params.destination_land);
	var destination_station = decodeURIComponent(index_query_params.destination_station);
	var extend_data1 = tools.nullToEmptyString(index_query_params.extend_data1);
	var extend_data2 = tools.nullToEmptyString(index_query_params.extend_data2);
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

tools.isLoggedIn = function() {
	if (tools.cookies.hasItem("user_id")) {

	} else{

	};
};

/**
 * [countDown description]
 * @param  {[type]} duration [seconds]
 * @param  {[type]} display  [element object]
 * @return {[type]}          [description]
 */
tools.countDown = function(duration, display) {
	    var start = Date.now(),
	        diff,
	        interval,
	        hours,
	        minutes,
	        seconds;
	    display.disabled = true;
	    function timer() {
	        // get the number of seconds that have elapsed since
	        // startTimer() was called
	        diff = duration - (((Date.now() - start) / 1000) | 0);

	        // does the same job as parseInt truncates the float
	        hours   = (diff / 3600) | 0;
	        minutes = ((diff - hours * 60 * 60) / 60)   | 0;
	        seconds = (diff % 60)   | 0;

	        hours   = hours   < 10 ? "0" + hours   : hours;
	        minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? "0" + seconds : seconds;

	        // display.textContent = hours + minutes + seconds;
	        var tmp = hours + minutes + seconds,
	            tmp_string = tmp.toString();
	        display.value = tmp_string.slice(4) + "秒后重新获取";

	        if (diff <= 0) {
	            // add one second so that the count down starts at the full duration
	            // example 05:00 not 04:59
	            // start = Date.now() + 1000;
	            clearInterval(interval);
		        display.value = "重新获取验证码";
			    display.disabled = false;
	        }
	    };
	    // do not wait a full second before the timer starts
	    timer();
	    interval = setInterval(timer, 1000);
};



$('body').on('click', '.coach.submit_ticket_btn', function(event) {
	event.stopPropagation();
	/* Act on the event */
	tools.coach.submitPreservation();

});

$('body').on('click', '.add_passenger_btn', function(event) {
	event.preventDefault();
	/* Act on the event */
	var user_id, real_name, id_type_code, id_type, id_number, mobile_phone, email_address, passenger_type, sex_code;
		user_id = tools.cookies.getItem("user_id");
		real_name = $('.realName').val();
		id_type_code = $('.cre_type').val();
		id_type = $(".cre_type option:selected").text();
		id_number = $('.cre_id').val();
		mobile_phone = $('.cellphone_num').val();
		email_address = $('.email_address').val();
		passenger_type = $('.passenger_type').val();
		sex_code = $('input[name=sex]:checked').val();

	// FBAPI.add_contact(user_id, real_name, id_type_code, id_type, id_number, passenger_type, sex_code);
	FBAPI.add_contact(user_id, real_name, id_type_code, id_type, id_number, mobile_phone, email_address, passenger_type, sex_code);
});


$('body').on('click', '.per_passenger .delete', function(event) {
	event.stopPropagation();
	FBAPI.delete_contact(tools.cookies.getItem("user_id"), $(this).attr('deletecontact'));
	/* Act on the event */
});

$('body').on('click', '#get_cellphone_val_code_btn', function(event) {
	event.stopPropagation();
	tools.countDown(10, this);
	var cellphone_number = $(".cellphone_num_input").val().trim();
	FBAPI.cellphone_val(cellphone_number, "2");
	/* Act on the event */
});

$('body').on('click', '#login_btn', function(event) {
	event.stopPropagation();
	var cellphone_number = $(".cellphone_num_input").val().trim();
	var val_code = $("#cellphone_val_code").val().trim();
	FBAPI.signup_firstLogin(cellphone_number, val_code, "2");
	/* Act on the event */
});

$('body').on('click', '.add_passenger_btn', function(event) {
	event.stopPropagation();
	var extraAdult = $("#adult_template .adult_body").clone();
	$('#passenger_section').append(extraAdult);
});

$('body').on('click', '.action .delete', function(event) {
	event.stopPropagation();
	var passenger_body = $(this).closest("[class$='_body']");
	var attr = $(passenger_body).attr('contact_id');
	// For some browsers, `attr` is undefined; for others,
	// `attr` is false.  Check for both.
	if (typeof attr !== typeof undefined && attr !== false) {
		 tools.getSpecificCheckbox(attr);
	}
	tools.removeAddedPassenger(passenger_body);

});

$('body').on('click', '.add_child_link', function(event) {
	event.stopPropagation();
	var adult_body = $(this).closest('.adult_body');
	var extraChild = $("#child_template .child_body").clone();
	adult_body.after(extraChild);
});

$('body').on('click', '.per_tab', function(event) {
	event.stopPropagation();
	ui.tabSwitch($(this));
});