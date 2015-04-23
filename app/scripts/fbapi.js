'use strict';
var FBAPI = {};
/**
 * [general_input description]
 * @param  {[type]}   service_id  [description]
 * @param  {[type]}   data        [description]
 * @param  {[type]}   api_method  [description]
 * @param  {[type]}   ajax_method [description]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
FBAPI.general_input = function(service_id, data, api_method, ajax_method, callb) {
    this.ci = "fbp0101abcd00001",
    this.ver = "1.0.0",
    this.ts = Date.now(),
    this.da = JSON.stringify(data),
    // this.md5_private_key = md5("4C6EA522-9057"),
    this.md5_private_key = md5("ES2s#kd&(js9}dks2"),
    this.si = service_id,
    this.md5_sign = md5(this.ci + this.si + this.ts + this.da + this.md5_private_key),

    this.api_method = api_method,
    this.ajax_method = ajax_method,
    this.ajax_data = {
        "client_id": this.ci,
        "service_id": this.si,
        "timestamp": this.ts,
        "version": this.ver,
        "sign": this.md5_sign,
        "data": this.da
    };
    this.Ajax(callb);
};
FBAPI.Ajax = function(callb) {
    $.ajax({
        url: "http://115.29.79.63:8080/FangBianCRMInterface/m.ashx?action=" + this.api_method,
        method: this.ajax_method,
        dataType: "json",
        data: this.ajax_data,
        success: callb,
        error: function (ajaxContext) {
            console.log(ajaxContext.responseText)
        }
    });
};
FBAPI.renderTemplate = function(id, data, template) {
    var _ele = document.getElementById(id);
    if(_ele && data.data !== "[]" && data.data !== "") {
        document.getElementById(id).innerHTML = '';
        document.getElementById(id).innerHTML = new EJS({url: './templates/' + template + '.ejs'}).render(data);
    };
};

FBAPI.get_brief_code = function() {
    this.general_input("U0100", "", "Query", "GET", this.get_brief_code_complete);
};
FBAPI.get_brief_code_complete = function(data) {
    this.brief_codes = data.data || [];
    for(var per_item of data.data) {
        var per_arr_item = [];
        per_arr_item.push(per_item["station_name"]);
        per_arr_item.push(per_item["brief_code"]);
        per_arr_item.push(per_item["full_spell"]);
        per_arr_item.push(per_item["first_letter"]);
        _ListData_.push(per_arr_item);
    }
};
FBAPI.query_train_tickets = function(date, origin, destination, passenger_type) {
    var query_train_data = {
        "train_date": date,
        "from_station": origin,
        "to_station": destination,
        "purpose_codes": passenger_type
    };
    this.general_input("U0109", query_train_data, "Query", "POST", this.query_train_tickets_complete.bind(this));
};
FBAPI.query_train_tickets_complete = function(data) {
    this.renderTemplate("trainList", data, "train_query");
    this.renderTemplate("train_query_results_title", data, "train_query_title");
};
FBAPI.code_to_name = function(code) {
    if (this.brief_codes && this.brief_codes.length > 0) {
        this.code_to_name_complete(code);
    } else {
        this.general_input("U0100", "", "Query", "GET", this.code_to_name_complete(code));
    };
};
FBAPI.code_to_name_complete = function(code) {
    return function(data, textStatus, jqXHR) {
           var data_arr = data? data.data: this.brief_codes;
           for (var per_data of data_arr) {
               if (per_data.brief_code === code) {
                   return per_data.station_name;
               };
           }
       };
};
FBAPI.query_train_hots = function() {
    var query_train_data = {
        "search_type": 0
    };
    this.general_input("U0118", query_train_data, "Query", "POST", this.query_train_hots_complete);
};
FBAPI.query_train_hots_complete = function(data) {
    var hots = data.data;

    for(var per_hot of hots) {
        _index_train_hots.push(per_hot.stock_area_name);
    }
};
FBAPI.query_specific_train = function(date, from_station, to_station, purpose_codes, train_code) {
    var query_data = {
        "train_date": date,
        "from_station": from_station,
        "to_station": to_station,
        "purpose_codes": purpose_codes,
        "train_code": train_code
    };
    this.general_input("U0117", query_data, "Query", "POST", this.query_specific_train_complete.bind(this));
};
FBAPI.query_specific_train_complete = function (data){
    query_specific_train_result = data;
    this.renderTemplate("specific_train", data, "train_detail");
    this.renderTemplate("adult_template", data, "adult_passenger");
    $("#adult_template .adult_body").clone().appendTo('#passenger_section');
    this.renderTemplate("child_template", data, "child_passenger");
};
FBAPI.get_contacts = function(user_id, callback) {
    var query_data = {
        "user_id": user_id
    };
    this.general_input("U0113", query_data, "Query", "POST", callback.bind(this));

};
FBAPI.get_contacts_complete = function(data) {
    this.renderTemplate("passenger_body", data, "passengers");
};
FBAPI.preserve_get_contacts_complete = function(data) {
    this.renderTemplate("passenger_row", data, "order_passengers");
};

FBAPI.add_contact = function(user_id, real_name, id_type_code, id_type, id_number, mobile_phone, email, passenger_type, sex_code) {
    var query_data = {
        "user_id": user_id,
        "real_name": real_name,
        "id_type_code": id_type_code,
        "id_type": id_type,
        "id_number": id_number,
        "mobile_phone": mobile_phone,
        "email": email,
        "passenger_type": passenger_type,
        "sex_code": sex_code
    };
    this.general_input("U0202", query_data, "Order", "POST", this.add_contact_complete);
};
FBAPI.add_contact_complete = function() {

};
FBAPI.update_contact = function(contact_id, user_id, real_name, id_type_code, id_type, id_number, passenger_type, sex_code) {
    var query_data = {
        "contact_id": contact_id,
        "user_id": user_id,
        "real_name": real_name,
        "id_type_code": id_type_code,
        "id_type": id_type,
        "id_number": id_number,
        "passenger_type": passenger_type,
        "sex_code": sex_code
    };
    this.general_input("U0206", query_data, "Order", "POST", this.update_contact_complete);

};
FBAPI.update_contact_complete = function(data) {

};
FBAPI.delete_contact = function(user_id, contact_ids) {
    var query_data = {
        "user_id": user_id,
        "contact_ids": contact_ids
    };
    this.general_input("U0207", query_data, "Order", "POST", this.update_contact_complete);
};
FBAPI.delete_contact_complete = function(data) {

};
FBAPI.book_train_tickets = function(user_id, train_number, from_station_code, to_station_code, train_date, depart_time, ticket_price, seat_code, passengers_info) {
    var query_data = {
        "user_id": user_id,
        "train_number": train_number,
        "from_station_code": from_station_code,
        "to_station_code": to_station_code,
        "train_date": train_date,
        "depart_time": depart_time,
        "ticket_price": ticket_price,
        "seat_code": seat_code,
        "passengers_info": passengers_info
    };
    this.general_input("U0203", query_data, "Order", "POST", this.book_train_tickets_complete);
};
FBAPI.book_train_tickets_complete = function(data){
    $('.popup_submit_order .content').text(data.message);
};

FBAPI.get_order_status = function(order_id) {
    var query_data = {
        "order_id": order_id
    };
    this.general_input("U0108", query_data, "Query", "POST", this.get_order_status_complete);
};
FBAPI.get_order_status_complete = function() {

};

FBAPI.get_orders = function(user_id) {
    var query_data = {
        "user_id": user_id
    };
    this.general_input("U0107", query_data, "Query", "POST", this.get_orders_complete.bind(this));
};
FBAPI.get_orders_complete = function(data) {
    this.renderTemplate("order_lists_body", data, "get_orders");
};
FBAPI.get_order_detail = function(user_id, order_id) {
    var query_data = {
        "user_id": user_id,
        "order_id": order_id
    };
    this.general_input("U0107", query_data, "Query", "POST", this.get_order_detail_complete.bind(this));

};
FBAPI.get_order_detail_complete = function(data) {
    this.renderTemplate("order_details", data, "order_detail");
};

FBAPI.cellphone_val = function (phone, code_scope){
    var query_data = {
        "phone": phone,
        "code_scope": code_scope
    };
    this.general_input("U0101", query_data, "Query", "POST", this.cellphone_val_complete);
};
FBAPI.cellphone_val_complete = function(data) {

};
FBAPI.signup_firstLogin = function(phone, code, code_scope){
    var query_data = {
        "phone": phone,
        "code": code,
        "code_scope": code_scope
    };
    this.general_input("U0104", query_data, "Query", "POST", this.signup_firstLogin_complete);

};
FBAPI.signup_firstLogin_complete = function() {

};
FBAPI.login = function(session_key, code_scope) {
    var query_data = {
        "session_key": session_key,
        "code_scope": code_scope
    };
    this.general_input("U0104", query_data, "Query", "POST", this.login_complete);
};
FBAPI.login_complete = function (data){

};



/**
 * coach API
 */



