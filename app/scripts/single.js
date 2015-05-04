var jsonFilterUrl;
var PluginsVersion = {
    "tab": "1.2",
    "address": "1.0",
    "calendar": "6.0",
    "notice": "1.0",
    "toggle": "1.0",
    "validate": "1.1",
    "allyes": "1.0",
    "adFrame": "1.0",
    "dropBox": "1.0"
};
var maxDay = GetMaxDate(); //限售天数
//新增60天限售规则
function GetMaxDate() {
    var nowDate = new Date();
    var nowDay = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate();
    var myDate = new Date("2014/12/01");

    if (nowDate < myDate) {
        return 19;
    }
    switch (nowDay) {
        case "2014-12-1":
            return 29;
        case "2014-12-2":
            return 35;
        case "2014-12-3":
            return 41;
        case "2014-12-4":
            return 47;
        case "2014-12-5":
            return 53;
        case "2014-12-6":
            return 59;
        default:
            return 59;
    }
}

$.ready(function () {

    //如果没有车次也没有推荐汽车票，则跳转到中转
    if (zhongZhuanUrl != null && zhongZhuanUrl != "") {
        $("#searchLoading").css("display", "");
        $("#no_result_alert01").css("display", "none");
        if (typeof window.$location == "undefined") window.$location = function (url) { if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { var referLink = document.createElement("a"); referLink.href = url; document.body.appendChild(referLink); referLink.click() } else document.location.href = url };
        $location(zhongZhuanUrl);
        return;
    }

    var lang = SITEHOMEPAGE;
    //var lang = '';
    var big5Str = "";
    //if (lang == "http://pages.big5.ctrip.com") {
    if (lang.indexOf('big5') != -1) {
        big5Str = ".big5";
    } else {
        big5Str = "";
    }

    jsonFilterUrl = "http://webresource.ctrip.com/code/cquery/resource/address/train_new/station_gb2312.js";
    if (big5Str != "") {
        jsonFilterUrl = "http://webresource.ctrip.com/code/cquery/resource/address/train_new/station_big5.js";
    }

    $("#astopstationalert").bind('click', function (e) {
        $("#stopstationalert").unmask();
        UI2.Common.preventDefault(e);
    });

    $("#btnstopstationalert").bind('click', function (e) {
        $("#stopstationalert").unmask();
        UI2.Common.preventDefault(e);
    });
    UI2.Common.initNotice(noticeContent, "Search");
    /*-----------------------------------------------首次加载，进行过滤---------------------------------------------------*/

    /*-----------------------------------------------收索加载模块---------------------------------------------------*/
    //初始化查询模块对象
    searchobj = {
        from: $('#txtCityFrom'),
        to: $('#txtCityTo'),
        bookingfrom: $('#txtBookingFrom'),
        bookingto: $('#txtBookingTo'),
        hub: $('#txtCityHub'),
        fromCn: $('#txtCityDep'),
        toCn: $('#txtCityAri'),
        hubCn: $('#txtCityHubCn'),
        departureDate: $('#txtDateDep'),
        backDate: $('#txtDateAri'),
        btnsearch: $('#btnSearch'),
        selTravelType: $('#selTravelType'),
        spanBackDate: $('#spanBackDate'),
        spanHubStation: $('#spanHubStation'),
        btnChangeCity: $('#btnChangeCity')
    }

    //list页回退状态保存
    searchobj.fromCn[0].value = searchobj.fromCn[0].attributes['value'].value;
    searchobj.toCn[0].value = searchobj.toCn[0].attributes['value'].value;
    searchobj.hubCn[0].value = searchobj.hubCn[0].attributes['value'].value;
    searchobj.departureDate[0].value = searchobj.departureDate[0].attributes['value'].value;
    searchobj.backDate[0].value = searchobj.backDate[0].attributes['value'].value;

    //放票时间自动刷新页面
    if ($('#AutoRefreshTime')[0].value > 0)
        setTimeout("location.reload();", $('#AutoRefreshTime')[0].value * 1000);

    var mindays = new Date().addDays(0).toFormatString('yyyy-MM-dd');
    var maxdays = new Date().addDays(maxDay).toFormatString('yyyy-MM-dd');
    $.mod.load('calendar', PluginsVersion.calendar, function () {
        calendarCommContry(searchobj.departureDate, mindays, maxdays);
    });
    $.mod.load('calendar', PluginsVersion.calendar, function () {
        if (searchobj.departureDate[0].value.trim() != "yyyy-mm-dd") {
            var departdays = new Date(searchobj.departureDate[0].value.trim().replace(/\-/g, '/')).toFormatString('yyyy-MM-dd');
            calendarCommContry(searchobj.backDate, departdays, maxdays);
        }
        else {
            calendarCommContry(searchobj.backDate, mindays, maxdays);
        }
    });
    //    //加载日历控件
    //    $.mod.load('calendar', '3.0', function () {
    //        //国内
    //        calendarCommContry(searchobj.departureDate, CALENDARSTARTDATE, CALENDARENDDATE);
    //        calendarCommContry(searchobj.backDate, CALENDARSTARTDATE, CALENDARENDDATE);
    //        GetReturnDateStartDate();
    //    });

    //加载地址控件
    $.mod.load('address', '1.0', function () {

        UI2.Common.regAddress("#txtCityDep", 'barSearch_CityName', '#txtCityFrom', jsonFilterUrl);
        UI2.Common.regAddress("#txtCityAri", 'barSearch_CityName', '#txtCityTo', jsonFilterUrl);
        //noticeHubAddress = cityCommCountry(searchobj.hubCn, '#txtCityHub', big5Str);
    });

    //绑定查询按钮
    searchobj.btnsearch.bind('click', function (e) {
        SearchButtonClick(e);

    })

    //绑定返回日期框
    searchobj.backDate.bind('focus', function (e) {
        backDateFocus();
    })

    //绑定车票类型下拉框change事件
    searchobj.selTravelType.bind('change', function (e) {
        travelTypeChange();
    })

    searchobj.selTravelType.value(0); //兼容浏览器回退

    //绑定交换城市按钮Click事件
    searchobj.btnChangeCity.bind('click', function (e) {
        ChangeCity();
    })
    /*-----------------------------------------------收索模块---------------------------------------------------*/

    /*var GetHubCityData = function () {
    var baseUrlhubstation = window.location.host.replace("www", "trains");
    var hubcityjsonp;
    var dname = $("#txtCityDep").value().trim();
    var dpinyin = $("#txtCityFrom").value().trim();
    var aname = $("#txtCityAri").value().trim();
    var apinyin = $("#txtCityTo").value().trim();
    var departuredate = $("#txtDateDep").value().trim();
    var type = 1;
    baseUrlhubstation = "http://" + baseUrlhubstation + "/TrainBooking/Ajax/GetHubStation.ashx?dname=" + dname + "&dpinyin=" + dpinyin + "&aname=" + aname + "&apinyin=" + apinyin + "&ddate=" + departuredate + "&type=" + type;
    cQuery.jsonp(baseUrlhubstation,
    {
    onload: function (result) {
    if (result != "") {
    noticeHubAddress.set('jsonpSource', jsonFilterUrl);
    noticeHubAddress.set('source', { suggestion: result });
    }
    },
    onerror: function () { }
    });
    }

    $('#txtCityHubCn').regMod('notice', '1.0', {
    name: 'txtCityHubCn',
    selClass: "base_txtgray",
    tips: "中文/拼音/首字母"
    });

    $('#txtCityHubCn').bind("click", function () {
    GetHubCityData();
    })

    $('#txtCityHubCn').bind("blur", function () {
    noticeHubAddress.set('source', { suggestion: { "正在查询中转站，请稍等...": []} });
    })*/

    var noticeHubAddress = UI2.Common.regAddressHub("#txtCityHubCn", 'txtCityHubCn', '#txtCityHub', jsonFilterUrl, 2);
    $('#txtCityHubCn').regMod('notice', '1.0', {
        name: 'txtCityHubCn',
        selClass: "base_txtgray",
        tips: "中文/拼音/首字母"
    });
    $('#txtCityHubCn').bind("click", function () {
        GetHubCityData();
    })
    var GetHubCityData = function () {
        $(noticeHubAddress.HubDiv).html("");
        $(noticeHubAddress.HubP).html("正在查询中转站，请稍等...");
        var baseUrl = window.location.host.replace("www", "trains");
        var hubcityjsonp;
        var dname = $("#txtCityDep").value().trim();
        var dpinyin = $("#txtCityFrom").value().trim();
        var aname = $("#txtCityAri").value().trim();
        var apinyin = $("#txtCityTo").value().trim();
        var departuredate = $("#txtDateDep").value().trim();
        var type = 3;
        baseUrl = "http://" + baseUrl + "/TrainBooking/Ajax/GetHubStation.ashx?dname=" + dname + "&dpinyin=" + dpinyin + "&aname=" + aname + "&apinyin=" + apinyin + "&ddate=" + departuredate + "&type=" + type;
        cQuery.ajax(baseUrl,
             {
                 onsuccess: function (result) {
                     if (result.responseText != "") {
                         $(noticeHubAddress.HubP).html("请选择中转站");
                         var lists = $.parseJSON(result.responseText);
                         if (lists && lists.length > 0) {
                             var hubstations = "";
                             lists.each(function (hs) {
                                 hubstations = hubstations + "<a href='javascript:void(0);'>" + hs.display + "</a>";
                                 $(noticeHubAddress.HubDiv).html(hubstations);
                                 noticeHubAddress.HistoryAClick();
                             })
                         }
                         else {
                             $(noticeHubAddress.HubP).html("暂无中转站");
                         }
                     }
                 },
                 onerror: function () { }
             });
    }

    //add by pinellia
    /*-----------------------------------------------中转站模块---------------------------------------------------*/
    //    //初始化浮动模块对象
    //    floatmodule = {
    //        gotoTop: $('#floatmodulegotop'),
    //        helpLink: $('#floatmoduleqa')
    //    }

    //    //帮助按钮绑定事件
    //    floatmodule.helpLink.bind('click', function (e) {
    //        ChatClick("help");
    //    })

    //    //绑定Scroll事件
    //    BindScrollEvent(window);


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
    /*-----------------------------------------------排序模块---------------------------------------------------*/
    SortMain($("#newsort01"), $("#resultTable01"));
    /*-----------------------------------------------在线客服模块---------------------------------------------------*/
    $.mod.load('sideBar', '2.0', function () {
        var sidebar = $(document).regMod('sideBar', '2.0', {
            url: {
                //                feedBackURL: 'http://my.ctrip.com/uxp/Community/CommunityAdvice.aspx?productType=7',
                feedBackURL: 'http://my.ctrip.com/uxp/Community/CommunityAdvice.aspx?productType=7',
                liveChatURL: CHATURL
            },
            title: {
                backTop: '回到顶端',
                feedBack: '建议反馈',
                liveChat: '在线客服'
            }
        });

        //        $($('#sidebar a')[2]).get(0).removeAttribute("href");
        //        $($('#sidebar a')[2]).get(0).setAttribute("id", "sidebarLiveChat");
        //        $($('#sidebar a')[2]).css("cursor", "pointer");
        //        $($('#sidebar a')[2]).bind('click', function (e) {
        //            return __SSO_booking('help', '1');
        //        });
    });

    /*-----------------------------------------------中转票----------------------------------------------------*/
    UI2.HubTicket.hubTicketClick();

    //seo
    //departure city seo tool
    for (var i = 0; i < tooldatas.length; i++) {
        if (tooldatas[i].cityName == seoDCityName) {
            var spotID = tooldatas[i].spotUrl.match(/\d+/gi);
            var hotelID = tooldatas[i].hotelID;
            if (!!spotID) {
                var travle = $("#travle");
                travle[0].innerHTML = tooldatas[i].cityName + "旅游";
                travle[0].href = 'http://vacations.ctrip.com/tours/d-' + seoDCityEName.toLowerCase() + '-' + spotID;
                var strategy = $("#strategy");
                strategy[0].innerHTML = tooldatas[i].cityName + "旅游攻略";
                strategy[0].href = "http://you.ctrip.com/place/" + seoDCityEName + spotID + ".html";
                var ticket = $("#ticket");
                ticket[0].innerHTML = tooldatas[i].cityName + "景点门票";
                ticket[0].href = "http://piao.ctrip.com/dest/d-" + seoDCityEName + "-" + spotID + "/s-tickets/";
            }
            if (hotelID) {
                var hotel = $("#hotel");
                hotel[0].innerHTML = tooldatas[i].cityName + "酒店";
                hotel[0].href = "http://hotels.ctrip.com/hotel/" + seoDCityEName + hotelID;
            }
            break;
        }
    }
    //arrival city seo tool
    for (var i = 0; i < tooldatas.length; i++) {
        if (tooldatas[i].cityName == seoACityName) {
            var spotID = tooldatas[i].spotUrl.match(/\d+/gi);
            var hotelID = tooldatas[i].hotelID;
            if (!!spotID) {
                var travle = $("#atravle");
                travle[0].innerHTML = tooldatas[i].cityName + "旅游";
                travle[0].href = 'http://vacations.ctrip.com/tours/d-' + seoACityEName.toLowerCase() + '-' + spotID;
                var strategy = $("#astrategy");
                strategy[0].innerHTML = tooldatas[i].cityName + "旅游攻略";
                strategy[0].href = "http://you.ctrip.com/place/" + seoACityEName + spotID + ".html";
                var ticket = $("#aticket");
                ticket[0].innerHTML = tooldatas[i].cityName + "景点门票";
                ticket[0].href = "http://piao.ctrip.com/dest/d-" + seoACityEName + "-" + spotID + "/s-tickets/";
            }
            if (hotelID) {
                var hotel = $("#ahotel");
                hotel[0].innerHTML = tooldatas[i].cityName + "酒店";
                hotel[0].href = "http://hotels.ctrip.com/hotel/" + seoACityEName + hotelID;
            }
            break;
        }
    }
    var btnList = $("a[name=btnSendSMS]");
    for (var i = 0; i < btnList.length; i++) {
        UI2.Common.addEvent(btnList[i], "click", sendAppSMS);
    }

})

