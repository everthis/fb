var ui = {};
ui.shadowOn = function() {

};
ui.shadowOff = function() {

};
ui.tabSwitch = function(obj) {
	var tabs = $('.tabs .per_tab');
	var order_lists = $('#order_lists_body .per_list');
	var order_lists_len = order_lists.length;
	var toComplete = $('#order_lists_body .per_list[iscomplete="false"]');

	if ($(obj).attr('type') === '1') {
		$(order_lists).addClass('hide');
		$(toComplete).removeClass('hide');
	} else if($(obj).attr('type') === '0'){
		$(order_lists).removeClass('hide');
		$(toComplete).addClass('hide');
	};
	$(tabs).removeClass('on');
	$(obj).addClass('on');
};

ui.dateBarControl = {
	init: function(selectedIndex, dateBarLen) {
		this.halfDays = 3;
		this.currentItem = selectedIndex; //当前选择元素索引
		if(this.currentItem < this.halfDays) {
		    this.currentItem = this.halfDays;
		}
		if(parseInt(dateBarLen - 1) - this.currentItem < this.halfDays) {
		    this.currentItem = parseInt(dateBarLen - 1) - this.halfDays;
		}
		this.canlenderArray = this.GetCanlenderLiArray01(); //所有日期元素数组

		this.rightbutton=document.getElementById('canlenderrightbutton01' );//右按钮
		this.leftbutton=document.getElementById('canlenderleftbutton01');//左按钮
	},
	GetCanlenderLiArray01: function GetCanlenderLiArray01() {
        var canlenderui = document.getElementById("middle_datebar");
        var canlenderarray = canlenderui.querySelectorAll(".day");
        var newcanlenderarray=new Array();
        for (var i = 0; i < canlenderarray.length; i++) {
            newcanlenderarray.push(canlenderarray[i]);
        }
        return newcanlenderarray;
    },
    LeftButtonClick: function LeftButtonClick() {
        if (this.currentItem > this.halfDays) {
            this.canlenderArray[this.currentItem - this.halfDays - 1].style.display = "";
            this.canlenderArray[this.currentItem + this.halfDays].style.display = "none";
            this.currentItem = this.currentItem - 1;

            //控制左按钮和右按钮样式
            this.rightbutton.className = "next_day";
            if (this.currentItem < this.halfDays + 1) {
                this.leftbutton.className = "previous_day disabled";
            }
        }
    },
    RightButtonClick: function RightButtonClick() {
        if ((this.canlenderArray.length - this.currentItem) > this.halfDays + 1) {
            this.currentItem = this.currentItem + 1;
            this.canlenderArray[this.currentItem - this.halfDays - 1].style.display = "none";
            this.canlenderArray[this.currentItem + this.halfDays].style.display = "";

            //控制左按钮和右按钮样式
            this.leftbutton.className = "previous_day";
            if ((this.canlenderArray.length - this.currentItem) < this.halfDays + 2) {
                this.rightbutton.className = "next_day disabled";
            }
        }
    }

};

ui.addDate = function(hi) {
	var ori_date = new Date();
	var tmp_date = new Date();
	var tmp1 = tmp_date.setDate(ori_date.getDate() + hi);
	var year = (new Date(tmp1)).getFullYear();
	var month = (new Date(tmp1)).getMonth() + 1;
		month = (month < 10) ? ('0' + month) : month;
	var monthDay = (new Date(tmp1)).getDate();
		monthDay = monthDay < 10 ? '0' + monthDay : monthDay;
	var weekDay = this.date.convert((new Date(tmp1)).getDay());
	var ymd = year + '-' + month + '-' + monthDay;
	var node = {
		'ymd': ymd,
		'month': month,
		'date': monthDay,
		'weekday': weekDay
	};
	return node;
};