FBAPI.coach = {};
FBAPI.coach.serviceIDs = {
    "query_origins": "U0101",
    "query_specific_destinations": "U0102",
    "get_orders": "U0105",
    "query_tickets": "U0103",
    "book_tickets": "U0203",
    "get_orders": "U0105",
    "refund": "U0202"
};

FBAPI.coach.general_input = function(service_id, data, api_method, ajax_method, callb) {
    this.ci = "fbp0101abcd00001",
    this.ver = "1.0.0",
    this.ts = Date.now(),
    this.da = JSON.stringify(data),
    // this.md5_private_key = md5("4C6EA522-9057"),
    this.md5_private_key = md5("ES2s#kd&(js9}dks2"),
    this.si = service_id,
    this.md5_sign = md5(this.ci + this.si + this.ts + this.da + this.md5_private_key),

    this.api_method = api_method,
    this.ajax_method = ajax_method,
    this.ajax_data = {
        "merchant_code": this.ci,
        "service_id": this.si,
        "timestamp": this.ts,
        "version": this.ver,
        "sign": this.md5_sign,
        "data": this.da
    };
    this.Ajax(callb);
};
FBAPI.coach.Ajax = function(callb) {
    $.ajax({
        url: "http://115.29.79.63:8080/BusTicketInterface/WebService/BusTicket.ashx?action=" + this.api_method,
        method: this.ajax_method,
        dataType: "json",
        data: this.ajax_data,
        success: callb,
        error: function (ajaxContext) {
            console.log(ajaxContext.responseText)
        }
    });
};