/*======================================================收索模块=================================================*/
//定义查询模块对象
var searchobj;

//初始化日历控件方法
var calendarCommContry = function (dateStr, startDate, endDate) {
    dateStr.regMod('calendar', PluginsVersion.calendar, {
        options: {
            minDate: startDate,
            maxDate: endDate,
            autoShow: true,
            showWeek: false
        },
        listeners: {
            onChange: function (input, value) {
                GetReturnDateStartDate();
            }
        }
    });
}

//国内城市选择框
var cityCommCountry = function (cityName, param, big5Str) {
    var url = "http://webresource.ctrip.com/code/cquery/resource/address/train_new/station_gb2312.js?releaseno=" + ReleaseNoAddress + ".js";
    if (big5Str != "") {
        url = "http://webresource.ctrip.com/code/cquery/resource/address/train_new/station_big5.js?releaseno=" + ReleaseNoAddress + ".js";
    }
    var addressMod;
    if (param == "#txtCityHub") {
        addressMod = cityName.regMod('address', '1.0', {
            name: 'barSearch_CityName',
            jsonpSource: url,
            source: {
                suggestion: { "正在查询中转站，请稍等...": [] }
            },
            sort: ['^0$', '^1$', '^3+$', '^0', '^1', '^3+'],
            relate: {
                'name_py1': param
            },
            isFocusNext: true,
            isAutoCorrect: true
        });
    }
    else {
        addressMod = cityName.regMod('address', '1.0', {
            name: 'barSearch_CityName',
            jsonpSource: url,
            sort: ['^0$', '^1$', '^3+$', '^0', '^1', '^3+'],
            relate: {
                'name_py1': param
            },
            isFocusNext: true,
            isAutoCorrect: true
        });
    }
    return addressMod;
}

//
var GetReturnDateStartDate = function () {
    var nextD = new Date(searchobj.departureDate[0].value.trim().replace(/\-/g, '/')).toFormatString('yyyy-MM-dd');
    searchobj.backDate.data('minDate', nextD);

    var departuredate = searchobj.departureDate[0].value.trim().replace(/\-/g, '/');
    var backdate = "";
    //返回日期值
    if (searchobj.backDate[0].value.trim() != "" && searchobj.backDate[0].value.trim() != "yyyy-mm-dd") {
        backdate = searchobj.backDate[0].value.trim().replace(/\-/g, '/');
    }

    //日期类型（只有当往返的时候才选择）
    var Datedeparturedate;
    var Datebackdate;
    if (backdate != "") {
        Datedeparturedate = new Date(departuredate);
        Datebackdate = new Date(backdate);

        //当出发日期大于返回日期的时候
        if (Datedeparturedate > Datebackdate) {
            //当出发日期加上2天大于最大时间的时候
            if (Datedeparturedate.addDays(2) > new Date(CALENDARENDDATE.replace(/\-/g, '/'))) {
                //取最大值
                searchobj.backDate[0].value = CALENDARENDDATE;
            }
            else {
                //取加两天后的值
                searchobj.backDate[0].value = Datedeparturedate.addDays(2).toFormatString('yyyy-MM-dd');
            }
        }
    }
}

//设置Cookie
var setCookie = function () {
    var arrDate = "";
    if (searchobj.selTravelType[0].value == "1") {
        arrDate = searchobj.backDate[0].value.trim();
    }
    var cookiedomain = window.location.host.replace(/trains\.big5\.|trains\./, '');
    cQuery.cookie.set('TrainLastSearch', null, searchobj.fromCn[0].value.trim() + '|' + searchobj.from[0].value.trim() + '|' + searchobj.toCn[0].value.trim() + '|' + searchobj.to[0].value.trim() + '|' + searchobj.departureDate[0].value.trim() + '|' + arrDate, { expires: 30, domain: cookiedomain, path: '/' });
}

//返回日期框聚焦方法
var backDateFocus = function () {
    searchobj.selTravelType[0].value = '1';
    searchobj.spanBackDate.removeClass('base_txtgray');
    searchobj.backDate.css('color', '#333');
}

//车票类型变动事件
var travelTypeChange = function () {
    if (searchobj.selTravelType[0].value == '1') {
        searchobj.spanBackDate.removeClass('base_txtgray');
        searchobj.backDate.css('color', '#333');
        searchobj.spanHubStation.css('display', 'none');
        searchobj.hubCn.css('display', 'none');
        searchobj.spanBackDate.css('display', '');
        searchobj.backDate.css('display', '');
    }
    else if (searchobj.selTravelType[0].value == '2') {
        searchobj.spanHubStation.css('display', '');
        searchobj.hubCn.css('display', '');
        searchobj.spanBackDate.css('display', 'none');
        searchobj.backDate.css('display', 'none');
    }
    else {
        searchobj.spanBackDate.addClass('base_txtgray');
        searchobj.backDate.css('color', 'gray');
        searchobj.spanHubStation.css('display', 'none');
        searchobj.hubCn.css('display', 'none');
        searchobj.spanBackDate.css('display', '');
        searchobj.backDate.css('display', '');
    }
}

//改变往返城市按钮点击事件
var ChangeCity = function () {
    var cityName;
    var cityValue;

    cityName = searchobj.fromCn[0].value;
    searchobj.fromCn[0].value = searchobj.toCn[0].value;
    searchobj.toCn[0].value = cityName;

    cityValue = searchobj.from[0].value;
    searchobj.from[0].value = searchobj.to[0].value;
    searchobj.to[0].value = cityValue;
}