ui.generateDateBar = function(selected_date) {
	var dateBarLen = 21,
		dateObjArr = [],
	    isCurrentFirst = '',
	    isCurrentLast = '',
	    pre_str,
	    next_str,
	    halfDays = 3,
	    isHalfDayFound = false,
	    selectedIndex = 0,
	    str = '';
	for (var i = 0; i < dateBarLen; i++) {
		dateObjArr.push(this.addDate(i));
	};
	for (var i = 0; i < dateObjArr.length; i++) {
		if (dateObjArr[i].ymd === String(selected_date)) {
			selectedIndex = i;
			break;
		};
	};
	for (var i = 0; i < dateObjArr.length; i++) {
		var isNow = false, isHide = false;
		if ((i < halfDays + 1) && dateObjArr[i].ymd === String(selected_date)) {
			isCurrentFirst = 'disabled';
		};
		if ((i > dateObjArr.length - (halfDays * 2 + 1)) && dateObjArr[i].ymd === String(selected_date)) {
			isCurrentLast = 'disabled';
		};
		if ( ((i - selectedIndex > halfDays) && i > (halfDays * 2))  || ( (selectedIndex - i > halfDays) && (i < dateBarLen - halfDays * 2 - 1) ) ) {
			isHide = true;
		};
		isNow = selectedIndex === i ? 'now' : '';
		isHide = isHide ? 'display: none;' : '';
		var tmp_str = "<span class='day " + isNow + "' style='" + isHide + "' ymd='" + dateObjArr[i]['ymd'] + "'>"
                    +    "<div class='detail'>" + dateObjArr[i]['month'] + "-" + dateObjArr[i]['date'] + "</div>"
                    +    "<div class='isreservable'>" + dateObjArr[i]['weekday'] + "</div>"
                    + "</span>";
		str += tmp_str;
	};

	pre_str = "<span class='previous_day " + isCurrentFirst + "' id='canlenderleftbutton01'>"
              +    "<div class='icon'></div>"
              +"</span>"
              + "<span class='middle' id='middle_datebar'>";
    next_str = "</span>"
			  + "<span class='next_day " + isCurrentLast + "' id='canlenderrightbutton01'>"
              +     "<div class='icon'></div>"
              + "</span>";
	str = pre_str + str + next_str;
	document.getElementById('date_bar').innerHTML = str;
	this.dateBarControl.init(selectedIndex, dateBarLen);
};


ui.date = {};
ui.date.convert = function(weekday) {
	var wd = '';
	switch (weekday) {
		case 0:
			wd = '周日';
			break;
		case 1:
			wd = '周一';
			break;
		case 2:
			wd = '周二';
			break;
		case 3:
			wd = '周三';
			break;
		case 4:
			wd = '周四';
			break;
		case 5:
			wd = '周五';
			break;
		case 6:
			wd = '周六';
			break;
	}
	return wd;
};

ui.getQueryResultArr = function() {
	var resultArr = [];
	var queryResult = $("#query_result_list .per_list");
	for (var i = 0, ref = resultArr.length = queryResult.length; i < ref; i++) {
	 resultArr[i] = queryResult[i];
	};
	return resultArr;
};

ui.filter = {};
ui.filter.original_data = {};
ui.filter.nodeListArr = [];
ui.filter.getChecked = function() {
    // log(this.nodeListArr);
	var train_type = [],
		// nodeListArr = [],
		filterResult = [],
		origin_station = [],
		depart_time = [],
		queried_data = FBAPI.query_tickets_data;
	$(".filter_section input[class='train_type']").each(function() {
	    if (this.checked === true) {
	        train_type.push($(this).val())
	    }
	});
	$(".filter_section input[class='depart_time']").each(function() {
	    if (this.checked === true) {
	        depart_time.push($(this).val())
	    }
	});
	$(".filter_section input[class='origin_station']").each(function() {
	    if (this.checked === true) {
	        origin_station.push($(this).val())
	    }
	});

	if (train_type.length > 0 || depart_time.length > 0 || queried_data.length > 0 ) {
	    for (var f = 0; f < queried_data.length; f++) {
	        var b = queried_data[f];
	        if (!this.trainType(b, train_type)) {
	            continue
	        }
	        if (!this.departTime(b, depart_time)) {
	            continue
	        }
	        if (!this.originStation(b, origin_station)) {
	            continue
	        }
            filterResult.push(b);
	    }
	}
	this.processResult(filterResult);

};
ui.renderTemplate = function(id, data, template) {
    var _ele = document.getElementById(id);
    if(_ele && data !== "[]" && data !== "") {
    	var new_data = {
    		"data": data
    	};
        document.getElementById(id).innerHTML = '';
        document.getElementById(id).innerHTML = new EJS({url: './templates/' + template + '.ejs'}).render(new_data);
    };
};
ui.filter.processResult = function(filterResult) {
	var pn = window.location.pathname;
	var tr = pn.indexOf('train');
	var co = pn.indexOf('coach');
	var pl = pn.indexOf('plane');
	if (tr !== -1 && tr < 10) {
		ui.renderTemplate("query_result_list", filterResult, "train_query");
		ui.renderTemplate("train_query_results_title", filterResult, "train_query_title");
	};
	if (co !== -1 && co < 10) {
		ui.renderTemplate("query_result_list", filterResult, "coach_query");
		ui.renderTemplate("coach_query_results_title", filterResult, "train_query_title");
	};
	if (pl !== -1 && pl < 10) {

	};
};

