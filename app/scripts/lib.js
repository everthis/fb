function format(data) {
    var obj = {};
    for (var key in data) {
        obj[key] = {};
        if (key.search(/[A-Z]/i) != -1) {
            for (var i = 0; i < data[key].length; i++) {
                var groupBy = data[key][i]['data'].split('|')[2].substr(0, 1).toUpperCase();
                if (obj[key][groupBy]) {
                    obj[key][groupBy].push(data[key][i]);
                } else {
                    obj[key][groupBy] = [];
                    obj[key][groupBy].push(data[key][i]);
                }
            }
        } else {
            for (var i = 0; i < data[key].length; i++) {
                if (obj[key]['']) {
                    obj[key][''].push(data[key][i]);
                } else {
                    obj[key][''] = [];
                    obj[key][''].push(data[key][i]);
                }
            }
        }
    }
    return obj;
}
function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
var UI2 = {};
UI2.Common = {
    inArray: function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val)
                return true;
        }
        return false;
    },
    isDigit: function (value) {

    },
    extend: function (o, n, override) {
        for (var p in n)
            if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
                o[p] = n[p];
    },
    scrollTop: function () {
        var scrollTop;
        if (typeof window.pageYOffset != 'undefined')
            scrollTop = window.pageYOffset;
        else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat')
            scrollTop = document.documentElement.scrollTop;
        else if (typeof document.body != 'undefined')
            scrollTop = document.body.scrollTop;
        return scrollTop;
    },
    getElementTop: function (element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    },
    getElementLeft: function (element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    },
    getEventTarget: function (event) {
        return ((window.event || event).srcElement ||

        (window.event || event).target);
    },
    createElement: function (name, innerHTML, css) {
        var element = document.createElement(name);
        element.innerHTML = innerHTML;
        if (css) {
            var styles = css.split(',');
            for (var i = 0; i < styles.length; i++) {
                var style = styles[i].split(':');
                $(element).css(style[0], style[1]);
            }
        }
        return element;
    },
    bindEvent: function (element, event, handler) {
        $(element).bind(event, handler);
    },
    addEvent: function (oTarget, sEventType, fnHandler) {
        if (!oTarget) return;
        oTarget.listeners = oTarget.listeners || {};
        var listeners = oTarget.listeners[sEventType] = oTarget.listeners[sEventType] || [];
        listeners.push(fnHandler);
        if (!listeners["_handler"]) {
            listeners["_handler"] = function (e) {
                var e = e || window.event;
                for (var i = 0,
				fn; fn = listeners[i++]; ) {
                    if (fn.call(oTarget, e) === false) {
                        e.preventDefault ? e.stopPropagation() : e.cancelBubble = true;
                        e.preventDefault ? e.preventDefault() : e.returnValue = false;
                        return false;
                    }
                }
            }
            oTarget.addEventListener ? oTarget.addEventListener(sEventType, listeners["_handler"], false) : oTarget.attachEvent('on' + sEventType, listeners["_handler"]);
        }
    },
    removeEvent: function (oTarget, sEventType, fnHandler) {
        if (oTarget.listeners && oTarget.listeners[sEventType]) {
            var listeners = oTarget.listeners[sEventType];
            for (var i = listeners.length - 1; i >= 0 && fnHandler; i--) {
                if (listeners[i] == fnHandler) {
                    listeners.splice(i, 1);
                }
            }
            if ((!listeners.length || !fnHandler) && listeners["_handler"]) {
                oTarget.removeEventListener ? oTarget.removeEventListener(sEventType, listeners["_handler"], false) : oTarget.detachEvent('on' + sEventType, listeners["_handler"]);
                delete oTarget.listeners[sEventType];
            }
        }
    },
    isChildOf: function (parentEl, el, container) {
        if (parentEl == el) {
            return true;
        }
        if (parentEl.contains) {
            return parentEl.contains(el);
        }
        if (parentEl.compareDocumentPosition) {
            return !!(parentEl.compareDocumentPosition(el) & 16);
        }
        var prEl = el.parentNode;
        while (prEl && prEl != container) {
            if (prEl == parentEl)
                return true;
            prEl = prEl.parentNode;
        }
        return false;
    },
    show: function (element) {
        element.style.display = "block";
    },
    hide: function (element) {
        element.style.display = "none";
    },
    array: {
        filter: function (arr) {

        },
        firstOrDefault: function (arr, propertyName, propertyValue) {

        }
    },
    next: function (el) {
        var nxt = el.nextElementSibling || el.nextSibling;
        while (nxt && nxt.nodeType != 1) {
            nxt = nxt.nextSibling;
        }
        return nxt;
    },
    preventDefault: function (event) {
        try {
            if (cQuery.browser.isIE)
                window.event.returnValue = false;
            else
                (window.event || arguments[0]).preventDefault();
        }
        catch (e) {
        }
    },
    isRunYear: function (year) {
        year = parseInt(year, 10);
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return true;
        }
        else {
            return false;
        }
    },
    monthMaxDate: function (year, month) {
        switch (month) {
            case "1":
            case "3":
            case "5":
            case "7":
            case "8":
            case "10":
            case "12":
                return 31;
            case "2":
                return UI2.Common.isRunYear(year) ? 29 : 28;
            case "4":
            case "6":
            case "9":
            case "11":
                return 30;
            default:
                return 0;
        }
    },
    bubbleSort: function (arr, isDesc) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i; j < arr.length; j++) {
                if ((isDesc && parseInt(arr[i].id, 10) < parseInt(arr[j].id, 10))
                || (!isDesc && parseInt(arr[i].id, 10) > parseInt(arr[j].id, 10))) {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    },
    //    checkWindowClosed: function (type) {
    //        //        if (confirm("离开页面后，是否要参与网上小调查?")) {
    //        //            var newWindow,
    //        //                url = parseInt(type, 10) == 1 ? 'http://www.ctrip.com/QSYS/Online/OnlineQsysQurvey.asp?SurveyID=977f9021-62b8-49d1-a134-b27370cfaee8&Review=&language=C'
    //        //                                              : 'http://www.ctrip.com/QSYS/Online/OnlineQsysQurvey.asp?SurveyID=0d93f383-f2f5-4c12-b70d-d633943b6dde&Review=&language=C';
    //        //            newWindow = window.open(url, '问卷', 'width=1000,height=500,top=0,left=0,scrollbars=yes');
    //        //            newWindow.opener = null;
    //        //            window.close();

    //        //        }
    //    },

    //        }
    //    },
    grep: function (elems, callback, inv) {
        var retVal,
			ret = [],
			i = 0,
			length = elems.length;
        inv = !!inv;

        // Go through the array, only saving the items
        // that pass the validator function
        for (; i < length; i++) {
            retVal = !!callback(elems[i], i);
            if (inv !== retVal) {
                ret.push(elems[i]);
            }
        }

        return ret;
    },
    init: function () {
        Array.prototype.indexOf = function (val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) return i;
            }
            return -1;
        };
        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        Array.prototype.select = function (args) {
            var newItems = [];
            if (typeof (args) === "object" && arguments.length === 1) {//传入查询的参数为对象时的处理方式
                for (vari = 0, imax = this.length; i < imax; i++) {
                    varitem = {};
                    for (var key in args) {
                        if (args[key] !== undefined) {
                            item[key] = this[i][key] === undefined ? "undefined" : this[i][key];
                        }
                    }
                    newItems.push(item);
                }
            }
            else if (typeof (args) === "string" && arguments.length === 1) {//传入参数为字符串，且只有一个参数的处理方式
                for (vari = 0, imax = this.length; i < imax; i++) {
                    varitem = {};
                    varkeys = args.split(',');
                    for (vark = 0, kmax = keys.length; k < kmax; k++) {
                        variKey = keys[k].split("as");
                        if (iKey.length === 1) {
                            item[iKey[0].trim()] = this[i][iKey[0].trim()] === undefined ? "undefined" : this[i][iKey[0].trim()];
                        } else {
                            item[iKey[1].trim()] = this[i][iKey[0].trim()] === undefined ? "undefined" : this[i][iKey[0].trim()];
                        }
                    }
                    newItems.push(item);
                }
            }
            else {
                for (vari = 0, imax = this.length; i < imax; i++) {
                    varitem = {};
                    for (varj = 0, jmax = arguments.length; j < jmax; j++) {
                        if (arguments[j] !== undefined) {
                            variKey = arguments[j].split("as");
                            if (iKey.length === 1) {
                                item[iKey[0].trim()] = this[i][iKey[0].trim()] === undefined ? "undefined" : this[i][iKey[0].trim()];
                            } else {
                                item[iKey[1].trim()] = this[i][iKey[0].trim()] === undefined ? "undefined" : this[i][iKey[0].trim()];
                            }
                        }
                    }
                    newItems.push(item);
                }
            }
            returnnewItems;
        };
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
        Array.prototype.contain = function (obj) {
            for (var i = 0; i < this.length; i++) {
                var equal = true;

                for (var c = 0; c < this[i].length; c++)
                    if (this[i][c] != obj[c])
                        equal = false;

                if (equal)
                    return true;
            }
            return false;
        };
        Array.prototype.clear = function () {
            this.length = 0;
        }
    },
    getBirthdatByIdNo: function (iIdNo) {
        var tmpStr = "";
        var idDate = "";
        var tmpInt = 0;
        var strReturn = "";

        iIdNo = iIdNo.trim();

        if ((iIdNo.length != 15) && (iIdNo.length != 18)) {
            strReturn = "输入的身份证号位数错误";
            return strReturn;
        }

        if (iIdNo.length == 15) {
            tmpStr = iIdNo.substring(6, 12);
            tmpStr = "19" + tmpStr;
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)

            return tmpStr;
        }
        else {
            tmpStr = iIdNo.substring(6, 14);
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)

            return tmpStr;
        }
    },
    setCookie: function (name, value, time) {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);
        else return null;
    },
    appendSeo: function (seoACityName, seoACityEName, travel, strategy, ticket, hotel) {
        for (var i = 0; i < tooldatas.length; i++) {
            if (tooldatas[i].cityName == seoACityName) {
                var spotID = tooldatas[i].spotUrl.match(/\d+/gi);
                var hotelID = tooldatas[i].hotelID;
                if (!!spotID) {
                    var travle = document.getElementById(travel);
                    travle.innerHTML = tooldatas[i].cityName + "旅游";
                    travle.href = 'http://vacations.ctrip.com/tours/d-' + seoACityEName.toLowerCase() + '-' + spotID + '/';
                    var strategy = document.getElementById(strategy);
                    strategy.innerHTML = tooldatas[i].cityName + "旅游攻略";
                    strategy.href = "http://you.ctrip.com/place/" + seoACityEName + spotID + ".html";
                    var ticket = document.getElementById(ticket);
                    ticket.innerHTML = tooldatas[i].cityName + "景点门票";
                    ticket.href = "http://piao.ctrip.com/dest/d-" + seoACityEName + "-" + spotID + "/s-tickets/";

                    var ticket = document.getElementById("schedule");
                    ticket.innerHTML = tooldatas[i].cityName + "线路推荐";
                    ticket.href = "http://you.ctrip.com/journeys/" + seoACityEName + spotID + ".html";
                }
                if (hotelID) {
                    var hotel = document.getElementById(hotel);
                    hotel.innerHTML = tooldatas[i].cityName + "酒店";
                    hotel.href = "http://hotels.ctrip.com/hotel/" + seoACityEName + hotelID + '/';
                }
                break;
            }
        }
    },
    regAddress: function (input, name, hidden, jsonFilterUrl, tagHistory) {
        var noticeAddress = $(input).regMod('address', '1.0', {
            name: name,
            jsonpSource: jsonFilterUrl,
            sort: ['^0$', '^1$', '^3+$', '^0', '^1', '^3+'],
            message: {
                suggestion: '请从下列城市选择'
            },
            relate: {
                'name_py1': hidden
            },
            isFocusNext: true,
            isAutoCorrect: true,
            template: {
                suggestion: '{{if (data = format(data))}}{{/if}}' +
             '<div class="city_select_lhsl">' +
             '<p class="title"><a class="close" href="javascript:;">×</a>支持中文/拼音/简拼输入</p>' +

(!!tagHistory ? (
		 '<p class="sarch_history_title">搜索历史</p>' +
		 '<div class="search_history_box">'
          + tagHistory +
		 '</div>') : '') +

         '<ul class="tab_box">{{enum(key) data}}<li><span>${key}</span></li>{{/enum}}</ul>' +
         '{{enum(key,objs) data}}' +
                '<div class="city_item">' +
				    '{{enum(k,arr) objs}}' +
				    '<div class="city_item_in">' +
					    '<span class="city_item_letter">${k}</span>' +
                        '{{each(index, item) arr}}<a href="javascript:void(0);" data="${item.data}">${item.display}</a>{{/each}}' +
				    '</div>' +
				    '{{/enum}}' +
                '</div>' +
         '{{/enum}}' +
        '</div>',

                suggestionStyle: '.city_select_lhsl{width:408px;padding:10px;border:1px solid #999;background-color:#fff;}' +
		'.city_select_lhsl .close{float:right;width:20px;height:20px;color:#666;text-align:center;font:bold 16px/20px Simsun;}' +
		'.city_select_lhsl .close:hover{text-decoration:none;color:#FFA800;}' +
		'.city_select_lhsl .title{margin-bottom:10px;color:#999;}' +
		'.city_select_lhsl .tab_box{width:100%;height:22px;margin-bottom:6px;margin-top:0;border-bottom:2px solid #ccc;}' +
		'.city_select_lhsl .tab_box li{position:relative;float:left;display:inline;margin-right:2px;line-height:22px;cursor:pointer;}' +
		'.city_select_lhsl .tab_box li b{display:none;}' +
		'.city_select_lhsl .tab_box li span{padding:0 8px;}' +
		'.city_select_lhsl .tab_box .hot_selected{border-bottom:2px solid #06c;margin-bottom:-2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .tab_box .hot_selected b{position:absolute;top:23px;left:50%;display:block;width:0;height:0;margin-left:-5px;overflow:hidden;font-size:0;line-height:0;border-color:#06c transparent transparent transparent;border-style:solid dashed dashed dashed;border-width:5px;}' +
		'.city_select_lhsl .city_item, .city_select_lhsl .search_history_box {display:inline-block;*zoom:1;overflow:hidden;}' +
		'.city_select_lhsl .city_item{width:408px;}' +
		'.city_select_lhsl .city_item a, .city_select_lhsl .search_history_box a {float:left;display:inline;width:52px;height:22px;margin:0 2px 2px 0;padding-left:8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:22px;color:#333;}' +
		'.city_select_lhsl .city_item a:hover,.city_select_lhsl .search_history_box a:hover{background-color:#2577E3;text-decoration:none;color:#fff;}' +
		'.city_item .city_item_in{width:378px;padding-left:30px;*zoom:1;}' +
		'.city_item .city_item_in:after,.city_select_lhsl .search_history_box:after{display:block;height:0;visibility:hidden;overflow:hidden;content:".";clear:both;}' +
		'.city_item .city_item_letter{float:left;width:30px;height:22px;margin-left:-30px;line-height:22px;text-align:center;color:#E56700;}' +
		'.city_select_lhsl .sarch_history_title{margin-bottom:2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .search_history_box{margin-bottom:6px;}',

                suggestionInit: function (el) {
                    //                MOD.defaultSuggestionInit(el); //初始化TAB
                    suggestInit(el);
                }
            }
        });
        function suggestInit(a) {
            $(".tab_box li", a[0]).bind("mousedown", function () {
                $(".tab_box li", a[0]).removeClass("hot_selected");
                $(this).addClass("hot_selected");
                $(".city_item", a[0]).css("display", "none");
                var keywords = $("span", $(this)[0])[0].innerHTML;
                if (keywords.trim() == '热门') {
                    $(".city_item:eq(0)", a[0]).css("display", "");
                }
                else {
                    $(".city_item").each(function (c) {
                        var letter = $(".city_item_letter", c[0])[0].innerHTML;
                        if (letter != '' && keywords.indexOf(letter) > -1) {
                            $(c).css("display", "");
                        }
                    });
                }
            });
            $(".search_history_box a", a[0]).bind("mousedown", function () {
                $(input).value(this.innerHTML);
                noticeAddress.method("hidden");
            });
            $(".title .close", a[0]).bind("mousedown", function () {
                noticeAddress.method("hidden");
            });
            $(".tab_box li:eq(0)", a[0]).trigger("mousedown");
        };

        return noticeAddress;
    },
    regAddressNew: function (input, name, hiddenCode, hiddenName) {
        var noticeAddress = $(input).regMod('address', '1.0', {
            name: name,
            jsonpFilter: "http://rails.ctrip.com/international/Ajax/PTPCityHandler.ashx?value={\"key\":\"${key}\",\"type\":\"3\"}",
            relate: {
                1: $(hiddenName),
                2: $(hiddenCode)
            },
            isAutoCorrect: true,
            source: {
                suggestion: {
                    "热门": [{ display: "巴黎", data: "Paris|巴黎|FRPAR" }, { display: "法兰克福", data: "Frankfurt|法兰克福|DEFRA" }, { display: "罗马", data: "Rome|罗马|ITRMA" }, { display: "苏黎世", data: "Zurich|苏黎世|CHZRH" }, { display: "米兰", data: "Milano|米兰|ITMIL" }, { display: "布鲁塞尔", data: "Brussel|布鲁塞尔|BEBRU" }, { display: "威尼斯", data: "Venezia|威尼斯|ITVCE" }, { display: "幕尼黑", data: "Mucich|幕尼黑|DEMUC" }, { display: "马德里", data: "Madrid|马德里|ESMAD" }, { display: "巴塞罗那", data: "Barcelona|巴塞罗那|ESBCN" }, { display: "维也纳", data: "Vienna|维也纳|ATVIE" }, { display: "布达佩斯", data: "Budapest|布达佩斯|HUBUD" }, { display: "佛罗伦萨", data: "Florence|佛罗伦萨|ITFLR" }, { display: "阿姆斯特丹", data: "Amsterdam|阿姆斯特丹|NLAMS" }, { display: "柏林", data: "Berlin|柏林|DEBHX" }, { display: "琉森", data: "LUCERNE|琉森|CHQLJ"}]
                },
                alias: ['pinyin', 'cityName', 'cityId']
            },
            message: {
                suggestion: '支持中文/英文/拼音'
            },
            template: {
                suggestion: '\
            <div class="c_address_box">\
                <div class="c_address_hd">${message.suggestion}</div>\
                <div class="c_address_bd">\
                    <ol class="c_address_ol">\
                        {{enum(key) data}}\
                            <li><span>${key}</span></li>\
                        {{/enum}}\
                    </ol>\
                    {{enum(key,arr) data}}\
                        <ul class="c_address_ul layoutfix">\
                            {{each arr}}\
                                <li><a data="${data}" href="javascript:void(0);">${display}</a></li>\
                            {{/each}}\
                        </ul>\
                    {{/enum}}\
                </div>\
            </div>\
        ',
                suggestionStyle: '\
            .c_address_box { width:320px;padding:10px;border:1px solid #999;background-color:#fff; }\
            .c_address_box a { text-decoration: none; }\
            .c_address_hd { margin-bottom:10px;color:#999;}\
            .c_address_hd strong{color:#fff;}\
            .c_address_bd { overflow: hidden; padding:10px; }\
            .c_address_ol { margin:0; padding:0 0 20px; border-bottom: 1px solid #5DA9E2; }\
            .c_address_ol li { color: #005DAA; cursor: pointer; float: left; height: 20px; line-height: 20px; list-style-type: none; text-align: center; }\
            .c_address_ol li span { padding:0 8px; white-space:nowrap; display:block; }\
            .c_address_ol li .hot_selected { display:block; padding:0 7px; background-color: #FFFFFF; border-color: #5DA9E2; border-style: solid; border-width: 1px 1px 0; color: #000000; font-weight: bold; }\
            .c_address_ul { width: 100%; margin:0; padding: 4px 0 0; }\
            .c_address_ul li { float: left; height: 24px; overflow: hidden; width: 67px; }\
            .c_address_ul li a { display: block; height: 22px;  border: 1px solid #FFFFFF; color: #1148A8; line-height: 22px; padding-left: 5px; }\
            .c_address_ul li a:hover { background-color:#2577E3;text-decoration:none;color:#fff; }\
        '
            }
        });

        $(input).bind("keydown",
                    function () {
                        $(hiddenCode).value("");
                        $(hiddenName).value("");
                    });
        $(input).bind("blur",
                    function () {
                        if ($(hiddenCode).value() == "")
                            $(input).value("");
                    });

        return noticeAddress;
    },
    regAddressInternet: function (input, name, hidden) {
        var noticeAddress = $(input).regMod('address', '1.0', {
            name: name,
            jsonpFilter: "http://rails.ctrip.com/international/Ajax/PTPCityHandler.ashx?value={\"key\":\"${key}\",\"type\":\"3\"}",
            source: {
                suggestion: {
                    "热门": [{ display: "巴黎", data: "Paris|巴黎|FRPAR" }, { display: "法兰克福", data: "Frankfurt|法兰克福|DEFRA" }, { display: "罗马", data: "Rome|罗马|ITRMA" }, { display: "苏黎世", data: "Zurich|苏黎世|CHZRH" }, { display: "米兰", data: "Milano|米兰|ITMIL" }, { display: "布鲁塞尔", data: "Brussel|布鲁塞尔|BEBRU" }, { display: "威尼斯", data: "Venezia|威尼斯|ITVCE" }, { display: "幕尼黑", data: "Mucich|幕尼黑|DEMUC" }, { display: "马德里", data: "Madrid|马德里|ESMAD" }, { display: "巴塞罗那", data: "Barcelona|巴塞罗那|ESBCN" }, { display: "维也纳", data: "Vienna|维也纳|ATVIE" }, { display: "布达佩斯", data: "Budapest|布达佩斯|HUBUD" }, { display: "佛罗伦萨", data: "Florence|佛罗伦萨|ITFLR" }, { display: "阿姆斯特丹", data: "Amsterdam|阿姆斯特丹|NLAMS" }, { display: "柏林", data: "Berlin|柏林|DEBHX" }, { display: "琉森", data: "LUCERNE|琉森|CHQLJ"}]
                },
                alias: ['pinyin', 'cityName', 'cityId']
            },
            message: {
                suggestion: '请从下列城市选择'
            },
            relate: {
                'cityId': hidden
            },
            isFocusNext: true,
            isAutoCorrect: true,
            template: {
                suggestion: '{{if (data = format(data))}}{{/if}}' +
             '<div class="city_select_lhsl">' +
             '<p class="title"><a class="close" href="javascript:;">×</a>支持中文/英文</p>' +
             '<ul class="tab_box">{{enum(key) data}}<li><span>${key}</span></li>{{/enum}}</ul>' +
             '{{enum(key,objs) data}}' +
                    '<div class="city_item">' +
				        '{{enum(k,arr) objs}}' +
				        '<div class="city_item_in">' +
					        '<span class="city_item_letter">${k}</span>' +
                            '{{each(index, item) arr}}<a href="javascript:void(0);" data="${item.data}">${item.display}</a>{{/each}}' +
				        '</div>' +
				        '{{/enum}}' +
                    '</div>' +
             '{{/enum}}' +
            '</div>',

                suggestionStyle: '.city_select_lhsl{width:408px;padding:10px;border:1px solid #999;background-color:#fff;}' +
		'.city_select_lhsl .close{float:right;width:20px;height:20px;color:#666;text-align:center;font:bold 16px/20px Simsun;}' +
		'.city_select_lhsl .close:hover{text-decoration:none;color:#FFA800;}' +
		'.city_select_lhsl .title{margin-bottom:10px;color:#999;}' +
		'.city_select_lhsl .tab_box{width:100%;height:22px;margin-bottom:6px;margin-top:0;border-bottom:2px solid #ccc;}' +
		'.city_select_lhsl .tab_box li{position:relative;float:left;display:inline;margin-right:2px;line-height:22px;cursor:pointer;}' +
		'.city_select_lhsl .tab_box li b{display:none;}' +
		'.city_select_lhsl .tab_box li span{padding:0 8px;}' +
		'.city_select_lhsl .tab_box .hot_selected{border-bottom:2px solid #06c;margin-bottom:-2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .tab_box .hot_selected b{position:absolute;top:23px;left:50%;display:block;width:0;height:0;margin-left:-5px;overflow:hidden;font-size:0;line-height:0;border-color:#06c transparent transparent transparent;border-style:solid dashed dashed dashed;border-width:5px;}' +
		'.city_select_lhsl .city_item, .city_select_lhsl .search_history_box {display:inline-block;*zoom:1;overflow:hidden;}' +
		'.city_select_lhsl .city_item{width:408px;}' +
		'.city_select_lhsl .city_item a, .city_select_lhsl .search_history_box a {float:left;display:inline;width:52px;height:22px;margin:0 2px 2px 0;padding-left:8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:22px;color:#333;}' +
		'.city_select_lhsl .city_item a:hover,.city_select_lhsl .search_history_box a:hover{background-color:#2577E3;text-decoration:none;color:#fff;}' +
		'.city_item .city_item_in{width:378px;padding-left:30px;*zoom:1;}' +
		'.city_item .city_item_in:after,.city_select_lhsl .search_history_box:after{display:block;height:0;visibility:hidden;overflow:hidden;content:".";clear:both;}' +
		'.city_item .city_item_letter{float:left;width:30px;height:22px;margin-left:-30px;line-height:22px;text-align:center;color:#E56700;}' +
		'.city_select_lhsl .sarch_history_title{margin-bottom:2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .search_history_box{margin-bottom:6px;}',

                suggestionInit: function (el) {
                    suggestInit(el);
                },
                suggestionInitIpad: function (el) {
                    $(".CQ_suggestionTabContainer", el[0]).css("min-width", "500px");
                }

            }
        });
        function suggestInit(a) {
            $(".tab_box li", a[0]).bind("mousedown", function () {
                $(".tab_box li", a[0]).removeClass("hot_selected");
                $(this).addClass("hot_selected");
                $(".city_item", a[0]).css("display", "none");
                var keywords = $("span", $(this)[0])[0].innerHTML;
                if (keywords.trim() == '热门') {
                    $(".city_item:eq(0)", a[0]).css("display", "");
                }
                else {
                    $(".city_item").each(function (c) {
                        var letter = $(".city_item_letter", c[0])[0].innerHTML;
                        if (letter != '' && keywords.indexOf(letter) > -1) {
                            $(c).css("display", "");
                        }
                    });
                }
            });
            $(".search_history_box a", a[0]).bind("mousedown", function () {
                $(input).value(this.innerHTML);
                noticeAddress.method("hidden");
            });
            $(".title .close", a[0]).bind("mousedown", function () {
                noticeAddress.method("hidden");
            });
            $(".tab_box li:eq(0)", a[0]).trigger("mousedown");
        };

        return noticeAddress;
    },
    regAddressInternetCountry: function (input, name, hidden) {
        var noticeAddress = $(input).regMod('address', '1.0', {
            name: name,
            jsonpFilter: "http://rails.ctrip.com/international/Ajax/PassCountrySelector.ashx?Action=GetPassCountrySelector&value={\"key\":\"${key}\",\"type\":\"5\"}",
            jsonpSource: "http://rails.ctrip.com/international/Ajax/PassCountrySelector.ashx?Action=HotCountry",
            message: {
                suggestion: '请从下列国家选择'
            },
            relate: {
                4: hidden
            },
            isAutoCorrect: !0,
            isFocusNext: true,
            template: {
                suggestion: '\
            <div class="c_address_box">\
                <div class="c_address_hd">${message.suggestion}</div>\
                <div class="c_address_bd">\
                    <ol class="c_address_ol">\
                        {{enum(key) data}}\
                            <li><span>${key}</span></li>\
                        {{/enum}}\
                    </ol>\
                    {{enum(key,arr) data}}\
                        <ul class="c_address_ul layoutfix">\
                            {{each arr}}\
                                <li><a data="${data}" href="javascript:void(0);">${display}</a></li>\
                            {{/each}}\
                        </ul>\
                    {{/enum}}\
                </div>\
            </div>\
        ',
                suggestionStyle: '\
            .c_address_box { width:320px;padding:10px;border:1px solid #999;background-color:#fff; }\
            .c_address_box a { text-decoration: none; }\
            .c_address_hd { margin-bottom:10px;color:#999;}\
            .c_address_hd strong{color:#fff;}\
            .c_address_bd { overflow: hidden; padding:10px; }\
            .c_address_ol { margin:0; padding:0 0 20px; border-bottom: 1px solid #5DA9E2; }\
            .c_address_ol li { color: #005DAA; cursor: pointer; float: left; height: 20px; line-height: 20px; list-style-type: none; text-align: center; }\
            .c_address_ol li span { padding:0 8px; white-space:nowrap; display:block; }\
            .c_address_ol li .hot_selected { display:block; padding:0 7px; background-color: #FFFFFF; border-color: #5DA9E2; border-style: solid; border-width: 1px 1px 0; color: #000000; font-weight: bold; }\
            .c_address_ul { width: 100%; margin:0; padding: 4px 0 0; }\
            .c_address_ul li { float: left; height: 24px; overflow: hidden; width: 67px; }\
            .c_address_ul li a { display: block; height: 22px;  border: 1px solid #FFFFFF; color: #1148A8; line-height: 22px; padding-left: 5px; }\
            .c_address_ul li a:hover { background-color:#2577E3;text-decoration:none;color:#fff; }\
        '
            }
        });
        $(input).bind("keydown",
                    function () {
                        $(hidden).value("");
                    });
        $(input).bind("blur",
                    function () {
                        if ($(hidden).value() == "")
                            $(input).value("");
                    });
        noticeAddress.method('bind', 'change', function (e, data) {
            if (data && data.items && data.items.length > 4) {
                $(input).value(data.items[1]);
                $(hidden).value = (data.items[4]);
            }
            else {
                $(hidden).value = "";
            }
        });

        return noticeAddress;
    },
    regAddressHub: function (input, name, hidden, jsonFilterUrl, pageid) {//add by pinellia 20140310 For HubTicket
        var noticeAddressHub = {};
        var Page_id = pageid;
        var noticeAddress = $(input).regMod('address', '1.0', {
            name: name,
            jsonpSource: jsonFilterUrl,
            sort: ['^0$', '^1$', '^3+$', '^0', '^1', '^3+'],
            message: {
                suggestion: '请从下列城市选择'
            },
            relate: {
                'name_py1': hidden
            },
            isFocusNext: true,
            isAutoCorrect: true,
            template: {
                suggestion: '{{if (data = format(data))}}{{/if}}' +
             '<div class="city_select_lhsl">' +
             '<p class="title"><a class="close" href="javascript:;">×</a>支持中文/拼音/简拼输入</p>' +
		     '<p class="sarch_history_title">正在查询中转站，请稍等...</p>' +
		     '<div class="search_history_box">' +
		     '</div>' +
         '<ul class="tab_box">{{enum(key) data}}<li><span>${key}</span></li>{{/enum}}</ul>' +
         '{{enum(key,objs) data}}' +
                '<div class="city_item">' +
				    '{{enum(k,arr) objs}}' +
				    '<div class="city_item_in">' +
					    '<span class="city_item_letter">${k}</span>' +
                        '{{each(index, item) arr}}<a href="javascript:void(0);" data="${item.data}">${item.display}</a>{{/each}}' +
				    '</div>' +
				    '{{/enum}}' +
                '</div>' +
         '{{/enum}}' +
        '</div>',

                suggestionStyle: '.city_select_lhsl{width:408px;padding:10px;border:1px solid #999;background-color:#fff;}' +
		'.city_select_lhsl .close{float:right;width:20px;height:20px;color:#666;text-align:center;font:bold 16px/20px Simsun;}' +
		'.city_select_lhsl .close:hover{text-decoration:none;color:#FFA800;}' +
		'.city_select_lhsl .title{margin-bottom:10px;color:#999;}' +
		'.city_select_lhsl .tab_box{width:100%;height:22px;margin-bottom:6px;margin-top:0;border-bottom:2px solid #ccc;}' +
		'.city_select_lhsl .tab_box li{position:relative;float:left;display:inline;margin-right:2px;line-height:22px;cursor:pointer;}' +
		'.city_select_lhsl .tab_box li b{display:none;}' +
		'.city_select_lhsl .tab_box li span{padding:0 8px;}' +
		'.city_select_lhsl .tab_box .hot_selected{border-bottom:2px solid #06c;margin-bottom:-2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .tab_box .hot_selected b{position:absolute;top:23px;left:50%;display:block;width:0;height:0;margin-left:-5px;overflow:hidden;font-size:0;line-height:0;border-color:#06c transparent transparent transparent;border-style:solid dashed dashed dashed;border-width:5px;}' +
		'.city_select_lhsl .city_item, .city_select_lhsl .search_history_box {display:inline-block;*zoom:1;overflow:hidden;}' +
		'.city_select_lhsl .city_item{width:408px;}' +
		'.city_select_lhsl .city_item a, .city_select_lhsl .search_history_box a {float:left;display:inline;width:52px;height:22px;margin:0 2px 2px 0;padding-left:8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:22px;color:#333;}' +
		'.city_select_lhsl .city_item a:hover,.city_select_lhsl .search_history_box a:hover{background-color:#2577E3;text-decoration:none;color:#fff;}' +
		'.city_item .city_item_in{width:378px;padding-left:30px;*zoom:1;}' +
		'.city_item .city_item_in:after,.city_select_lhsl .search_history_box:after{display:block;height:0;visibility:hidden;overflow:hidden;content:".";clear:both;}' +
		'.city_item .city_item_letter{float:left;width:30px;height:22px;margin-left:-30px;line-height:22px;text-align:center;color:#E56700;}' +
		'.city_select_lhsl .sarch_history_title{margin-bottom:2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .search_history_box{margin-bottom:6px;}',

                suggestionInit: function (el) {
                    //                MOD.defaultSuggestionInit(el); //初始化TAB
                    suggestInit(el);
                    GetHubCityDataInit(Page_id); //第一次点击 拉取中转数据
                },

                suggestionIpad: '{{if ($data.data = format($data.data))}}{{/if}}' +
             '<div class="city_select_lhsl">' +
             '<p class="title"><a class="close" href="javascript:;">×</a>支持中文/拼音/简拼输入</p>' +
               '<div class="key_word_key">' +
               '<div class="ico_key CQ_suggestionKeyboard">显示键盘</div>' +
               '</div>' +
		     '<p class="sarch_history_title">正在查询中转站，请稍等...</p>' +
		     '<div class="search_history_box">' +
		     '</div>' +
         '<ul class="tab_box">{{enum(key) $data.data}}<li><span>${key}</span></li>{{/enum}}</ul>' +
         '{{enum(key,objs) $data.data}}' +
                '<div class="city_item">' +
				    '{{enum(k,arr) objs}}' +
				    '<div class="city_item_in">' +
					    '<span class="city_item_letter">${k}</span>' +
                        '{{each(index, item) arr}}<a href="javascript:void(0);" data="${item.data}">${item.display}</a>{{/each}}' +
				    '</div>' +
				    '{{/enum}}' +
                '</div>' +
         '{{/enum}}' +
        '</div>',


                suggestionStyleIpad: '.city_select_lhsl{width:502px;padding:10px;border:1px solid #999;background-color:#fff;}' +
		'.city_select_lhsl .close{float:right;width:20px;height:20px;color:#666;text-align:center;font:bold 16px/20px Simsun;}' +
		'.city_select_lhsl .close:hover{text-decoration:none;color:#FFA800;}' +
		'.city_select_lhsl .title{margin-bottom:10px;color:#999;}' +
		'.city_select_lhsl .tab_box{width:100%;height:22px;margin-bottom:6px;margin-top:0;border-bottom:2px solid #ccc;}' +
		'.city_select_lhsl .tab_box li{position:relative;float:left;display:inline;margin-right:2px;line-height:22px;cursor:pointer;}' +
		'.city_select_lhsl .tab_box li b{display:none;}' +
		'.city_select_lhsl .tab_box li span{padding:0 12px;}' +
		'.city_select_lhsl .tab_box .hot_selected{border-bottom:2px solid #06c;margin-bottom:-2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .tab_box .hot_selected b{position:absolute;top:23px;left:50%;display:block;width:0;height:0;margin-left:-5px;overflow:hidden;font-size:0;line-height:0;border-color:#06c transparent transparent transparent;border-style:solid dashed dashed dashed;border-width:5px;}' +
		'.city_select_lhsl .city_item, .city_select_lhsl .search_history_box {display:inline-block;*zoom:1;overflow:hidden;}' +
		'.city_select_lhsl .city_item{width:500px;}' +
		'.city_select_lhsl .city_item a, .city_select_lhsl .search_history_box a {float:left;display:inline;width:65px;height:30px;margin:0 2px 2px 0;padding-left:8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:30px;color:#333;}' +
		'.city_select_lhsl .city_item a:hover,.city_select_lhsl .search_history_box a:hover{background-color:#2577E3;text-decoration:none;color:#fff;}' +
		'.city_item .city_item_in{width:auto;padding-left:30px;*zoom:1;}' +
		'.city_item .city_item_in:after,.city_select_lhsl .search_history_box:after{display:block;height:0;visibility:hidden;overflow:hidden;content:".";clear:both;}' +
		'.city_item .city_item_letter{float:left;width:30px;height:22px;margin-left:-30px;line-height:22px;text-align:center;color:#E56700;}' +
		'.city_select_lhsl .sarch_history_title{margin-bottom:2px;font-weight:bold;color:#06c;}' +
		'.city_select_lhsl .search_history_box{margin-bottom:6px;}' +
        '.ico_key,.ico_unkey{width:92px;height:43px;padding-left:65px;background:url(http:\/\/pic.c-ctrip.com\/ctripOnPad\/un_key20131012.png) 10px 11px no-repeat;cursor:pointer;line-height:40px;font-size:18px;border-width:1px;border-style:solid;border-radius:3px;}' +
        '.ico_key{border-color:#f0f0f0 #cfcfcf #707070;box-shadow:0 1px 0 #cfcfcf,1px 0 0 0 #f0f0f0 inset,-1px 0 0 0 #f0f0f0 inset,0 -1px 0 0 #f0f0f0 inset;}' +
        '.ico_unkey{border-color:#898989 #e2e2e2 #e2e2e2;background-color:#f5f5f5;box-shadow:0 -1px 0 #e2e2e2,0 1px 0 #d1d1d1 inset;}',

                suggestionInitIpad: function (el) {
                    suggestInit(el);
                    GetHubCityDataInit(Page_id); //第一次点击 拉取中转数据
                }

            }
        });
        function suggestInit(a) {
            $(".tab_box li", a[0]).bind("mousedown", function () {
                $(".tab_box li", a[0]).removeClass("hot_selected");
                $(this).addClass("hot_selected");
                $(".city_item", a[0]).css("display", "none");
                var keywords = $("span", $(this)[0])[0].innerHTML;
                if (keywords.trim() == '热门') {
                    $(".city_item:eq(0)", a[0]).css("display", "");
                }
                else {
                    $(".city_item").each(function (c) {
                        var letter = $(".city_item_letter", c[0])[0].innerHTML;
                        if (letter != '' && keywords.indexOf(letter) > -1) {
                            $(c).css("display", "");
                        }
                    });
                }
            });
            $(".search_history_box a", a[0]).bind("mousedown", function () {
                $(input).value(this.innerHTML);
                noticeAddress.method("hidden");
            });
            $(".title .close", a[0]).bind("mousedown", function () {
                noticeAddress.method("hidden");
            });
            $(".tab_box li:eq(0)", a[0]).trigger("mousedown");
            noticeAddressHub.Address = noticeAddress;
            noticeAddressHub.HubDiv = $(".search_history_box", a[0])[0];
            noticeAddressHub.HubP = $(".sarch_history_title", a[0])[0];
            noticeAddressHub.HistoryAClick = function () {
                $(".search_history_box a", a[0]).bind("mousedown", function () {
                    $(input).value(this.innerHTML);
                    noticeAddress.method("hidden");
                });
            }
        };

        var GetHubCityDataInit = function (pageid) {
            $(noticeAddressHub.HubDiv).html("");
            $(noticeAddressHub.HubP).html("正在查询中转站，请稍等...");
            var baseUrl = window.location.host.replace("www", "trains");

            var dname;
            var dpinyin;
            var aname;
            var apinyin;
            var departuredate;

            if (pageid == 1) {//首页
                dname = $("#notice01").value().trim();
                dpinyin = $("#from").value().trim();
                aname = $("#notice02").value().trim();
                apinyin = $("#to").value().trim();
                departuredate = $("#dateObj").value().trim();
            }
            else if (pageid == 2) { //单程 单列中转 往返 两列中转
                dname = $("#txtCityDep").value().trim();
                dpinyin = $("#txtCityFrom").value().trim();
                aname = $("#txtCityAri").value().trim();
                apinyin = $("#txtCityTo").value().trim();
                departuredate = $("#txtDateDep").value().trim();
            }

            type = 3;
            baseUrl = "http://" + baseUrl + "/TrainBooking/Ajax/GetHubStation.ashx?dname=" + dname + "&dpinyin=" + dpinyin + "&aname=" + aname + "&apinyin=" + apinyin + "&ddate=" + departuredate + "&type=" + type;
            cQuery.ajax(baseUrl,
             {
                 onsuccess: function (result) {
                     if (result.responseText != "") {
                         $(noticeAddressHub.HubP).html("请选择中转站");
                         var lists = $.parseJSON(result.responseText);
                         if (lists && lists.length > 0) {
                             var hubstations = "";
                             lists.each(function (hs) {
                                 hubstations = hubstations + "<a href='javascript:void(0);'>" + hs.display + "</a>";
                                 $(noticeAddressHub.HubDiv).html(hubstations);
                                 noticeAddressHub.HistoryAClick();
                             })
                         }
                         else {
                             $(noticeAddressHub.HubP).html("暂无中转站");
                         }
                     }
                 },
                 onerror: function () { }
             });
        }
        return noticeAddressHub;
    },
    initNotice: function (noticeContent, noticeType) {
        var noticeTypeName = "userinfo_notice";
        if (arguments.length == 2)
            noticeTypeName = noticeTypeName + noticeType;

        if (UI2.Common.getCookie(noticeTypeName) == null && noticeContent.trim() != "") {
            $("#pnlNotice").css("display", "block");
        }
        $("#pnlNotice a:last").bind("click", function () {
            $("#pnlNoticeDetail").mask();
        });
        $(".icon_close,.btn_c", $("#pnlNoticeDetail")[0]).bind("click", function () {
            $("#pnlNoticeDetail").unmask()
            UI2.Common.hide($("#pnlNoticeDetail")[0]);
        });
        $("#noticeSwitch").bind("click", function () {
            $("#noticeSwitch")[0].parentNode.style.display = 'none';
            UI2.Common.setCookie(noticeTypeName, "1", "d1");
        });
    },

    inputFocus: function (event) {
        var target = UI2.Common.getEventTarget(event);
        if ($(target).value() == $(target).attr("tooltip")) {
            $(target).value("");
            $(target).css("color", "#000");
        }
    },
    inputBlur: function (event) {
        var target = UI2.Common.getEventTarget(event);
        if ($(target).value() == "") {
            $(target).value($(target).attr("tooltip"));
            $(target).css("color", "#999");
        }
    }
};

