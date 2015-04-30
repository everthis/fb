//车站数组
// var _ListData_ = [['北京北', 'VAP', 'beijingbei', 'bjb', '0'],
var _ListData_ = [];

document.write('<div id="cityList" style="display:none; z-index:9999;top:-1;position:absolute"></div>');
var _CloseAdmit_ = true;
var _InputID_ = "";
var TrainNumber_InputID_ = "";
var _ListSelectID_ = 0;
var _ListSelectStr_ = "";
var _index_train_hots = [];


function _ListMove_(ID) {
    if (_ListSelectStr_ != "") {
        var StrArray = _ListSelectStr_.split(",")
        switch (ID) {
            case 1: if (_ListSelectID_ >= StrArray.length - 2) { return; } break;
            case -1: if (_ListSelectID_ <= 0) { return; } break;
            default: return;
        }
        document.getElementById("_ListID" + _ListSelectID_ + "_").style.backgroundColor = "";
        _ListSelectID_ = _ListSelectID_ + ID;
        document.getElementById("_ListID" + _ListSelectID_ + "_").style.backgroundColor = "#CFE2C4";
    }
}

function _UpdateList_() {
    var Str = document.getElementById(_InputID_).value.toLowerCase();
    var Len = Str.length;
    var i = 0;
    var ListStr = "";
    _ListSelectID_ = 0;
    _ListSelectStr_ = "";
    if (Str != "") {
        var selectAllListData = new Array();
        for (var j = 0; j < _ListData_.length; j++) {
            if (_ListData_[j][0].substr(0, Len) == Str || _ListData_[j][3].substr(0, Len) == Str || _ListData_[j][2].substr(0, Len) == Str) {
                selectAllListData.push(_ListData_[j]);
            }
        }

        selectAllListData.sort(function compare(a, b) { return parseInt(a[3]) - parseInt(b[3]); })
        for (var j = 0; j < selectAllListData.length; j++) {
            if (i == 0) {
                ListStr = ListStr + '<tr height="20" onMouseOver="this.style.backgroundColor=\'#CFE2C4\'" onMouseOut="this.style.backgroundColor=\'\'" style="cursor:pointer;background-color:#CFE2C4" onClick="JavaScript:_GetValue_(\'' + _InputID_ + '\',\'' + selectAllListData[j][0] + '\')" id="_ListID' + i + '_"><td>&nbsp;&nbsp;' + selectAllListData[j][0] + '(' + selectAllListData[j][1].toUpperCase() + ')</td><td align="right">' + selectAllListData[j][2] + '&nbsp;&nbsp;</td></tr>';
            }
            else {
                ListStr = ListStr + '<tr height="20" onMouseOver="this.style.backgroundColor=\'#CFE2C4\'" onMouseOut="this.style.backgroundColor=\'\'" style="cursor:pointer" onClick="JavaScript:_GetValue_(\'' + _InputID_ + '\',\'' + selectAllListData[j][0] + '\')" id="_ListID' + i + '_"><td>&nbsp;&nbsp;' + selectAllListData[j][0] + '(' + selectAllListData[j][1].toUpperCase() + ')</td><td align="right">' + selectAllListData[j][2] + '&nbsp;&nbsp;</td></tr>';
            }
            _ListSelectStr_ = _ListSelectStr_ + selectAllListData[j][0] + ',';
            if (i >= 11) //提示12个
            {
                break;
            }
            else {
                i = i + 1;
            }
        }

        if (ListStr != "") {
            _ListSelectID_ = 0;
            ListStr = '<table align="left" width="240" cellpadding="0" cellspacing="0" style="border:1px solid #999999;font-size:12px; font-family:Arial; color:#555555;background-color:#FFFFFF;filter:alpha(opacity=95);">' + ListStr + '</table>';
            document.getElementById("cityList").innerHTML = ListStr;
        }
        else {
            document.getElementById("cityList").innerHTML = "";
        }
    }
}

function showCity(ID) {
    try {
        document.getElementById(ID).value = "";
        _CloseAdmit_ = false;
        _InputID_ = ID;
        var ListStr = '<table width="350" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #E0E2F0;background: #fff;color: #353535;position: relative;text-align: center;padding-bottom:3px;">'
							+ '<tr>'
						    + '<th colspan="5"><h4 style="font-size:12px;margin-bottom: 5px;background: #F0F4EE;padding: 0 10px;line-height: 2.0em;text-align:left">热门城市<span style="font-weight: normal;margin-left: 10px;color: #999">可直接选择城市或输入城市全拼、简拼、中文</span></h4>'
						    + '<a href="javascript:void(0);" onClick="JavaScript:_HideList_();" style="position: absolute;right:4px;top:9px;width:13px;height:13px;background: url(../images/close.png) no-repeat; text-indent: -9999px;">关闭</a>'
						    + '</th>'
						    + '</tr>'
        //+'<td align="right"><span style="cursor:pointer" onClick="JavaScript:_HideList_()"><img border="0" title="关闭窗口" src="http://img3.tieyou.com/images/close.gif" width="8" height="8"></span>&nbsp;&nbsp;&nbsp;</td></tr>';
        // var StrArray = "北京，上海，广州，深圳，杭州，苏州，南京，天津，成都，重庆，西安，郑州，长沙，武汉，南昌，青岛，济南，大连，沈阳，长春，哈尔滨，洛阳，兰州，合肥，太原，海口，南宁，福州，昆明，乌鲁木齐".split("，");
        var StrArray = _index_train_hots;
        ListStr = ListStr + '<tr>';

        for (var i = 0; i < StrArray.length; i++) {
            if (i != 0 && i % 5 == 0) {
                ListStr = ListStr + '</tr><tr>';
            }
            ListStr = ListStr + '<td  height="25" width="70" onMouseOver="this.style.backgroundColor=\'#CFE2C4\'" onMouseOut="this.style.backgroundColor=\'\'" style="cursor:pointer; color:#666;text-decoration: none;font-size: 12px;text-align:center;"onClick="JavaScript:_GetValue_(\'' + ID + '\',\'' + StrArray[i] + '\')">' + StrArray[i] + '</td>';
        }
        ListStr = ListStr + '</table>';
        var ListObj = document.getElementById("cityList");
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
    catch (Err) {
        alert(Err.description);
    }
}

function _GetValue_(ID, Value) {
    _CloseAdmit_ = true;
    if (typeof (Value) == "string" && Value != "") {
        var cityInput = document.getElementById(ID);
        cityInput.value = Value;
        document.getElementById(ID+"_code").value = GetCode(Value);
        if (cityInput.onchange != undefined) {
            cityInput.onchange();
        }
    }
    _HideList_();
}

function GetCode(_val) {
    if (_val != "" && _val != null) {
        var arry = null;
        for (var i = 0; i < _ListData_.length; i++) {
            arry = _ListData_[i];
            if (arry[0].trim() == _val) {
                return arry[1];
            }
        }
    }
}

function _HideList_() {
    if (_CloseAdmit_) {
        document.getElementById("cityList").style.display = "none";
        _InputID_ = "";
    }
}

function hideCity() {
    _CloseAdmit_ = true;
    setTimeout("_HideList_()", 200);
}