FBAPI.coach.query_origins = function(type) {
    var query_data = {
        "area_code": type
    };
    this.general_input("U0101", query_data, "Query", "GET", this.query_origins_complete);

};


FBAPI.coach.query_origins_complete = function(data) {
    coach_from_list = data.data;
    coach_hotData_ = data.data;
    coach_ListFromData_ = data.data;
    coach_ListToData_ = data.data;
};
FBAPI.coach.query_specific_destinations = function(starting_code, starting_name) {
    var query_data = {
        "starting_code": starting_code,
        "starting_name": starting_name
    };
    this.general_input("U0102", query_data, "Query", "POST", this.query_specific_destinations_complete);

};
FBAPI.coach.query_specific_destinations_complete = function(data) {
    var data = data.data;
    if (data['city_list'].length !== 0) {
        var data_length = data['city_list'].length;
        var data_list = data['city_list'];
        var parsed_data = [];
        var regex_split = /\(|\)\||\||\)/;
        for (var i = 0; i < data_length; i++) {
            var per_li = [];
            per_li[0] = data_list[i].county_name;
            per_li[1] = data_list[i].full_spell;
            parsed_data.push(per_li);
        };

        var got_data = JSON.stringify(parsed_data);
        coach_ListData_ = parsed_data;
        coach_Show_subCity('to_city');
    };
};
FBAPI.coach.get_orders = function(user_id) {
    var query_data = {
        "user_id": user_id
    };
    this.general_input("U0105", query_data, "Query", "POST", this.get_orders_complete);
};
FBAPI.coach.get_orders_complete = function(data) {};