ui.filter.trainType = function(b, c) {
    if (c.length == 0) {
        return true
    }
    for (var a = 0; a < c.length; a++) {
        if (b.train_code.substring(0, 1) == c[a]) {
            return true
        }
        if (c[a] == "QT") {
            if (b.train_code.substring(0, 1) != "G" && b.train_code.substring(0, 1) != "D" && b.train_code.substring(0, 1) != "C" && b.train_code.substring(0, 1) != "T" && b.train_code.substring(0, 1) != "K" && b.train_code.substring(0, 1) != "Z") {
                return true
            }
        }
        if (c[a] == "G") {
            if (b.train_code.substring(0, 1) == "C" || b.train_code.substring(0, 1) == "G") {
                return true
            }
        }
    }
    return false
};


ui.filter.departTime = function(a, e) {
    if (e.length == 0) {
        return true
    }
    for (var d = 0; d < e.length; d++) {
    	var start_time = a.start_time || a.depart_time.substring(0, 5);
        var f = (start_time.replace(":", ""));
        var c = Number(e[d].substring(0, 4));
        var b = Number(e[d].substring(4, 8));
        if (f >= c && f <= b) {
            return true
        }
    }
    return false
};

ui.filter.originStation = function(bY, bX) {
    if (bX.length == 0) {
        return true
    }
    for (var bZ = 0; bZ < bX.length; bZ++) {
        if (bX[bZ] == bY.starting_station) {
            return true
        }
    }
    return false
};

ui.filter.check = function() {

};




ui.sort = function(data, attr, reverse) {

	var sort_data = data;
	var return_val = this.quickSort(sort_data, attr, reverse);


	var sType = ui.checkServiceType();
	if (sType === "train") {
		ui.renderTemplate("query_result_list", return_val, "train_query");
		ui.renderTemplate("train_query_results_title", return_val, "train_query_title");
	};
	if (sType === "coach") {
		ui.renderTemplate("query_result_list", return_val, "coach_query");
		ui.renderTemplate("coach_query_results_title", return_val, "train_query_title");
	};


};
ui.checkServiceType = function() {
	var pn = window.location.pathname;
	var tr = pn.indexOf('train');
	var co = pn.indexOf('coach');
	var pl = pn.indexOf('plane');
	if (tr !== -1 && tr < 10) {
		return "train";
	};
	if (co !== -1 && co < 10) {
		return "coach";
	};
	if (pl !== -1 && pl < 10) {
		return "plane";
	};
};
ui.quickSort = function(arr, attr, reverse) {
	if(arr.length <= 1){
		return arr;
	} else {
		var pivotIndex = Math.floor(arr.length / 2),
		    pivot = arr.splice(pivotIndex, 1),
		    leftArray = [],
		    rightArray = [],
			pivot_attr = pivot[0][attr];
		for(var i = 0, len = arr.length; i < len; i++){
			if(arr[i][attr] < pivot_attr){
				reverse ? leftArray.push(arr[i]) : rightArray.push(arr[i]);
			} else {
				reverse ? rightArray.push(arr[i]) : leftArray.push(arr[i]);
			};
		}
		return this.quickSort(leftArray, attr, reverse).concat(pivot[0], this.quickSort(rightArray, attr, reverse));
	}
};



ui.coach = {};
ui.coach.origins = function() {

};
ui.coach.destinations = function() {

};