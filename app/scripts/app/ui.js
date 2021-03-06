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
        var canlenderarray = canlenderui.getElementsByClassName("day");
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

ui.filter = {};
ui.filter.check = function() {

};

/*-----------------------------------------------过滤模块---------------------------------------------------*/
SEARCH_CATE_LIST_No.each(function (item) {
    //找到过滤模块
    var cate = $("#" + SEARCH_CATE_LIST + item); //SEARCH_CATE_LIST=resultFilters

    var RESULT_TABLE = $('#resultTable' + item), //找到结果列表
    NO_FILTER_RESULT = $('#noneFilterResult' + item),
    TOTAL_RESULT = $('#totalResult' + item);

    //找到过滤器下面所有的A标签，并绑定点击事件
    $(cate).find('a').each(function (A) {
        $(A).bind('click', function (e) {

            var target = A[0];

            if (target.id == FILTER_CONTROLLER + item) {
                return;
            }

            //取消过滤的非全部项的选择（控制样式）
            if (target.className == "show_all" || target.className == "show_all selected") {
                //清除勾样式
                A.parentNode().parentNode().find('a').each(function (o) {
                    if (o[0].className != "show_all" && o[0].className != "show_all selected") {
                        o[0].className = "";
                    }
                });
                //全部选中样式
                target.className = "show_all selected";
            }
            else {
                if (target.className == "") {
                    target.className = "selected";
                }
                else {
                    target.className = "";
                }

                var flag = true;

                A.parentNode().parentNode().find('a').each(function (o) {
                    if (o[0].className != "show_all" && o[0].className != "show_all selected") {
                        if (o[0].className == "selected") {
                            flag = false;
                        }
                    }
                });

                A.parentNode().parentNode().find('a').each(function (o) {
                    if ((o[0].className == "show_all" || o[0].className == "show_all selected") && flag) {
                        o[0].className = "show_all selected";
                    }
                    if ((o[0].className == "show_all" || o[0].className == "show_all selected") && !flag) {
                        o[0].className = "show_all";
                    }
                });

            }

            //获取过滤值
            filterBinary = getFiltersBinary(cate);
            //启动过滤程序
            filterResult(RESULT_TABLE, NO_FILTER_RESULT, TOTAL_RESULT, item);


        })
    })

    if (FILTER_HIDDEN != "") {//第一次加载，可能是高铁或者动车，要过滤
        filterBinary = parseInt(FILTER_HIDDEN);
    }
    //启动过滤程序
    restoreFiltersInputsWithBinary(filterBinary, item);
    filterResult(RESULT_TABLE, NO_FILTER_RESULT, TOTAL_RESULT, item);

    //控制收起还是更多
    //filterShowAlternate(item);
})


ui.sort = function(nl, attr, reverse) {
		var arr = [];
		for (var i = 0, ref = arr.length = nl.length; i < ref; i++) {
		 arr[i] = nl[i];
		};
		var return_val = this.quickSort(arr, attr, reverse);
		document.getElementById('trainList').innerHTML = '';
		var fragment = document.createDocumentFragment();
		for (var i = 0; i < return_val.length; i++) {
			fragment.appendChild(return_val[i]);
		};
		document.getElementById('trainList').appendChild(fragment);
};
ui.quickSort = function(arr, attr, reverse) {
	if(arr.length <= 1){
		return arr;
	} else {
		var pivotIndex = Math.floor(arr.length / 2),
		    pivot = arr.splice(pivotIndex, 1),
		    leftArray = [],
		    rightArray = [],
			pivot_attr = pivot[0].getAttribute(attr);
		for(var i = 0, len = arr.length; i < len; i++){
			if(arr[i].getAttribute(attr) < pivot_attr){
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