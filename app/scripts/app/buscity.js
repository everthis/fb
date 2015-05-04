var coach_ListFromData_, coach_hotData_, coach_ListToData_, coach_from_list;
$(document).ready(function(){
	// $.getJSON("./ashx/Fangbian_Windows_Service.ashx?optype=get_departure", function(data){
	// 	coach_ListFromData_=data.list;
	// 	coach_hotData_=data.list;
	// 	coach_ListToData_=data.list;
	// 	coach_from_list =data.list;
	// });
	// if($("#from_city").val()!="" && $("#from_city").val()!="请输入出发城市"){
	// 	$.getJSON("./ashx/Fangbian_Windows_Service.ashx?optype=get_departure", function(data){
	// 	coach_ListToData_=data;
	// 	});
	// }

	$('body').on('click', '.f_search_change', function() {
		if($("#from_city").val()!="请输入出发城市" && $("#to_city").val()!="中文/拼音/首字母"){
			var fromCity = $("#from_city").val();
			var toCity = $("#to_city").val();
			$("#from_city").val(toCity);
			$("#to_city").val(fromCity);
		}
	});
		$('body').on('focus', '#from_city', function() {
		$("#from_city").removeClass('warm');
		$("#from_city").addClass('txt');
	});
				$('body').on('focus', '#to_city', function() {
		$("#to_city").removeClass('warm');
		$("#to_city").addClass('txt');
	});
});

if ($("#coach_cityList").length == 0) {
	var coach_list_id_ele = document.createElement('DIV');
		coach_list_id_ele.setAttribute('id', 'coach_cityList');
		coach_list_id_ele.setAttribute('class', 'coach_city_list');
		coach_list_id_ele.style.position = 'absolute';
		coach_list_id_ele.style.zIndex = '100';
	document.body.appendChild(coach_list_id_ele);
	// document.write('<div id="coach_cityList" class="coach_city_list" style="position:absolute;z-index:100;display:;" ></div>');
};

var coach_CloseAdmit_=true;
var coach_InputID_	= "";
var coach_ListType = "";
var coach_ListSelectID_	=0;
var coach_ListSelectStr_=	"";

function coach_ShowCity(ID)
{

		var id_value = "";
		id_value = document.getElementById(ID).value;
		if (id_value == "请输入出发城市") {
			document.getElementById(ID).value="";
		};
		$("#"+ID).addClass('now');
		coach_CloseAdmit_	=	false;
		coach_InputID_		=	ID;
		var listType  = $("#"+ID).attr("city_type");
		var ListObj		=	document.getElementById("coach_cityList");
		if(listType!='to'){
		var listStr = '<div class="tip_qcp_city"><p>支持中文输入</p><a href="javascript:coach_hide_city()" class="tip_city_close">关闭</a><div class="tip_qcp_city_list">';
		var _hotData_length = coach_hotData_.length;
		for (var k = 0; k < _hotData_length; k++) {
			listStr+='<dl>';
			listStr+='<dt class="province_name">'+coach_hotData_[k].province+'</dt>';
			listStr+='<span class="province_sub_division_area">';
			var _hotData_cityList_length = coach_hotData_[k]['city_list'].length;
			for(j=0;j < _hotData_cityList_length;j++){

				var sub_province_name = coach_hotData_[k]['city_list'][j].city_info.region_name;
				listStr+='<span class="province_sub_division"><a class="province_sub_division_link" href="javascript:coach_GetValue_(\''+coach_InputID_+'\',\''+sub_province_name+'\');" title="' + sub_province_name + '">'+sub_province_name+'</a>';
				var county_length = coach_hotData_[k]['city_list'][j].county_list.length;

					listStr+='<span class="county_area">';
					for (var m = 0; m < county_length; m++) {
						var current_county_name = coach_hotData_[k]['city_list'][j].county_list[m].region_name;
						listStr+='<a class="county" href="javascript:coach_GetValue_(\''+coach_InputID_+'\',\''+current_county_name+'\');"  title="' + current_county_name + '">'+current_county_name+'</a>';
					};
					listStr+='</span>';
					listStr+='</span>';
			}

			listStr+='</span>';
			listStr+='</dl>';
		};

		listStr+='</div>';
		listStr+='</div>';
		ListObj.innerHTML	=	listStr;
		}else{
			ListObj.innerHTML	=	"";
		}
		var TextTop=0;
		var TextLeft=0;
		var TextID		=	document.getElementById(ID);
		var TextHeight	=	TextID.clientHeight;
		while(TextID&&TextID.tagName!="body")
		{
			TextTop		=	TextTop+TextID.offsetTop;
			TextLeft	=	TextLeft+TextID.offsetLeft;
			TextID		=	TextID.offsetParent;
		}
		ListObj.style.top	=	TextTop+TextHeight+5+"px";
		ListObj.style.left	=	TextLeft+"px";
		ListObj.style.display	=	"inline";

}