FBAPI.coach.query_tickets = function(origin_name, origin_code, destination_name, destination_code, date, query_type) {
    var query_data = {
        "departure_land": origin_name,
        "destination_land": destination_name,
        "departure_land_code": destination_code,
        "departure_land_date": date,
        "query_type": query_type,
        "destination_land_code": origin_code
    };
    this.general_input("U0103", query_data, "Query", "POST", this.query_tickets_complete);

};
FBAPI.coach.query_tickets_complete = function(data) {
    FBAPI.renderTemplate("cralist", data, "coach_query");
    FBAPI.renderTemplate("coach_query_results_title", data, "train_query_title");
};

FBAPI.coach.book_tickets = function(train_number, departure_land, starting_station, destination_land, destination_station, riding_date, depart_time, the_ticket_price, operation_type, site_code, extend_data1, extend_data2, riding_user_list, collect_user_id, user_id) {
    var query_data = {
        "train_number": train_number,
        "departure_land": departure_land,
        "starting_station": starting_station,
        "destination_land": destination_land,
        "destination_station": destination_station,
        "riding_date": riding_date,
        "depart_time": depart_time,
        "the_ticket_price": the_ticket_price,
        "operation_type": operation_type,
        "site_code": site_code,
        "extend_data1": extend_data1,
        "extend_data2": extend_data2,
        "riding_user_list": riding_user_list,
        "collect_user_id": collect_user_id,
        "user_id": user_id
    };
    this.general_input("U0203", query_data, "Order", "POST", this.book_tickets_complete);
};

FBAPI.coach.book_tickets_complete = function(data) {
    $('.popup_submit_order .content').text(data.message);
    $('.popup_submit_order .content').append("<strong>order_id: " + data.data.order_id + "</strong>");
};
FBAPI.coach.query_specific = function() {
    var index_query_params = tools.parseQueryString();
    var data = {};
        data.data = {
        "depart_date": index_query_params.depart_date,
        "depart_date_time": index_query_params.depart_date_time,
        "depart_time": index_query_params.depart_time,
        "departure_land": index_query_params.departure_land,
        "destination_land": index_query_params.destination_land,
        "destination_station": index_query_params.destination_station,
        "extend_data1": index_query_params.extend_data1,
        "extend_data2": index_query_params.extend_data2,
        "is_bookable": index_query_params.is_bookable,
        "motorcycle_type": index_query_params.motorcycle_type,
        "operation_type": index_query_params.operation_type,
        "site_code": index_query_params.site_code,
        "starting_station": index_query_params.starting_station,
        "ticket_price": index_query_params.ticket_price,
        "train_number": index_query_params.train_number
    };
    FBAPI.renderTemplate("specific_coach", data, "coach_detail");

    FBAPI.renderTemplate("adult_template", data, "coach_adult_passenger");
    $("#adult_template .adult_body").clone().appendTo('#passenger_section');
    FBAPI.renderTemplate("child_template", data, "coach_child_passenger");
};

FBAPI.coach.get_orders = function(user_id) {
    var query_data = {
        "user_id": user_id
    };
    this.general_input(FBAPI.coach.serviceIDs.get_orders, query_data, "Query", "POST", this.get_orders_complete);
};
FBAPI.coach.get_orders_complete = function(data) {
    FBAPI.renderTemplate("order_lists_body", data, "coach_orders");
};

FBAPI.coach.refund = function(order_id) {
    var query_data = {
        "order_id": order_id
    };

    this.general_input(FBAPI.coach.serviceIDs.refund, query_data, "Query", "POST", this.refund_complete);
};
FBAPI.coach.refund_complete = function(data) {

};

FBAPI.coach.order_detail = function(user_id, order_id) {
    var query_data = {
        "user_id": user_id,
        "order_id": order_id
    };
    this.general_input(FBAPI.coach.serviceIDs.get_orders, query_data, "Query", "POST", this.order_detail_complete);
};
FBAPI.coach.order_detail_complete = function(data) {
    FBAPI.renderTemplate("order_details", data, "order_detail");
};