var SearchButtonClick = function (e) {
    var validateShow;
    $.mod.load('validate', '1.1', function () {
        var valid = $(document).regMod("validate", "1.1");
        validateShow = function (obj, message) {
            valid.method("show", { $obj: obj, data: message, removeErrorClass: true, hideEvent: "blur", isFocus: true });
        };
    })

    //验证出发城市
    if (searchobj.fromCn[0].value.trim() == "中文/拼音/首字母" || searchobj.from[0].value.trim() == "") {
        validateShow(searchobj.fromCn, "请输入出发城市名称");
        return false;
    }

    //验证到达城市
    if (searchobj.toCn[0].value.trim() == "中文/拼音/首字母" || searchobj.to[0].value.trim() == "") {
        validateShow(searchobj.toCn, "请输入到达城市名称");
        return false;
    }

    //验证出发日期
    if (searchobj.departureDate[0].value.replace(/\//g, '-').trim() == "yyyy-mm-dd" || searchobj.departureDate[0].value.trim() == "") {
        validateShow(searchobj.departureDate, "请选择出发日期");
        return false;
    }

    //往返程添加样式验证
    var returnd;
    if (searchobj.selTravelType[0].value.trim() == "1") {
        //返回日期不为空
        if (searchobj.backDate[0].value.replace(/\//g, '-').trim() == "yyyy-mm-dd" || searchobj.backDate[0].value.trim() == "") {
            validateShow(searchobj.backDate, "请选择返回日期");
            return false;
        }

        //验证返回日期和去程日期的大小关系
        var strdeDate = searchobj.departureDate[0].value.trim().replace(/\-/g, '/');
        var strbaDate = searchobj.backDate[0].value.trim().replace(/\-/g, '/');
        var dtdeDate = new Date(strdeDate);
        var dtbaDate = new Date(strbaDate);

        if (dtdeDate > dtbaDate) {
            validateShow(searchobj.backDate, '返回日期不能小于出发日期');
            return false;
        }

        //返回日期
        returnd = Math.ceil((dtbaDate - new Date()) / (60 * 60 * 24 * 1000)) + 1;
    }

    var departureDate = searchobj.departureDate[0].value.trim().replace(/\-/g, '/');
    var d = Math.ceil((new Date(departureDate) - new Date()) / (60 * 60 * 24 * 1000)) + 1;

    var trainnumber = "";
    var baseUrl = SITEHOMEPAGE;
    if (searchobj.selTravelType[0].value.trim() == "0") {
        url = baseUrl + "/Search.aspx?from=" + searchobj.from[0].value.trim() + "&to=" + searchobj.to[0].value.trim() + "&day=" + d + "&number=" + trainnumber + "&fromCn=" + searchobj.fromCn[0].value.trim() + "&toCn=" + searchobj.toCn[0].value.trim();
    }
    else if (searchobj.selTravelType[0].value.trim() == "1") {
        url = baseUrl + "/RoundTrip.aspx?from=" + searchobj.from[0].value.trim() + "&to=" + searchobj.to[0].value.trim() + "&dayreturn=" + returnd + "&day=" + d + "&number=" + trainnumber + "&fromCn=" + searchobj.fromCn[0].value.trim() + "&toCn=" + searchobj.toCn[0].value.trim();
    }
    else if (searchobj.selTravelType[0].value.trim() == "2") {
        if (searchobj.hub.value().trim() == "") {
            url = baseUrl + "/HubSingleTrip.aspx?from=" + searchobj.from[0].value.trim()
                    + "&to=" + searchobj.to[0].value.trim() + "&day=" + d
                    + "&number=&jumpflag=2&fromCn=" + searchobj.fromCn[0].value.trim() + "&toCn=" + searchobj.toCn[0].value.trim();
        }
        else {
            url = baseUrl + "/HubRoundTrip.aspx?from=" + searchobj.from[0].value.trim()
        + "&to=" + searchobj.to[0].value.trim() + "&hub=" + searchobj.hub[0].value.trim()
        + "&day=" + d + "&number=" + trainnumber + "&fromCn=" + searchobj.fromCn[0].value.trim()
        + "&toCn=" + searchobj.toCn[0].value.trim() + "&hubCn=" + searchobj.hubCn[0].value.trim();
        }
    }
    setCookie();
    if (typeof window.$location == "undefined") window.$location = function (url) { if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { var referLink = document.createElement("a"); referLink.href = url; document.body.appendChild(referLink); referLink.click() } else location.href = url };
    $location(url);
    e.preventDefault();
}

/*======================================================浮动模块=================================================*/
//定义浮动模块对象
//var floatmodule;

//绑定浮动箭头的显示与否
//BindScrollEvent = function (window) {
//    var ele = floatmodule.gotoTop;
//    var w3c = !!window.addEventListener;
//    var addListener = w3c ?
//              function (el, type, fn) { el.addEventListener(type, fn, false); } :
//              function (el, type, fn) { el.attachEvent('on' + type, fn); };
//    if (ele) {
//        addListener(window, "scroll", function () {
//            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//            if (scrollTop > 0) {
//                ele.css('display', '');
//            } else {
//                ele.css('display', 'none');
//            }
//        });
//    }
//}

/*======================================================过滤程序模块=================================================*/
var SEARCH_CATE_LIST = 'resultFilters',
    FILTER_CONTROLLER = 'filterController', //add by yicong @ 2011-11-17
    NEWSORT = "newsort",
    FILTER_START_HIDDEN = 2, //add by yicong @ 2011-11-17
    BINARY_IS_G = 0x1,
    BINARY_IS_D = 0x2,
    BINARY_DEPART = [0x8, 0x10, 0x20, 0x40],
    BINARY_ARRIVAL = [0x80, 0x100, 0x200, 0x400],
//时间范围调整
    TIME_RANGES = [[0, 600], [600, 1200], [1200, 1800], [1800, 2400]], //for time range
    IS_OVER = ["true", "false"],
//BINARY_TRAINS_TYPE = [0x1, 0x2, 0x4, 0x8, 0x10, 0x20],
//TRAINS_TYPE = ["G", "D", "Z", "T", "K", "X"];
    BINARY_TRAINS_TYPE = [0x1, 0x2, 0x4],
    TRAINS_TYPE = ["G", "D", "X"];
var //tbody里面的项目的过滤参数序列
    FILTER_TYPE = 0, //高铁，动车过滤
    FILTER_DEPART = 1, //出发时间段过滤
    FILTER_ARRIVAL = 2, //到达时间段过滤
    FILTER_TAKETIME = 3, //暂时没用(没用)
    FILTER_BOOKABLE = 4, //是否可以预订过滤(没用)
    FILTER_DEPARTURE_ST = 5, //出发站名add by yicong @ 2011-11-17
    FILTER_ARRIVAL_ST = 6, //到达站名add by yicong @ 2011-11-17
    FILTER_IS_START = 7, //是否始发站add by yicong @ 2011-11-17
    HIDEEN_START_FROM = 128; //筛选条件起始隐藏点(没用)

var //快捷排序
    SORT_DEPARTURE = 1, //和上面一致;
    SORT_ARRIVAL = 2, //和上面一致
    SORT_TAKETIME = 3; //和上面一致

var PREVIEW_DATE1, PREVIEW_DATE2, NEXT_DATE1, NEXT_DATE2;

//过滤值
var filterBinary;

//过滤主程序
var filterResult = function (RESULT_TABLE, NO_FILTER_RESULT, TOTAL_RESULT, item) {//过滤主程序
    var _resultsCount = 0;
    $(RESULT_TABLE).find('tbody').each(function (tbody) {
        var filter = tbody.attr('filter');
        if (filter && filter.length > 0) {
            filter = filter.split(' ');
            if (
                        compareBinary(filter[FILTER_TYPE], FILTER_TYPE, item) &&
                        compareBinary(filterToInt(filter[FILTER_DEPART]), FILTER_DEPART, item) &&
                        compareBinary(filterToInt(filter[FILTER_ARRIVAL]), FILTER_ARRIVAL, item) &&
                        compareBinary(filter[FILTER_DEPARTURE_ST], FILTER_DEPARTURE_ST, item) &&
                        compareBinary(filter[FILTER_ARRIVAL_ST], FILTER_ARRIVAL_ST, item) &&
                        compareBinary(filter[FILTER_IS_START], FILTER_IS_START, item)
                    ) {
                tbody.css('display', '');
                _resultsCount++;

            } else {
                tbody.css('display', 'none');
            }
        }
        else {
            var trflag = false;
            if ($(tbody).attr('id') != null && $(tbody).attr('id') != "" && $(tbody).attr('id').indexOf('stop') != -1) {
                trflag = true;
            }

            if (trflag) {
                tbody.css('display', 'none');
            }
        }
    });

    //车次数量
    $(TOTAL_RESULT).html(_resultsCount);
    $("#noTotalResultID").html("(共" + _resultsCount + "个车次)");

    //是否展现结果框
    if (_resultsCount == 0) {
        ShowNoResultV2("no_result_alert" + item, "resultTable" + item, true);
    }
    else {
        ShowNoResultV2("no_result_alert" + item, "resultTable" + item, false);
    }

};

//change to int
var filterToInt = function (timeString) {
    return parseInt(timeString.replace(/^0/, '').replace(/(^00|\:)/, ''));
};

//get computer filter value
var getFiltersBinary = function (SEARCH_CATE_LISTNO) {
    var _list = $(SEARCH_CATE_LISTNO);
    if (_list.length > 0) {
        var _b = 0, inputs = $(SEARCH_CATE_LISTNO).find('a');
        var i2 = 0;
        if (inputs.length > 0) {
            inputs.each(function (input) {
                if (input[0].className.indexOf("show_all") == -1) {
                    _b |= (input[0].className == "selected" ? 1 : 0) << i2;
                    i2++;
                }
            });
            return _b;
        }
    }
};

//compare the value
var compareBinary = function (filter, index, item) {
    //为了解决C城际列车无法被过滤到的问题
    if (filter == "C") {
        filter = "G";
    }
    switch (index) {
        case FILTER_TYPE:
            var _hasChecked = false, _hasMatch = false;
            //只留下3个车型项
            BINARY_TRAINS_TYPE.map(function (d, i) {
                if (filterBinary & d) {//checkbox勾没勾
                    _hasChecked = true;
                    if (filter.toUpperCase() == TRAINS_TYPE[i]) {
                        _hasMatch = true;
                    }
                    if (TRAINS_TYPE[i].toUpperCase() == "X") {
                        var flag = true;
                        for (var j = 0; j < i; j++) {
                            if (filter.toUpperCase() == TRAINS_TYPE[j]) {
                                flag = false;
                            }
                        } //不是之前的车型时匹配
                        if (flag) _hasMatch = true;
                    }
                }
            });
            if (!_hasChecked) {
                return true;
            }
            return _hasMatch;
        case FILTER_DEPART:
            var _hasChecked = false, _hasMatch = false;
            BINARY_DEPART.map(function (d, i) {
                if (filterBinary & d) {//checkbox勾没勾
                    _hasChecked = true;
                    if (filter >= TIME_RANGES[i][0] && filter <= TIME_RANGES[i][1]) {
                        _hasMatch = true;
                    }
                }
            });
            if (!_hasChecked) {
                return true;
            }
            return _hasMatch;
        case FILTER_ARRIVAL:
            var _hasChecked = false, _hasMatch = false;
            BINARY_ARRIVAL.map(function (d, i) {
                if (filterBinary & d) {//checkbox勾没勾
                    _hasChecked = true;
                    if (filter >= TIME_RANGES[i][0] && filter <= TIME_RANGES[i][1]) {
                        _hasMatch = true;
                    }
                }
            });
            if (!_hasChecked) {
                return true;
            }
            return _hasMatch;
        case FILTER_DEPARTURE_ST: //add by yicong @ 2011-11-18
            var _hasChecked = false, _hasMatch = false;
            BINARY_DEPART_ST.map(function (d, i) {
                if (filterBinary & d) {//checkbox勾没勾
                    _hasChecked = true;
                    if (filter == eval("DEPART_STATION_NAME" + item)[i]) {
                        _hasMatch = true;
                    }
                }
            });
            if (!_hasChecked) {
                return true;
            }
            return _hasMatch;
        case FILTER_ARRIVAL_ST: //add by yicong @ 2011-11-18
            var _hasChecked = false, _hasMatch = false;
            BINARY_ARRIVAL_ST.map(function (d, i) {
                if (filterBinary & d) {//checkbox勾没勾
                    _hasChecked = true;
                    if (filter == eval("ARRIVAL_STATION_NAME" + item)[i]) {
                        _hasMatch = true;
                    }
                }
            });
            if (!_hasChecked) {
                return true;
            }
            return _hasMatch;
        case FILTER_IS_START: //add by yicong @ 2011-11-18
            var _hasChecked = false, _hasMatch = false;
            BINARY_OVER.map(function (d, i) {
                if (filterBinary & d) {//checkbox勾没勾
                    _hasChecked = true;
                    if (filter == IS_OVER[i]) {
                        _hasMatch = true;
                    }
                }
            });
            if (!_hasChecked) {
                return true;
            }
            return _hasMatch;
        default:
            return false;
    }
};

//控制
var filterShowAlternate = function (No) {
    var o = $("#filterController" + No);
    if (o.find("span")[0].innerHTML == "更多筛选条件") {
        filterShow(true, No, o);
    }
    else {
        filterShow(false, No, o);
    }

};

//展现
var filterShow = function (show, No, obj) {
    var o = $(obj);
    var o2 = $("#filterControllerIcon" + No);
    if (show) {
        o.find("span")[0].innerHTML = "收起";
        o2[0].className = "icon_hide";

        var dt = $("#resultFilters" + No).find("dt");
        for (var i = FILTER_START_HIDDEN; i < dt.length; i++) {
            $(dt[i]).css('display', '');
        }
        var dd = $("#resultFilters" + No).find("dl");
        for (var i = FILTER_START_HIDDEN; i < dd.length; i++) {
            $(dd[i]).css('display', '');
        }
    }
    else {
        o.find("span")[0].innerHTML = "更多筛选条件";
        o2[0].className = "icon_show";

        var dt = $("#resultFilters" + No).find("dt");
        for (var i = FILTER_START_HIDDEN; i < dt.length; i++) {
            $(dt[i]).css('display', 'none');
        }
        var dd = $("#resultFilters" + No).find("dl");
        for (var i = FILTER_START_HIDDEN; i < dd.length; i++) {
            $(dd[i]).css('display', 'none');
        }
    }
}

restoreFiltersInputsWithBinary = function (binary, No) {//save filter
    var inputs = $("#" + SEARCH_CATE_LIST + No).find('a');
    var i2 = 0;
    inputs.each(function (input, i) {
        if (input[0].className.indexOf("show_all") == -1) {
            var checked = binary & (1 << i2);
            if (checked) {
                input[0].className = "selected";
            }
            if (input.checked) {
            }
            i2++;
        }

    });

    //配置全部选择项
    $("#" + SEARCH_CATE_LIST + No).find('dl').each(function (dd, index) {
        var _a = dd.find('a')[0];
        var toggleClass = false;

        $(dd).find('a').each(function (input) {
            if (input[0].className == "selected") {
                toggleClass = true;
            }
        });
        if (toggleClass) {
            $(_a)[0].className = "show_all";
        }
    });
}

/*======================================================无数据展示模块=================================================*/
//展现该条件下是否有车次
var NoTrainDataInnerHtml = "<b></b><p style=\"font:22px 'Microsoft Yahei';\">很抱歉，该条件下无车次信息。</p><p style=\"margin-bottom:20px;\">您可以试试更改搜索条件重新搜索，或选择中转。</p><div><a href=\"http://trains.ctrip.com/TrainSchedule/\">查询列车时刻表 &gt;</a> <a href=\"http://trains.ctrip.com\">返回火车票首页 &gt;</a> </div>";

//展现没结果对话框
var ShowNoResultV2 = function (alertid, tableid, showflag) {
    if (showflag) {
        $("#" + alertid).html(NoTrainDataInnerHtml);
        $("#" + alertid).css("display", "");
    }
    else {
        $("#" + alertid).css("display", "none");
    }
}

/*======================================================排序程序模块=================================================*/
var SortMain = function (NEWSORTNO, RESULT_TABLENO) {
    //排序
    $(NEWSORTNO).find('a').each(function (A) {
        $(A).bind('click', function (e) {
            var attr = $(A).attr('order');
            if (!attr || attr.length == 0) return;

            var li = $(A).find("b").first();
            attr = attr.split(',');
            var type = attr[0];
            var order = attr[1];
            var solid = attr[2];
            var className = li[0].className;
            //为了解决默认显示最短耗时的问题
            if (type == 3) {
                if ($(A)[0].className == "") {
                    var newsort = $(NEWSORTNO);
                    var newli = newsort.find('a');
                    newli[0].className = '';
                }
            }
            else {
                SetGray(NEWSORTNO);
            }
            if (order != 'desc' && order != 'asc') {
                switch (className) {
                    case "icon_arrow_up":
                        //为了解决默认显示最短耗时的问题
                        if (type == 3 && $(A)[0].className == "") {
                            $(A)[0].className = 'current';
                            order = "asc";
                        }
                        else {
                            li[0].className = 'icon_arrow_down';
                            $(A)[0].className = 'current';
                            order = "desc";
                        }
                        break;
                    case "icon_arrow_down":
                        li[0].className = 'icon_arrow_up';
                        $(A)[0].className = 'current';
                        order = "asc";
                        break;
                    default:
                        break;
                }
            }

            sortByType(RESULT_TABLENO, type, order);
        })
    })

}

var SetGray = function (NEWSORTNO) {//set all css is gray
    var newsort = $(NEWSORTNO);
    newsort.find('a').each(function (li) {
        li[0].className = '';
    });
}

var sortByType = function (RESULT_TABLE, type, order) {//main function
    var tbodies = $(RESULT_TABLE).find("tbody");
    var copy = [];
    //经停站的tbody
    var stopcopy = [];
    //区间票的tbody
    var qjcopy = [];
    var tbodyi;
    copy.push(tbodies[0]); //行头加进去
    if ($("#IsShowFlight") != null) {
        copy.push(tbodies[1]); //机票加进去
    }
    if ($("#IsShowBus") != null) {
        copy.push(tbodies[2]); //汽车加进去
    }
    for (var i = 0; i < tbodies.length; i++) {
        tbodyi = tbodies[i];
        if ($(tbodyi).attr('id') != null && $(tbodyi).attr('id') != "" && $(tbodyi).attr('id').indexOf("stop") == -1 && $(tbodyi).attr('id').indexOf("-QJ") == -1) {
            copy.push(tbodies[i]);
        }
        else if ($(tbodyi).attr('id') != null && $(tbodyi).attr('id') != "" && $(tbodyi).attr('id').indexOf("stop") != -1) {
            stopcopy.push(tbodies[i]);
        }
        else if ($(tbodyi).attr('id') != null && $(tbodyi).attr('id') != "" && $(tbodyi).attr('id').indexOf("-QJ") != -1) {
            qjcopy.push(tbodies[i]);
        }
    }
    copy = sort(copy, type, order); //main sub function

    for (var i = 0; i < qjcopy.length; i++) {
        $(qjcopy[i]).remove();
    }

    for (var i = 0; i < stopcopy.length; i++) {
        $(stopcopy[i]).remove();
    }

    for (var i = 0; i < copy.length; i++) {
        $(copy[i]).remove();
        $(RESULT_TABLE).append(copy[i]);
    }

    var databjid;
    for (var i = 0; i < stopcopy.length; i++) {

        databjid = $(stopcopy[i]).attr('id');
        if ($(stopcopy[i]).attr('id') != null && $(stopcopy[i]).attr('id') != "") {
            var nostopcopy = document.getElementById($(stopcopy[i]).attr('id').replace("stop", "")); //兼容Cquery
            $(stopcopy[i]).insertAfter($(nostopcopy));
        }
    }
    for (var i = 0; i < qjcopy.length; i++) {

        databjid = $(qjcopy[i]).attr('id');
        if ($(qjcopy[i]).attr('id') != null && $(qjcopy[i]).attr('id') != "") {
            var nostopcopy = document.getElementById($(qjcopy[i]).attr('id').replace("-QJ", "")); //兼容Cquery
            var stopcopy = document.getElementById("stop" + $(nostopcopy).attr('id'));
            if (stopcopy) {
                $(qjcopy[i]).insertAfter($(stopcopy));
            }
            else {
                $(qjcopy[i]).insertAfter($(nostopcopy));
            }
        }
    }

}

var sort = function (input, sortType, order) {//for sort
    if (sortType && sortType != SORT_DEPARTURE && sortType != SORT_ARRIVAL && sortType != SORT_TAKETIME) return input;
    var copy = input;
    order = (order && order == 'desc') ? -1 : 1; //parameter "order" to control asc or desc order
    //表头不参与排序
    var startIndex = 1; //edit by pinellia 20130620 为了兼容单程和往返排序
    //推荐机票不参加排序
    if ($("#IsShowFlight") != null) {
        startIndex += 1;
    }
    //推荐汽车票不参加排序
    if ($("#IsShowBus") != null) {
        startIndex += 1;
    }
    for (var i = startIndex; i < copy.length - 1; i++) {
        var index = i;
        for (var j = i + 1; j < copy.length; j++) {
            //use order parameter
            if (parseInt(compare(copy[index], copy[j], sortType)) * parseInt(order) > 0 || //self order
                (parseInt(compare(copy[index], copy[j], sortType)) * parseInt(order) == 0 && //if equal then compare departure time
                 parseInt(compare(copy[index], copy[j], SORT_DEPARTURE)) * parseInt(order) > 0)
            ) {
                index = j;
            }
        }
        if (index != i) {
            var temp = copy[index];
            copy[index] = copy[i];
            copy[i] = temp;
        }
    }
    return copy;
};

var compare = function (first, second, sortType) {//for compare
    var filterA = $(first).attr('filter');
    filterA = filterA.split(' ');
    var filterB = $(second).attr('filter');
    filterB = filterB.split(' ');
    if (filterToInt(filterA[sortType]) > filterToInt(filterB[sortType])) {
        return 1;
    }
    if (filterToInt(filterA[sortType]) < filterToInt(filterB[sortType])) {
        return -1;
    }
    return 0;
};

/*======================================================获取经停站数据模块=================================================*/

//获取经停站信息
var GetStopStationData = function (paramer, tbodyid) {
    //找到该元素就不去请求
    var stopobj = document.getElementById("stop" + tbodyid);
    var iconobj = $("a[name=aStopStation] b", document.getElementById(tbodyid));

    if (stopobj) {
        if ($(stopobj).css("display") == "none") {
            $(stopobj).css('display', ''); //展现
            $(iconobj).removeClass();
            $(iconobj).addClass("icon_hide");
        }
        else {
            $(stopobj).css("display", "none"); //收起
            $(iconobj).removeClass();
            $(iconobj).addClass("icon_show");
            //$(stopobj).remove(); //不去除影响排序
        }
    }
    //未找到，去ajax请求
    else {
        cQuery.ajax('http://' + location.hostname + '/TrainBooking/Ajax/GetStopStationV22.ashx?paramer=' + paramer, { onsuccess: function (result) {
            if (result && result.responseText != "") {
                var tBody = document.createElement("tbody");
                var paramarr = paramer.split('|');
                var stoptbodyid = "stop" + tbodyid;
                $(tBody).attr('id', stoptbodyid);
                $(tBody).attr('name', "stopbody");

                $(tBody).html(result.responseText);
                $(tBody).insertAfter($(document.getElementById(tbodyid)));
                $(iconobj).removeClass();
                $(iconobj).addClass("icon_hide");
            }
            else {
                $(iconobj).removeClass();
                $(iconobj).addClass("icon_show");
                $("#pstopstationalert").html("非常抱歉，暂时没有经停站信息。");
                $("#stopstationalert").mask();
                UI2.TicketsRange.clickedTicketsRange = null;
            }
        }
        });
    }
}


/*======================================================按钮点击模块=================================================*/
//座位按钮点击方法
var BookingCheck = function (trainNumber, departureStationId, arrivalStationId, departureStationName, arrivalStationName, ticketTime, ticketTime2, bookableSeatIDs, a, t, No, seat, price) {
    UI2.TicketsRange.isRange = arguments.callee.length != arguments.length;
    UI2.TicketsRange.arguments = arguments;
    UI2.TicketsRange.clickedTicketsRang = null;
    var imgLoading = document.getElementById("imgBookingLoading");
    $(imgLoading).mask();
    imgLoading.style.display = "block";
    //禁用所有的预定按钮和不符合时间的车次
    if (No == "01") {
        //控制去程按钮样式
        $("#resultTable01").find('input').each(function (A) {
            if (A[0].className == "btn_book" || A[0].className == "btn_book disable") {
                $(A).attr('saveclassname', A[0].className);
                A[0].className = "btn_book disable"; //旋转的时候不可点击 add by pinellia
                $(A).attr('saveonclick', $(A).attr('onclick'));
                $(A).attr('onclick', 'javascript:void(0)')
            }
        })

        //控制图片、价格样式
        var btnid = $(seat).attr('id');
        var dfnid = "dfn-" + btnid;
        var imgid = "img-" + btnid;
        var spanid = "span-" + btnid;
        var dfnobj = document.getElementById(dfnid);
        var spanobj = document.getElementById(spanid);
        var imgobj = document.getElementById(imgid);


        $(dfnobj).css('display', 'none');
        $(spanobj).css('display', 'none');
        $(imgobj).css('display', '');

        //Ajax取数据
        //BookingCheckAjax(No, trainNumber, departureStationId, arrivalStationId, ticketTime, bookableSeatIDs, seat, price, a, bookableSeatIDs);
        //为了解决IE10 兼容问题  当两个参数的名称相同的时候  bookableSeatIDs 传入的是207  但是最后就变成了一个document  object(IE坑)
        BookingCheckAjax(No, trainNumber, departureStationName, arrivalStationName, ticketTime, bookableSeatIDs, seat, price, a);
    }
}


//Ajax去后台验证数据
var fullpara;
var BookingCheckAjax = function (NO, trainNumber, departureStationName, arrivalStationName, ticketTime, bookableSeatIDs, seatobj, price, para) {
    var url = "http://" + location.hostname + "/TrainBooking/Ajax/CheckListBookable.ashx";
    var parame = "?trainNumber=" + trainNumber + "&departureStationName=" + departureStationName +
                     "&arrivalStationName=" + arrivalStationName + "&departureDateTime=" + ticketTime +
                     "&seatTypeIDs=" + bookableSeatIDs;
    fullpara = para;
    cQuery.ajax(url + parame, {
        onsuccess: function (result) {
            var resultjson = eval(result.responseText);
            //控制图片、价格样式
            var btnid = $(seatobj).attr('id');
            var dfnid = "dfn-" + btnid;
            var imgid = "img-" + btnid;
            var spanid = "span-" + btnid;
            var dfnobj = document.getElementById(dfnid);
            var spanobj = document.getElementById(spanid);
            var imgobj = document.getElementById(imgid);

            $(dfnobj).css('display', '');
            $(spanobj).css('display', '');
            $(imgobj).css('display', 'none');

            //控制按钮样式方法
            $("#resultTable" + NO).find("input").each(function (A) {
                $(A).attr('onclick', $(A).attr('saveonclick'));
                $(A)[0].className = $(A).attr('saveclassname');
            });
            //针对每一个车次坐席处理，将所有验证后的无票的车次预订按钮置灰 add by mwx 20140707
            if (!UI2.TicketsRange.isRange && !resultjson.IsBookable) {
                for (var i = 0; i < resultjson.CheckBooableForPCBodyV3.length; i++) {
                    var item = resultjson.CheckBooableForPCBodyV3[i];
                    for (var j = 0; j < item.SeatInventory.length; j++) {
                        //不可预订
                        if (item.SeatInventory[j].Inventory <= 0) {
                            //Cquery 选择器 匹配seatid $('input[seatid="G22-220"]')
                            var idobj = $('input[seatid="' + item.TrainNumber + '-' + item.SeatInventory[j].SeatID + '"]');
                            //如果存在这个对象，则将该按钮置灰
                            if ($(idobj).length > 0) {
                                //如果存在多个车次则循环处理（可能出现一次查询出现两个相同车次的情况(如同时到达无锡、无锡东的车次)）
                                for (var n = 0; n < $(idobj).length; n++) {
                                    //处理金额样式
                                    var spanidobj = document.getElementById("span-" + $(idobj)[n].id);
                                    //DEBUG 输出所有验证后无票的车次
                                    //if($(spanidobj)[0].className != "base_price base_txtgray")
                                    //    console.log('无票车次' + $(idobj)[n].id);
                                    $(spanidobj)[0].className = "base_price base_txtgray";
                                    //处理选择按钮
                                    $(idobj)[n].className = "btn_book disable";
                                    $(idobj).attr('onclick', 'javascript:void(0)');
                                    //如果不可定则设置往返也不可预订
                                    var a = $(idobj)[n].nextSibling;
                                    if (a) {
                                        a.className= 'link_wangfan disable';
                                        $(a).attr('onclick', 'javascript:void(0)');
                                    }

                                    //                                    //加载捡退票按钮
                                    //                                    var btn = $(idobj)[n];
                                    //                                    $(btn).css('display', 'none');
                                    //                                    var parent = $(btn)[0].parentNode;
                                    //                                    var shtml = "<span class='base_txtgray'></span><a href='##' class='btn_comm btn_7' onclick='ShowJTP(true)'>捡退票</a>";
                                    //                                    if ($(parent).html().indexOf("捡退票") == -1) {
                                    //                                        $(parent).html($(parent).html() + shtml);
                                    //                                    }
                                }
                            }
                        }
                    }
                    //可以预订时不处理
                }
            }

            fullpara = fullpara + "|" + bookableSeatIDs;

            if (resultjson.IsBookable && resultjson.IsBookable == true) {
                BookingBtnClick(fullpara);
            }
            else {
                //                //为了解决对象已经更改的问题(如果是区间票的按钮就不替换)
                //                if ($("input[seatid='" + $(seatobj).attr("seatid") + "']").length > 0) {
                //                    seatobj = $("input[seatid='" + $(seatobj).attr("seatid") + "']");
                //                }
                //放票3分钟标识
                if ($(seatobj).attr('justrelease')) {
                    //提示框
                    $("#pstopstationalert").html("非常抱歉，我们正在获取票源，请稍等2分钟再尝试。");
                    $("#stopstationalert").mask();
                }
                else {
                    $(seatobj).attr('onclick', 'javascript:void(0)');
                    $(seatobj).attr('saveonclick', 'javascript:void(0)');
                    $(seatobj)[0].className = 'btn_book disable';
                    $(seatobj).attr('saveclassname', 'btn_book disable');
                    $(spanobj)[0].className = "base_price base_txtgray";

                    //如果不可定则设置往返也不可预订
                    var a = seatobj.nextSibling;
                    if (a) {
                        a.className = 'link_wangfan disable';
                        $(a).attr('onclick', 'javascript:void(0)');
                    }
                    //加载区间票预订按钮
                    var tbody = $("tbody:not(:has(tr.zhongtu_alert)):has(input[id='" + $(seatobj).attr('id') + "'])");
                    if (!!tbody
                        && UI2.Common.isChildOf(tbody, $(seatobj)[0])
                        && $("input.btn_book:not(.disable)", tbody[0]).length == 0
                        && arrivalStationName != '九龙') {//九龙不加载区间票
                        var onclick = $("a:has(.icon_show)", tbody[0])[0].parentNode.innerHTML.match(/\(.*(?=\))/).toString().replace(/\(/, '');
                        var isShowTuanHotel = "";
                        if (onclick.indexOf("True") == -1) {
                            isShowTuanHotel = "style='margin: -10px 10px 10px 10px;'";
                        }
                        var trainName = onclick.match(/(.*?(?=\|))*/g)[8];
                        var tr = document.createElement("tr");
                        tr.setAttribute("class", "qujian_btn_tr");
                        var td = document.createElement("td");
                        td.colSpan = "6";
                        var innerHTML = "<a href='###' class='btn_zhongtu'" + isShowTuanHotel + " onclick='UI2.TicketsRange.bookTicketsRange(event," + onclick + ")'>预订" + trainNumber + "区间票<b class='icon_show'></b></a>";
                        td.innerHTML = innerHTML;
                        tr.appendChild(td);
                        tbody[0].appendChild(tr);
                        $("tr:eq(0)", tbody[0]).addClass('qujian_tr');
                    }

                    //                    //加载捡退票按钮
                    //                    $(seatobj).css('display', 'none');
                    //                    var parent = $(seatobj)[0].parentNode;
                    //                    $(parent).html("<span class='base_txtgray'></span><a href='##' class='btn_comm btn_7' onclick='ShowJTP(true)'>捡退票</a>");

                    var imgLoading = document.getElementById("imgBookingLoading");
                    $(imgLoading).unmask();
                    imgLoading.style.display = "none";
                    //提示框
                    $("#pstopstationalert").html("非常抱歉，" + trainNumber + " " + ConvertSeat(bookableSeatIDs) + " 当前已无票，请选择其他车次或坐席。");
                    $("#stopstationalert").mask();
                    UI2.Common.preventDefault(event);
                }
            }
        }

    });

}

var FlightBookCheck = function(a) {
    return __SSO_booking($(a).attr("data"), 1);
}

//预定按钮点击方法
var BookingBtnClick = function (a) {
    var imgLoading = document.getElementById("imgBookingLoading");
    $(imgLoading).unmask();
    imgLoading.style.display = "none";
    //    if (isQuickBooking.trim().toLowerCase() == 'true')
    //        return __SSO_loginShow(a, true, '0', true);
    //    else
    return __SSO_booking(a, 1);
    //        return __SSO_booking(a, 0);
}

//SSO_Booking回调
function __SSO_submit(a, t) {
    var count = a.split('|').length;
    if (a == "help" && count == 1) {
        ChatClickCallBack();
    }
    else if (a.indexOf('DCity1') != -1) {
        FlightBtnClickCallBack(a);
    }
    else if (a.indexOf("bus.") != -1) {
    SubmitBusOrderCallBack(a);
    }
    else if (count < 8) {
        BookingBtnClickCallBack(a);
    }
}

//回调函数
var BookingBtnClickCallBack = function (a) {
    var baseUrl = SITEHOMEPAGE + "/InputPassengers.aspx";

    var a = a.split('|');

    var tid = a[0];
    var did1 = 0;
    var aid1 = 0;
    var fromSPY = a[1];
    var toSPY = a[2];
    var date = a[3];
    var from = searchobj.bookingfrom[0].value.trim();
    var to = searchobj.bookingto[0].value.trim();
    var fromCn = searchobj.fromCn[0].value.trim();
    var toCn = searchobj.toCn[0].value.trim();
    var filter = $("#filter")[0].value.trim();
    var seatid1 = a[6];

    //做兼容（后退，刷新页面）
    if (tid == undefined) {
        return;
    }
    //做兼容处理
    if ($("#flagvalue")[0].value.trim() == "1") {
        $("#flagvalue")[0].value = "0";
        return;
    }
    else {
        $("#flagvalue")[0].value = "1";
    }
    if (UI2.TicketsRange.isRange) {
        from = UI2.TicketsRange.arguments[UI2.TicketsRange.arguments.length - 2];
        to = UI2.TicketsRange.arguments[UI2.TicketsRange.arguments.length - 1];
    }

    var url = baseUrl + "?tickettypeid=0&tid=" + tid + "&did=" + did1 + "&aid=" + aid1 +
        "&date=" + date + "&dname=" + fromCn + "&aname=" + toCn + "&dpy=" + from + "&apy=" + to + "&dspy=" + fromSPY + "&aspy=" + toSPY + "&filter=" + filter + "&number=&seatid=" + seatid1;
    url += "&ab_alternative=123";
    if (UI2.TicketsRange.isRange)
        url += '#ctm_ref=tra_sr_ra_sr_bn_df';
    else
        url += '#ctm_ref=tra_sr_sig_bk_bn_df';
    if (typeof window.$location == "undefined") window.$location = function (url) { if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { var referLink = document.createElement("a"); referLink.href = url; document.body.appendChild(referLink); referLink.click() } else document.location.href = url };
    $location(url);
}

//转换座位类型
var ConvertSeat = function (typeID) {
    var id = parseInt(typeID);
    switch (id) {
        case 224:
            return "硬卧";
        case 225:
            return "软卧";
        case 207:
            return "一等座";
        case 209:
            return "二等座";
        case 201:
            return "硬座";
        case 203:
            return "软座";
        case 227:
            return "无座";
        case 221:
            return "商务座";
        case 205:
            return "特等座";
        case 226:
            return "高级软卧";
        case 301:
            return "一等软座";
        case 302:
            return "二等软座";
        case 303:
            return "一人软包";
        default:
            return "";
    }
}

//机票按钮点击事件
var FlightBtnClickCallBack = function (a) {
    var r = Math.random();
    var a = a.split('|');
    $("#DCity1")[0].value = a[0];
    $("#ACity1")[0].value = a[1];
    if (a[0].trim() == "") {
        return false;
    }
    if (a[1].trim() == "") {
        return false;
    }

    $("#DDate1")[0].value = a[2];
    $("#Flight1")[0].value = a[3];
    $("#Subclass1")[0].value = a[4];
    $("#Price1")[0].value = a[5];
    $("#SaleType1")[0].value = a[6];
    var j = a[7];

    $("#FlightWay")[0].value = "S";

    $("#__VIEWSTATE")[0].value = "";

    var uniondomain = FlightDomian + "Book/Book?r=" + r + "#ctm_ref=tra_sr_rec_sr_bn_" + j + "_0_0";

    document.forms[0].action = uniondomain;
    document.forms[0].method = "POST";
    document.forms[0].submit();
}
var SubmitBusOrder = function (a) {
    return __SSO_booking($(a).attr("data"), 0);
}
//
var SubmitBusOrderCallBack = function (a) {

    if (typeof window.$location == "undefined") window.$location = function (url) { if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { var referLink = document.createElement("a"); referLink.href = url; document.body.appendChild(referLink); referLink.click() } else document.location.href = url };
    $location(a);
}


/*======================================================浮动按钮点击模块=================================================*/
//在线帮助按钮点击事件
var ChatClick = function (a) {
    return __SSO_booking(a, 1);
}

//在线帮助按钮回调事件
var ChatClickCallBack = function () {
    window.open(CHATURL);
}

UI2.TicketsRange = (function () {

    return {
        isRange: false,
        arguments: null,
        trainsName: null,
        elements: {
            imgBookingLoading: document.getElementById("imgBookingLoading"),
            pStopStationAlert: document.getElementById("pstopstationalert"),
            btnStopStationAlert: document.getElementById("btnstopstationalert"),
            stopStationAlert: document.getElementById("stopstationalert"),
            astopStationAlert: document.getElementById("astopstationalert")

        },
        clickedTicketsRange: null,
        btnStopStationAlertClick: function (event) {
            var target = UI2.TicketsRange.clickedTicketsRange;
            if (!!target && !!target.innerHTML.match(/区间票/)) {
                $(UI2.TicketsRange.clickedTicketsRange).addClass("disable");
                $("b", UI2.TicketsRange.clickedTicketsRange).removeClass("icon_hide");
                $("b", UI2.TicketsRange.clickedTicketsRange).addClass("icon_show");
            }
        },
        ajax: {
            getTrainStopover: function (event, paramers, tbodyid) {

                var trainNumber = paramers.match(/(\S*?)(?=\|)/g)[8];
                cQuery.ajax('http://' + location.hostname + "/TrainBooking/Ajax/GetStopStationV22.ashx?type=getTrainStopover&uid=" + uid + "&paramer=" + paramers,
                {
                    onsuccess: function (result) {
                        if (result && result.responseText != "") {
                            var tBody = document.createElement("tbody");
                            var innerHTML = result.responseText.replace(/<tbody.*?>/, '').replace('</tbody>', '');
                            $(tBody).html(innerHTML);

                            //增加filter选择器
                            $(tBody).attr("filter", $(document.getElementById(tbodyid)).attr("filter"));
                            $(tBody).attr("id", $(document.getElementById(tbodyid)).attr("id") + "-QJ");

                            var nextSibling = $(document.getElementById(tbodyid)).nextSibling();
                            if (!!nextSibling
                              && !!nextSibling[0]
                              && !!nextSibling[0].id
                              && !!nextSibling[0].id.match(/stoptbody/))
                                $(tBody).insertAfter(nextSibling);
                            else
                                $(tBody).insertAfter($(document.getElementById(tbodyid)));
                            $("b", UI2.TicketsRange.clickedTicketsRange).removeClass("icon_show");
                            $("b", UI2.TicketsRange.clickedTicketsRange).addClass("icon_hide");
                            UI2.TicketsRange.hiddenModalDialog(1, event);
                            UI2.TicketsRange.clickedTicketsRange.innerHTML += "<i class='zhongtu_arrow'></i>";

                            //                            $("a[id='aTuanHotel'").each(function (e) {
                            //                                e.regMod('jmp', '1.0', { options: { css: { maxWidth: '300', minWidth: '290'}} });
                            //                            });
                            //                            var tagI = document.createElement("i");
                            //                            tagI.setAttribute('class', 'zhongtu_arrow');
                            //                            $(tagI).appendTo($(UI2.TicketsRange.clickedTicketsRange));
                        }
                        else {

                            $(UI2.TicketsRange.elements.pStopStationAlert).html("非常抱歉，" + trainNumber + "  当前已无区间票，请选择其他车次。");
                            UI2.TicketsRange.hiddenModalDialog(1, event);
                            UI2.TicketsRange.showModalDialog(2, event);
                        }

                    }
                });
            }
        },
        registerEvent: function () {
            UI2.Common.bindEvent(UI2.TicketsRange.elements.btnStopStationAlert, "click", UI2.TicketsRange.btnStopStationAlertClick);
            UI2.Common.bindEvent(UI2.TicketsRange.elements.astopStationAlert, "click", UI2.TicketsRange.btnStopStationAlertClick);
        },
        showModalDialog: function (type, event) {
            UI2.Common.preventDefault(event);
            if (parseInt(type, 10) == 1) {
                $("span", UI2.TicketsRange.elements.imgBookingLoading)[0].innerHTML = "正在查询" + UI2.TicketsRange.trainsName + "区间票是否可预订，请稍候...";
                $(UI2.TicketsRange.elements.imgBookingLoading).mask();
                UI2.Common.show(UI2.TicketsRange.elements.imgBookingLoading);
            }
            else if (parseInt(type, 10) == 2) {
                $(UI2.TicketsRange.elements.stopStationAlert).mask();
                UI2.Common.show(UI2.TicketsRange.elements.stopStationAlert);
            }
            else if (parseInt(type, 10) == 3) {//add by pinellia
                $("span", UI2.TicketsRange.elements.imgBookingLoading)[0].innerHTML = "正在查询中转票是否可预订，请稍候...";
                $(UI2.TicketsRange.elements.imgBookingLoading).mask();
                UI2.Common.show(UI2.TicketsRange.elements.imgBookingLoading);
            }
        },
        hiddenModalDialog: function (type, event) {
            UI2.Common.preventDefault(event);
            if (parseInt(type, 10) == 1) {
                $("span", UI2.TicketsRange.elements.imgBookingLoading)[0].innerHTML = '正在验证是否可预订，请稍候...';
                $(UI2.TicketsRange.elements.imgBookingLoading).unmask();
                UI2.Common.hide(UI2.TicketsRange.elements.imgBookingLoading);
            }
            else if (parseInt(type, 10) == 2) {
                $(UI2.TicketsRange.elements.stopStationAlert).unmask();
                UI2.Common.hide(UI2.TicketsRange.elements.stopStationAlert);
            }
            else if (parseInt(type, 10) == 3) {//add by pinellia
                $("span", UI2.TicketsRange.elements.imgBookingLoading)[0].innerHTML = "正在验证是否可预订，请稍候...";
                $(UI2.TicketsRange.elements.imgBookingLoading).unmask();
                UI2.Common.hide(UI2.TicketsRange.elements.imgBookingLoading);
            }
        },
        bookTicketsRange: function (event, paramers, tbodyid) {

            UI2.TicketsRange.trainsName = paramers.split('|')[4];
            var tbody = $("tbody[id='" + tbodyid + "']+tbody");

            if ($("div.jingting_box", tbody[0]).length > 0)
                tbody = $("tbody[id='" + $(tbody).attr('id') + "']+tbody");

            UI2.TicketsRange.clickedTicketsRange = UI2.Common.getEventTarget(event);

            if ($(UI2.Common.getEventTarget(event)).hasClass("disable")) {
                UI2.Common.preventDefault();
                return false;
            }

            if (!!tbody && tbody.length > 0
                && $("tr.zhongtu_alert", tbody[0]).length > 0) {
                if (tbody[0].style.display.trim() != 'none') {
                    tbody[0].style.display = 'none';
                    $("b", UI2.TicketsRange.clickedTicketsRange).removeClass("icon_hide");
                    $("b", UI2.TicketsRange.clickedTicketsRange).addClass("icon_show");
                    $(".zhongtu_arrow", UI2.TicketsRange.clickedTicketsRange).remove();
                }
                else {
                    var tagI = document.createElement("i");
                    $(tagI).addClass("zhongtu_arrow");
                    $(tagI).appendTo($(UI2.TicketsRange.clickedTicketsRange));
                    tbody[0].style.display = '';
                    $("b", UI2.TicketsRange.clickedTicketsRange).removeClass("icon_show");
                    $("b", UI2.TicketsRange.clickedTicketsRange).addClass("icon_hide");
                }
                return false;
            }

            this.showModalDialog(1, event);
            this.ajax.getTrainStopover(event, paramers, tbodyid);
        }
    };
})();

UI2.TicketsRange.registerEvent();


//**************************************中转票***************************************
UI2.HubTicket = (function () {
    return {
        hubTicketClick: function () {
            var hubTicketA = $("#resultTable01 a[hubtype='hubticket']"); //找到中转票数组

            if (!!hubTicketA && hubTicketA.length > 0) {
                hubTicketA.each(function (hta) {
                    $(hta).bind('click', function (e) {//每个A标签绑定点击事件
                        if ($(hta).hasClass('disable')) {//不能用状态
                            return false;
                        }

                        if (!UI2.HubTicket.RequestHubTicket) {
                            //打开中转页面
                            window.open($("#hubTicketAddress").value(), "_blank");
                            return;
                        }

                        UI2.TicketsRange.showModalDialog(3);

                        //异步去请求 看是否有中转票
                        var baseUrlhubstation = window.location.host.replace("www", "trains");
                        var dname = $("#txtCityDep").value().trim();
                        var dpinyin = $("#txtCityFrom").value().trim();
                        var aname = $("#txtCityAri").value().trim();
                        var apinyin = $("#txtCityTo").value().trim();
                        var departuredate = $("#txtDateDep").value().trim();
                        var type = 2;
                        baseUrlhubstation = "http://" + baseUrlhubstation + "/TrainBooking/Ajax/GetHubStation.ashx?dname=" + dname + "&dpinyin=" + dpinyin + "&aname=" + aname + "&apinyin=" + apinyin + "&ddate=" + departuredate + "&type=" + type;

                        cQuery.ajax(baseUrlhubstation,
                        {
                            onsuccess: function (result) {
                                if (result && result.responseText != "" && result.responseText == "YES") {
                                    UI2.TicketsRange.hiddenModalDialog(3);
                                    UI2.HubTicket.RequestHubTicket = false;

                                    //打开页面
                                    window.open($("#hubTicketAddress").value(), "_blank");
                                }
                                else {
                                    $(UI2.TicketsRange.elements.pStopStationAlert).html("非常抱歉，" + dname + "到" + aname + "  当前无中转程票。");
                                    UI2.TicketsRange.hiddenModalDialog(3);
                                    UI2.TicketsRange.showModalDialog(2);

                                    hubTicketA.each(function (a) {
                                        $(a).removeClass();
                                        $(a).addClass("btn_zhongtu disable");
                                        //兼容区间票链接不可点，能点击预订按钮bug
                                        var tbody = $(a).parents('tbody');
                                        tbody = tbody[0]; //取第一个
                                        tbody = tbody.nextSibling;
                                        if ($(tbody).attr("guid") == null || $(tbody).attr("guid") == 'undefined') {
                                            $(tbody).attr("display", "none");
                                        }
                                    })
                                }
                            }
                        });
                    })

                })
            }

        },
        RequestHubTicket: true
    }
})()



//**************************************app推荐***************************************
var checkAppMobile = function (target) {
    var tr = $(target).parentNode()[0];
    var wrongAppMobile = $(tr).find("div[name=wrongAppMobile]");
    if ($(target).value().trim() == '') {
        $(target).value($(target).attr("tooltip"));
        $(target).css("color", "#999");
        if (!$(target).hasClass("input_alert"))
            $(target).addClass("input_alert");
        wrongAppMobile.css("display", "none");
        return false;
    }
    else if ($(target).value().trim() != '') {
        if (!/^1\d{10}$/.test($(target).value().trim())) {
            if ($(target).value().trim() != $(target).attr("tooltip")) {
                $(target).css("color", "#000");
            }
            wrongAppMobile.css("display", "");

            if (!$(target).hasClass("input_alert"))
                $(target).addClass("input_alert");
            return false;
        } else {
            wrongAppMobile.css("display", "none");
            if ($(target).hasClass("input_alert"))
                $(target).removeClass("input_alert");
        }
    }
    return true;
};
var showAppRecommend = function (event) {
    var target = UI2.Common.getEventTarget(event);
    var arrow = $(target).find("b");
    var tr = UI2.Common.next(target.parentNode.parentNode.parentNode);
    if ($(tr).attr("name") == "stopbody") {
        tr = UI2.Common.next(tr);
    }
    if (arrow.hasClass("icon_hide")) {
        arrow.removeClass("icon_hide");
        arrow.addClass("icon_show");
        UI2.Common.hide(tr);
    } else {
        arrow.removeClass("icon_show");
        arrow.addClass("icon_hide");
        tr.style.display = "";
        var btnSendSMS = $(tr).find("a[name=btnSendSMS]");
        var successAppMobile = $(tr).find("div[name=successAppMobile]");
        var failureAppMobile = $(tr).find("div[name=failureAppMobile]");

        if (!btnSendSMS.hasClass("disable")) {
            var afterSeconds = $.pageStorage.get('afterSeconds');
            if (afterSeconds && afterSeconds > 0) {
                UI2.Common.removeEvent(btnSendSMS[0], "click", sendAppSMS);
                btnSendSMS.addClass("disable");
                btnSendSMS.text("(" + afterSeconds + "秒后)重新获取短信");
                var t = setInterval(function () {
                    afterSeconds--;
                    if (afterSeconds > 0) {
                        btnSendSMS.text("(" + afterSeconds + "秒后)重新获取短信");
                        $.pageStorage.set('afterSeconds', afterSeconds);
                    } else {
                        $.pageStorage.set('afterSeconds', 0);
                        btnSendSMS.removeClass("disable");
                        successAppMobile.css("display", "none");
                        $(btnSendSMS).text("免费获取");
                        clearInterval(t);
                        UI2.Common.addEvent(btnSendSMS[0], "click", sendAppSMS);
                    }
                }, 1000);
            }
        }

    }
};

var sendAppSMS = function (event) {
    var target = UI2.Common.getEventTarget(event);
    var tr = $(target).parentNode()[0];
    var appMobileNo = $(tr).find("input[name=txtMobileNo]");
    var successAppMobile = $(tr).find("div[name=successAppMobile]");
    var failureAppMobile = $(tr).find("div[name=failureAppMobile]");
    failureAppMobile.css("display", "none");
    if (!checkAppMobile(appMobileNo))
        return;
    var isSuccess = ajaxSendAppSMS(appMobileNo.value().trim());
    if (isSuccess) {
        successAppMobile.css("display", "");
        var applist = $("#resultTable01").find("tr[name=appTR]");
        for (var i = 0; i < applist.length; i++) {
            if (applist[i].style.display == "") {
                var btnSendSMS = $(applist[i]).find("a[name=btnSendSMS]");
                UI2.Common.removeEvent(btnSendSMS[0], "click", sendAppSMS);
                btnSendSMS.addClass("disable");
                btnSendSMS.text("(" + 60 + "秒后)重新获取短信");
            }
        }
        var second = 59;
        var t = setInterval(function () {
            for (var i = 0; i < applist.length; i++) {
                if (applist[i].style.display == "") {
                    var btnSendSMS = $(applist[i]).find("a[name=btnSendSMS]");
                    if (second > 0) {
                        btnSendSMS.text("(" + second + "秒后)重新获取短信");
                        $.pageStorage.set('afterSeconds', second);
                    } else {
                        $.pageStorage.set('afterSeconds', 0);
                        btnSendSMS.removeClass("disable");
                        successAppMobile.css("display", "none");
                        btnSendSMS.text("免费获取");
                        UI2.Common.addEvent(btnSendSMS[0], "click", sendAppSMS);
                    }
                }
            }
            second--;
            if (second < 0)
                clearInterval(t);
        }, 1000);


    } else {
        failureAppMobile.css("display", "");
    }

};

var ajaxSendAppSMS = function (mobileNo) {
    var isSuccess = false;
    cQuery.ajax($("#locationUrl").value() + '/Ajax/UI2IndexHandler.ashx',
    {
        async: false,
        method: 'POST',
        context: { type: 'sendAppSMS', source: 'list', MobileNo: mobileNo },
        onsuccess: function (result) {
            if (result.responseText == "1") {//验证成功
                isSuccess = true;
            } else {
                isSuccess = false;
            }
        },
        onerror: function (e) {
            isSuccess = false;
        }
    });
    return isSuccess;
};

var inputFocus = function (event) {
    var target = UI2.Common.getEventTarget(event);
    if ($(target).value() == $(target).attr("tooltip")) {
        $(target).value("");
        $(target).css("color", "#000");
    }
};
var inputBlur = function (event) {
    var target = UI2.Common.getEventTarget(event);
    if ($(target).value() == "") {
        $(target).value($(target).attr("tooltip"));
        $(target).css("color", "#999");
    }
};

function ShowFlightTip(sp) {
    var span = sp.nextSibling;
    var br = span.nextSibling;
    var div = br.nextSibling;
    if ($(div).css("display") == "none") {
        $(div).css("display", "block");
    }
    else {
        $(div).css("display", "none");
    }
}

function ShowWoPuTip(sp) {
    var br = sp.nextSibling;
    var div = br.nextSibling;
    if ($(div).css("display") == "none") {
        $(div).css("display", "block");
    }
    else {
        $(div).css("display", "none");
    }
}

function ShowFlight(flag, index) {
    if (flag == 1) {
        $("#flighGengduo").css("display", "none");
        $("#flighShouQi").css("display", "");
        var tr = $("tr[IsFirst='1']");
        //默认显示两条
        for (var i = 0; i < tr.length; i++) {
            var tr_now = tr[i];
            $(tr_now).css("display", "");
            nexttr = next(tr_now);
            if ($(tr_now).attr("class") == 'prop last' || $(tr_now)[0].className == "prop last") {
                $(tr_now).attr("class", "prop");
                //                $(tr_now)[0].className = "prop";//兼容ie
                $(nexttr).css("display", "");
            }
            else {
                $(nexttr).css("display", "");
            }

        }
        //默认隐藏大于两条的
        var array = $("tr[IsFirst='0']");
        for (var i = 0; i < array.length; i++) {
            var tr_now = array[i];
            $(tr_now).css("display", "");
            nexttr = next(tr_now);
            if ($(tr_now).attr("class") != 'prop last' || $(tr_now)[0].className != "prop last") {
                $(nexttr).css("display", "");
            }
            else {
                $(nexttr).css("display", "none");
            }

        }
    }
    else {
        $("#flighShouQi").css("display", "none");
        $("#flighGengduo").css("display", "");
        var tr = $("tr[IsFirst='1']");
        //默认显示两条
        for (var i = 0; i < tr.length; i++) {
            var tr_now = tr[i];
            $(tr_now).css("display", "");
            nexttr = next(tr_now);
            if (i == index) {
                $(tr_now).attr("class", "prop last");
                $(tr_now)[0].className = "prop last"; //兼容ie
                $(nexttr).css("display", "none");
            }
            else {
                $(nexttr).css("display", "");
            }

        }
        //默认隐藏大于两条的
        var array = $("tr[IsFirst='0']");
        for (var i = 0; i < array.length; i++) {
            var tr_now = array[i];
            $(tr_now).css("display", "none");
            nexttr = next(tr_now);
            $(nexttr).css("display", "none");

        }
    }

}

function next(el) {
    var nxt = el.nextElementSibling || el.nextSibling;
    while (nxt && nxt.nodeType != 1) {
        nxt = nxt.nextSibling;
    }
    return nxt;
}

//显示隐藏预售期外的提示
function ShowYSQWTip(sp, flag) {
    var divP = $(sp)[0].parentNode;
    var div = divP.nextSibling;
    if (flag) {
        $(div).css("display", "block");
    }
    else {
        $(div).css("display", "none");
    }
}

//显示隐藏抢票链接
function ShowQPUrl(flag) {
    if (flag) {
        $("#divQP").mask();
        UI2.Common.preventDefault();
    }
    else {
        $("#divQP").unmask();
        //        UI2.Common.preventDefault();
    }
}

//tab切换
var Change = function (a, type) {
    $(".guangjiu_tab").find("a").each(function (a) { a.attr("class", "") });
    $(".guangjiu_cont").each(function (div) { div.css("display", "none") });
    $(a).attr("class", "cur");
    $("#div" + type).css("display", "")
}

//显示隐藏捡退票链接
function ShowJTP(flag) {
    if (flag) {
        $("#divJTP").mask();
        UI2.Common.preventDefault();
    }
    else {
        $("#divJTP").unmask();
    }
}

//list预订后面加订往返按钮
function GoHubRound(a) {
    searchobj.selTravelType.value(1);
    SearchButtonClick(a);
}