function coach_Show_subCity(ID) {
		var id_value = "";
		id_value = document.getElementById(ID).value;
		if (id_value == "请输入到达城市") {
			document.getElementById(ID).value="";
		};
		$("#"+ID).addClass('now');
		coach_CloseAdmit_	=	false;
		coach_InputID_		=	ID;
		var listType  = $("#"+ID).attr("city_type");
		var ListObj		=	document.getElementById("coach_cityList");
		if(listType!='to'){
		var listStr = '<div class="tip_qcp_city"><p>支持中文输入</p><a href="javascript:coach_hide_city()" class="tip_city_close">关闭</a><div class="tip_qcp_city_list">';
		var _hotData_length = coach_ListData_.length;
		listStr+='<div class="dest_city_area">';
		for (var k = 0; k < _hotData_length; k++) {
			var dest_city_name = coach_ListData_[k][0];
			listStr+='<span class="dest_city_item">';
			listStr+='<a class="dest_city_item" href="javascript:coach_GetValue_(\''+coach_InputID_+'\',\''+dest_city_name+'\');"  title="' + dest_city_name + '">'+dest_city_name+'</a>';
			listStr+='</span>';
		};
		listStr+='</div>';
		listStr+='</div>';
		listStr+='</div>';
		ListObj.innerHTML	=	listStr;
		}else{
			ListObj.innerHTML	=	"";
		}
		var TextTop=0;
		var TextLeft=0;
		var TextID		=	document.getElementById(ID);
		var TextHeight	=	TextID.clientHeight;
		while(TextID&&TextID.tagName!="body")
		{
			TextTop		=	TextTop+TextID.offsetTop;
			TextLeft	=	TextLeft+TextID.offsetLeft;
			TextID		=	TextID.offsetParent;
		}
		ListObj.style.top	=	TextTop+TextHeight+5+"px";
		ListObj.style.left	=	TextLeft+"px";
		ListObj.style.display	=	"inline";

}


function validate_search_bus(){
	if($("#from_city").val()=="" || $("#from_city").val()=="请输入出发城市"){
		$("#from_city").val("请输入出发城市").css('color', '#999');
		// $("#from_city").addClass("warm");
		// return false;
	}
	if($("#to_city").val()=="" || $("#to_city").val()=="请输入到达城市"){
		$("#to_city").val("请输入到达城市").css('color', '#999');
		// $("#to_city").addClass("warm");
		// return false;
	}
	// return true;
}
validate_search_bus();

// 整理JSON数据
// var got_data;
var prev_origin_input = "";
$("body").on('focus', '#to_city', function (event) {
    event.preventDefault();

    var origin_name;
    origin_name = $("#from_city").val();
    var origin_code = $("#from_city_code").val().toUpperCase();
    // prev_origin_input = $("#from_city").val();
    FBAPI.coach.query_specific_destinations(origin_code, origin_name);
    // $.getJSON("./ashx/Fangbian_Windows_Service.ashx?optype=get_destination&destination=" + origin_name, function (data) {
    //     if (data['list'].length !== 0) {
    //         var data_length = data['list'].length;
    //         var data_list = data['list'];
    //         var parsed_data = [];
    //         var regex_split = /\(|\)\||\||\)/;
    //         for (var i = 0; i < data_length; i++) {
    //             parsed_data.push(data_list[i].split("|"));
    //         };

    //         got_data = JSON.stringify(parsed_data);
    //         coach_ListData_ = parsed_data;
    //         coach_Show_subCity('to_city');
    //     };
    // });
});


