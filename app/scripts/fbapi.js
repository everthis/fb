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
    this.renderTemplate("specific_train", data, "train_detail");
    this.renderTemplate("adult_template", data, "adult_passenger");
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
FBAPI.add_contact = function(user_id, real_name, id_type_code, id_type, id_number, passenger_type, sex_code) {
    var query_data = {
        "user_id": user_id,
        "real_name": real_name,
        "id_type_code": id_type_code,
        "id_type": id_type,
        "id_number": id_number,
        "passenger_type": passenger_type,
        "sex_code": sex_code
    };
    this.general_input("U0202", query_data, "Query", "POST", this.add_contact_complete);
};
FBAPI.add_contact_complete = function() {

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