var coach_from_list_array = [];
$("body").on('focus', '#from_city', function(event) {
	event.preventDefault();
	if (coach_from_list_array.length == 0 ) {
		var province_length = coach_from_list.length;
		for (var i = 0; i < province_length; i++) {

			var city_list_length = coach_from_list[i]['city_list'].length;
			var $city_list = coach_from_list[i]['city_list'];

			for (var j = 0; j < city_list_length; j++) {
				var city_node =[];
				var node_region = $city_list[j].city_info.region_name;
				var node_region_code = $city_list[j].city_info.region_code;
				city_node[0] = node_region;
				city_node[1] = node_region_code.toLowerCase();
				coach_from_list_array.push(city_node);

				var $county_list = $city_list[j]['county_list'];
				var county_list_length = $county_list.length;
				if (county_list_length !== 0) {
					for (var k = 0; k < county_list_length; k++) {
						var county_node = [];
						var county_node_region = $county_list[k].region_name;
						var county_node_region_code = $county_list[k].region_code;
						county_node[0] = county_node_region;
						county_node[1] = county_node_region_code.toLowerCase();
						coach_from_list_array.push(county_node);
					};
				};
			};

		};
	};

	coach_ListData_ = coach_from_list_array;
});

var coach_ListData_ = "";

function coach_ListMove_(ID) {
    if (coach_ListSelectStr_ != "") {
        var StrArray = coach_ListSelectStr_.split(",")
        switch (ID) {
            case 1: if (coach_ListSelectID_ >= StrArray.length - 2) { return; } break;
            case -1: if (coach_ListSelectID_ <= 0) { return; } break;
            default: return;
        }
        document.getElementById("coach_ListID" + coach_ListSelectID_ + "_").style.backgroundColor = "";
        coach_ListSelectID_ = coach_ListSelectID_ + ID;
        document.getElementById("coach_ListID" + coach_ListSelectID_ + "_").style.backgroundColor = "#C5E7F6";
    }
}

function coach_UpdateList_() {
    var Str = document.getElementById(coach_InputID_).value.toLowerCase();
    var Len = Str.length;
    var i = 0;
    var ListStr = "";
    coach_ListSelectID_ = 0;
    coach_ListSelectStr_ = "";
    if (Str != "") {
        var selectAllListData = new Array();
        for (var j = 0; j < coach_ListData_.length; j++) {
        	if (coach_ListData_[j].length == 2) {
        		if (coach_ListData_[j][0].substr(0, Len) == Str || coach_ListData_[j][1].substr(0, Len) == Str) {
        		    selectAllListData.push(coach_ListData_[j]);
        		}
        	} else if (coach_ListData_[j].length == 5) {
        		if (coach_ListData_[j][0].substr(0, Len) == Str || coach_ListData_[j][1].substr(0, Len) == Str || coach_ListData_[j][2].substr(0, Len) == Str || coach_ListData_[j][3].substr(0, Len) == Str) {
        		    selectAllListData.push(coach_ListData_[j]);
        		}
        	};

        }

        selectAllListData.sort(function compare(a, b) { return parseInt(a[3]) - parseInt(b[3]); })
        for (var j = 0; j < selectAllListData.length; j++) {
            if (i == 0) {
                ListStr = ListStr + '<tr height="20" onMouseOver="this.style.backgroundColor=\'#C5E7F6\'" onMouseOut="this.style.backgroundColor=\'\'" style="cursor:pointer;background-color:#C5E7F6" onClick="JavaScript:coach_GetValue_(\'' + coach_InputID_ + '\',\'' + selectAllListData[j][0] + '\')" id="coach_ListID' + i + '_"><td>&nbsp;&nbsp;' + selectAllListData[j][0] + '</td><td align="right">' + selectAllListData[j][1] + '&nbsp;&nbsp;</td></tr>';
            }
            else {
                ListStr = ListStr + '<tr height="20" onMouseOver="this.style.backgroundColor=\'#C5E7F6\'" onMouseOut="this.style.backgroundColor=\'\'" style="cursor:pointer" onClick="JavaScript:coach_GetValue_(\'' + coach_InputID_ + '\',\'' + selectAllListData[j][0] + '\')" id="coach_ListID' + i + '_"><td>&nbsp;&nbsp;' + selectAllListData[j][0] + '</td><td align="right">' + selectAllListData[j][1] + '&nbsp;&nbsp;</td></tr>';
            }

            coach_ListSelectStr_ = coach_ListSelectStr_ + selectAllListData[j][0] + ',';
            if (i >= 11) //提示12个
            {
                break;
            }
            else {
                i = i + 1;
            }
        }

        if (ListStr != "") {
            coach_ListSelectID_ = 0;
            ListStr = '<table align="left" width="240" cellpadding="0" cellspacing="0" style="border:1px solid #999999;font-size:12px; font-family:Arial; color:#555555;background-color:#FFFFFF;filter:alpha(opacity=95);">' + ListStr + '</table>';
            document.getElementById("coach_cityList").innerHTML = ListStr;
        }
        else {
            document.getElementById("coach_cityList").innerHTML = "";
        }
    }
}

function coach_showCity(ID) {
        document.getElementById(ID).value = "";
        coach_CloseAdmit_ = false;
        coach_InputID_ = ID;
        var ListStr = '<table width="350" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #E0E2F0;background: #fff;color: #353535;position: relative;text-align: center;padding-bottom:3px;">'
							+ '<tr>'
						    + '<th colspan="5"><h4 style="font-size:12px;margin-bottom: 5px;background: #EEF1F4;padding: 0 10px;line-height: 2.0em;text-align:left"><span style="font-weight: normal;margin-left: 10px;color: #999">可输入简拼、中文</span></h4>'
						    + '<a href="javascript:void(0);" onClick="JavaScript:coach_HideList_();" style="position: absolute;right:4px;top:3px;width:13px;height:13px;background: url(/WebUI/Images/header.gif) -372px -128px; text-indent: -9999px;">关闭</a>'
						    + '</th>'
						    + '</tr>'
        var StrArray = "".split("，");
        ListStr = ListStr + '<tr>';

        for (var i = 0; i < StrArray.length; i++) {
            if (i != 0 && i % 5 == 0) {
                ListStr = ListStr + '</tr><tr>';
            }
            ListStr = ListStr + '<td  height="25" width="70" onMouseOver="this.style.backgroundColor=\'#C5E7F6\'" onMouseOut="this.style.backgroundColor=\'\'" style="cursor:pointer; color:#666;text-decoration: none;font-size: 12px;"onClick="JavaScript:coach_GetValue_(\'' + ID + '\',\'' + StrArray[i] + '\')">' + StrArray[i] + '</td>';
        }
        ListStr = ListStr + '</table>';
        var ListObj = document.getElementById("coach_cityList");
        ListObj.innerHTML = ListStr;

        var TextTop = 0;
        var TextLeft = 0;
        var TextID = document.getElementById(ID);
        var TextHeight = TextID.clientHeight;
        while (TextID && TextID.tagName != "body") {
            TextTop = TextTop + TextID.offsetTop;
            TextLeft = TextLeft + TextID.offsetLeft;
            TextID = TextID.offsetParent;
        }
        ListObj.style.top = TextTop + TextHeight + 5 + "px";
        ListObj.style.left = TextLeft + "px";
        ListObj.style.display = "inline";
}
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

function coach_GetCode(_val) {
    if (_val != "" && _val != null) {
        var arry = null;
        for (var i = 0; i < coach_ListData_.length; i++) {
            arry = coach_ListData_[i];
            if (arry[0].trim() == _val) {
                return arry[1];
            }
        }
    }
}


function coach_GetValue_(ID, Value) {
    coach_CloseAdmit_ = true;
    if (typeof (Value) == "string" && Value != "") {
        var cityInput = document.getElementById(ID);
        cityInput.value = Value;
        document.getElementById(ID+"_code").value = coach_GetCode(Value);
        if (cityInput.onchange != undefined) {
            cityInput.onchange();
        }
    }
    coach_HideList_();
}


function coach_HideList_()
{
	if(coach_CloseAdmit_)
	{
		document.getElementById("coach_cityList").style.display	=	"none";
        coach_InputID_ = "";
	}
}
function coach_hide_city()
{

	coach_CloseAdmit_	=	true;
	setTimeout("coach_HideList_()",200);
}


