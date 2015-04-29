var trainCalendarCallBack = function(){
}

var trainFanSingleCalendarCallBack = function(){
}
function GetDate() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var clock = year + "-";
    if (month < 10)
        clock += "0";

    clock += month + "-";
    if (day < 10)
        clock += "0";

    clock += day;
    return (clock);
}
$(document).ready(function(){

    var dL=new Date();
    var yearD = dL.getFullYear();
    var monthD = dL.getMonth()+1;
	var dayD=dL.getDate();

	adddayD = 19;





	if($(".wangfan").length > 0 ){
		//alert(1);
		inputTrainDateId = $(".trainWangCalendar").attr("id");
	    var trainWangCalendar = new datepicker({className:"trainWangCalendar",startInput:"wangdate",endInput:"fandate",addDay:adddayD});

	    trainWangCalendar.start();
	    trainWangCalendar.autoDateCallback = function (){
	    	document.getElementById("fandate").focus();
	    	//trainCalendarCallBack();
	    }
		var trainfanCalendar = new datepicker({choiceClass:"huicheng",className:"trainfanCalendar" ,startInput:"wangdate",endInput:"fandate",addDay:adddayD});

		trainfanCalendar.start();
	}

	// $('#wangdate').val(GetDate());
	// $(".hotcity_ico").live("click", function(){
	// 	$(this).prev("input").focus();
	// });

	// $(".date_ico").live("click", function(){
	// 	$(this).prev("input").focus();
	// });
});


//(function(){
var holiday={
	"2012-01-01":{holidayName:"元旦节",className:"yuandan",beforeTime:3,afterTime:3,dayindex:0},
	"2012-01-22":{holidayName:"除夕",className:"chuxi",beforeTime:7,afterTime:0,dayindex:0},
	"2012-01-23":{holidayName:"春节",className:"chunjie",beforeTime:7,afterTime:3,dayindex:0},
	"2012-02-06":{holidayName:"元宵",className:"yuanxiao",beforeTime:7,afterTime:3,dayindex:0},
	"2012-04-04":{holidayName:"清明节",className:"qingming",beforeTime:3,afterTime:3,dayindex:0},
	"2012-05-01":{holidayName:"劳动节",className:"wuyi",beforeTime:3,afterTime:3,dayindex:0},
	"2012-06-23":{holidayName:"端午节",className:"duanwu",beforeTime:3,afterTime:3,dayindex:0},
	"2012-09-30":{holidayName:"中秋节",className:"zhongqiu",beforeTime:3,afterTime:3,dayindex:0},
	"2012-10-01":{holidayName:"国庆节",className:"guoqin",beforeTime:3,afterTime:0,dayindex:0},


	"2013-01-01":{holidayName:"元旦节",className:"yuandan",beforeTime:3,afterTime:3,dayindex:0},
	"2013-02-09":{holidayName:"除夕",className:"chuxi",beforeTime:7,afterTime:0,dayindex:0},
	"2013-02-10":{holidayName:"春节",className:"chunjie",beforeTime:7,afterTime:3,dayindex:0},
	"2013-02-24":{holidayName:"元宵",className:"yuanxiao",beforeTime:7,afterTime:3,dayindex:0},
	"2013-04-04":{holidayName:"清明节",className:"qingming",beforeTime:3,afterTime:3,dayindex:0},
	"2013-05-01":{holidayName:"劳动节",className:"wuyi",beforeTime:3,afterTime:3,dayindex:0},
	"2013-06-12":{holidayName:"端午节",className:"duanwu",beforeTime:3,afterTime:3,dayindex:0},
	"2013-09-19":{holidayName:"中秋节",className:"zhongqiu",beforeTime:3,afterTime:3,dayindex:0},
	"2013-10-01":{holidayName:"国庆节",className:"guoqin",beforeTime:3,afterTime:0,dayindex:0}

	};

	var datepicker = function(config){
		this.eachW = config.eachW || 198; //单列宽度
		this.eachH = config.eachH || 198; //单列高度
		this.choiceClass = config.choiceClass
		this.year = config.year || new Date().getFullYear(); //当前年
		this.month = config.month || (new Date().getMonth() + 1); //当前月
		this.day = config.day || new Date().getDate(); //当前日
		this.ttMonth = config.ttMonth || 2; //共显示几个月的数据，默认两个月，即双日历
		this.pickStart = config.pickStart || null; //可选择的起始日期
		this.pickEnd = config.pickEnd || null; //可选择的结束日期
		this.startInput = config.startInput; //开始输入框
		this.endInput = config.endInput; //结束输入框
		this.cyear = this.year;
		this.cmonth = this.month;
		this.cday = null; //选中日期
		this.startDate = config.startDate;
		this.endDate = config.endDate;
		this.days = []; //日期对象列表
		this.cflag = config.cflag || [];
		this.datelist = config.datelist || [];
		this.weekend = config.weekend;
		this.weeklist = config.weeklist;
		this.addDay = config.addDay || 0;
		this.autoDateCallback = config.autoDateCallback || null;
		this.timeDiffer = config.timeDiffer || null;
		this.isopen = false;
		this.className=config.className
		var date = new Date(this.year,this.month-1,this.day);
		this._init(date);
		this.start = function(et){this._startEvent(et);};
	};

	datepicker.prototype = {
		_init : function(date){
			this._createPanel();
			this._getCalendar(date, false);
		},
		_createPanel : function(){
			if(getid('dp_id') && getid('pickwidth')) return;
			if(!getid('dp_id')){
				var div = document.createElement('div');
				div.className = "datepicker";
				div.id = "dp_id";
				document.body.appendChild(div);
			}
			var dp_wrap = getid('dp_id');

			dp_wrap.innerHTML = '<div class="pickerwrap"><em class="prevMonth">&lt;&lt;</em><em class="nextMonth">&gt;&gt;</em><div class="pickwidth" id="pickwidth"> </div> </div><iframe frameborder="0" marginheight="0" marginwidth="0" id="dateframe" style="position:absolute; left:-8px; top:-8px; overflow:hidden; background:#fff; border:0; z-index:-1; opacity:0; filter:alpha(opacity = 0);"></iframe></div>';
		},

		_getCalendar : function(date, setfrag){
			this.year = date.getFullYear(); this.month = date.getMonth()+1; this.day = date.getDate(); //改变当前日期
			var ttm = this.ttMonth, dpanel = [];
			//console.time('_getCalendar');
			if(setfrag){
				/*
				if(this.endInput!=null ){

					var flagDate = this._getCurrDay(document.getElementById(this.endInput).value);
					var frag = [parseInt(flagDate.year), parseInt(flagDate.month), parseInt(flagDate.day)];
				}else{
					var frag = [this.year, this.month, this.day];
				}
				*/
				var frag = [this.year, this.month, this.day];
			}
			var that = this;
			for(var i=0; i<ttm; i++){
				dpanel[i] = this._getDayList(frag,i);
				if(this.month < 12){ this.month ++}else{this.year++; this.month = 1;}
			}

			getid('pickwidth').innerHTML = dpanel.join('');
			//getid('dp_id').style.width = ttm*this.eachW + "px";


			if(this.ttMonth == 2){
				getid('dateframe').className = 'fm396x228';
			}else if(this.ttMonth == 1){
				getid('dateframe').className = 'fm208x208';
			}else{
			}

			this.isopen = true;
			//console.timeEnd('_getCalendar');
		},
		_getFlagDate : function(date, lastday){
		    var datelist = this.datelist; //if datelist = 'weekend' || Array
			/*
			var days = lastday;
			var wkarr = [], wkstr;
			if( datelist == 'weekend'){
			    for(var k=0; k<days; k++){
				    if(new Date(this.year,this.month,k).getDay()==0 || new Date(this.year,this.month,k).getDay()==6){
					    wkstr = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(k<10 ? ("0"+k) : k);
					    wkarr.push(wkstr);
					}
				}
				this.datelist = wkarr;
				console.log(this.datelist);
			}
			*/
			var isexit = false;
			//console.log(syear+'-'+smonth+'-'+date+'-'+eyear+'-'+emonth);
			for(var i=0, j=datelist.length; i<j; i++){
			    //console.log(eyear>= datelist[i].split('-')[0] && datelist[i].split('-')[0] <= syear);
			    if((datelist[i].split('-')[0] == this.year) && (datelist[i].split('-')[1] == this.month) && (datelist[i].split('-')[2] == date)){
			    //if(datelist[i].split('-')[2] == date){
			    //if(datelist[i].split('-')[2] == date){
				    isexit =  datelist[i].split('-')[2];
					//console.log(isexit);
					continue;
				}
			}
			return isexit;
		},

		_getFlagList : function(dateArray, syear, smonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday, lastday){
		    var flag = this.cflag, datelist = this.datelist, arr = dateArray, tyear = syear, tmonth = smonth, sday = sday, eyear = eyear, emonth = emonth, eday = eday, today = today, cday = cday, lastday = lastday, list = [];
			//console.log(arr.length);
			if(!arr) return false;
			/*
			if(tyear && eyear){
			}else if(tyear){
			}else if(eyear){
			}else{
			}
			*/

			switch(flag){
			    case 0 :
					break;
				case 1 :
					if(tyear && eyear){
						for(var j=0, k=arr.length; j<k; j++){

							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday)) || (eyear < this.year && arr[j]) || ((eyear == this.year) && (emonth < this.month) && arr[j]) || ((eyear == this.year) && (emonth == this.month) && arr[j] && (eday < arr[j]))){
								list.push('<li>'+ arr[j] +'</li>');
							}else if((tyear == this.year) && (tmonth == this.month) && arr[j] && arr[j]==today && !this._getFlagDate(today, lastday)){
							    //console.log(!this._getFlagDate(today));
								list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] : this._getHolidayName(forDate)) +'</a></li>');
							}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday && !this._getFlagDate(cday, lastday)){
								list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}else{
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}

					}else if(tyear){


						for(var j=0, k=arr.length; j<k; j++){
														var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if((tyear == this.year) && (tmonth == this.month) && arr[j] && arr[j]==today && !this._getFlagDate(today, lastday)){
								list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday && !this._getFlagDate(cday, lastday)){
								list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}else{
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}


					}else if(eyear){

						tyear = new Date().getFullYear(); tmonth = new Date().getMonth()+1;

						for(var j=0, k=arr.length; j<k; j++){
							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday)) || (eyear < this.year && arr[j]) || ((eyear == this.year) && (emonth < this.month) && arr[j]) || ((eyear == this.year) && (emonth == this.month) && arr[j] && (eday < arr[j]))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if((tyear == this.year) && (tmonth == this.month) && arr[j] && arr[j]==today && !this._getFlagDate(today, lastday)){
								list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday && !this._getFlagDate(cday, lastday)){
								list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}else{
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}

					}else{

						tyear = new Date().getFullYear(); tmonth = new Date().getMonth()+1;
						//console.log(tyear);
						for(var j=0, k=arr.length; j<k; j++){
							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < today))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if((tyear == this.year) && (tmonth == this.month) && arr[j] && arr[j]==today && !this._getFlagDate(today, lastday)){
								list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday && !this._getFlagDate(cday, lastday)){
								list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}else{
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}

					}

					break;
				case 2 :
					if(tyear && eyear){

						for(var j=0, k=arr.length; j<k; j++){
							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday)) || (eyear < this.year && arr[j]) || ((eyear == this.year) && (emonth < this.month) && arr[j]) || ((eyear == this.year) && (emonth == this.month) && arr[j] && (eday < arr[j]))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}else{
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}

					}else if(tyear){

						for(var j=0, k=arr.length; j<k; j++){
							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}else{
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}


					}else if(eyear){

						tyear = new Date().getFullYear(); tmonth = new Date().getMonth()+1;

						for(var j=0, k=arr.length; j<k; j++){
							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday)) || (eyear < this.year && arr[j]) || ((eyear == this.year) && (emonth < this.month) && arr[j]) || ((eyear == this.year) && (emonth == this.month) && arr[j] && (eday < arr[j]))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}else{
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}

					}else{

						tyear = new Date().getFullYear(); tmonth = new Date().getMonth()+1;
						//console.log(tyear);
						for(var j=0, k=arr.length; j<k; j++){
							var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

							if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < today))){
								list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
							}else if(arr[j]){
								if(this._getFlagDate(arr[j], lastday)){
									list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
								}else{
									list.push('<li>'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</li>');
								}
							}else{
								list.push('<li>&nbsp;</li>');
							}
						}

					}


					break;

			}
			//console.log(list.length);
			return list;
		},
		_getcommlist : function(dateArray, syear, smonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday){
		    var arr = dateArray, tyear = syear, tmonth = smonth, sday = sday, eyear = eyear, emonth = emonth, eday = eday, today = today, cday = cday, list = [];
			if(!arr) return false;
			//alert(this.startInput);
			dt_dt = document.getElementById(this.startInput);
			dt_dd = document.getElementById(this.endInput);
			dt_ed = eyear+'-'+emonth+'-'+eday;
			if(this.startInput!=null){
				if(/^(\d{4})-(\d{2})-(\d{2})$/g.test(dt_dt.value)){
					this.pickStart = dt_dt.value;
				}else{
					this.pickStart = null;
				}
			}
			if(this.endInput!=null){

				if(/^(\d{4})-(\d{2})-(\d{2})$/g.test(dt_dd.value)){
					if(dt_dt.value >= dt_dd.value){
						//日历+1跟随
						dt_date = dt_dt.value.replace(/-/g, '/');//js不认2000-1-31,只认2000/1/31
						dd_date = dt_dd.value.replace(/-/g, '/');
						var t1  = new Date(new Date(dt_date).valueOf() + 1*24*60*60*1000);// 日期加上指定的天数
						var year= t1.getFullYear();
						var mon = t1.getMonth()+1;
						var day = t1.getDate();
							mon = mon >=10 ? mon : '0'+mon;
							day = day >=10 ? day : '0'+day;
						var time= year+'-'+mon+'-'+day;
							time= time> dt_ed ? dt_ed : time;
						this.pickEnd = time;
						dt_dd.value  = time;
						$('input[name='+this.endInput+']').nextAll('div').eq(0).html(updateIcoVal(time));
//						$('input[name='+this.endInput+']').next('.date_ico').text(updateIcoVal(time));
					}else{
						this.pickEnd = dt_dd.value;
					}
				}else{
					this.pickEnd = null;
				}
			}
			if(tyear && eyear){
				//alert(2);
				for(var j=0, k=arr.length; j<k; j++){
					var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

					if((tyear > this.year && arr[j]) ||

						((tyear == this.year) && (tmonth > this.month) && arr[j]) ||
						((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday)) ||
						(eyear < this.year && arr[j]) || ((eyear == this.year) && (emonth < this.month) && arr[j]) ||
						((eyear == this.year) && (emonth == this.month) && arr[j] && (eday < arr[j]))){

						list.push('<li>'+ arr[j]  +'</li>');
					}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday ){
						if(this.choiceClass=='huicheng'){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else if(forDate==this.pickStart){
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(forDate==this.pickEnd){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(arr[j]){
						if(this.pickStart!=null && this.pickEnd !=null && forDate < this.pickStart && this.choiceClass=='huicheng'){
							list.push('<li>'+ arr[j] +'</li>');
						}else if(this.pickStart!=null && this.pickEnd !=null && forDate > this.pickStart && forDate < this.pickEnd){
							list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else{
						list.push('<li>&nbsp;</li>');
					}
				}



			}else if(tyear){

				//alert(3);
			    //console.log(today);

				for(var j=0, k=arr.length; j<k; j++){
					var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);

					if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday))){
						list.push('<li>'+ arr[j] +'</li>');
					}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday){
						//list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						if(this.choiceClass=='huicheng'){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else if(forDate==this.pickStart){
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(forDate==this.pickEnd){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(arr[j]){
						//list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						if(this.pickStart!=null && this.pickEnd !=null && forDate < this.pickStart && this.choiceClass=='huicheng'){
							list.push('<li>'+ arr[j] +'</li>');
						}else if(this.pickStart!=null && this.pickEnd !=null && forDate > this.pickStart && forDate < this.pickEnd){
							list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else{
						list.push('<li>&nbsp;</li>');
					}
				}



			}else if(eyear){

				//alert(4);
			    tyear = new Date().getFullYear(); tmonth = new Date().getMonth()+1;
				for(var j=0, k=arr.length; j<k; j++){
					var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);
					if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < sday)) || (eyear < this.year && arr[j]) || ((eyear == this.year) && (emonth < this.month) && arr[j]) || ((eyear == this.year) && (emonth == this.month) && arr[j] && (eday < arr[j]))){
						list.push('<li>'+ arr[j] +'</li>');
					}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday){
						//list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						if(this.choiceClass=='huicheng'){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else if(forDate==this.pickStart){
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(forDate==this.pickEnd){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(arr[j]){
						//list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						if(this.pickStart!=null && this.pickEnd !=null && forDate < this.pickStart && this.choiceClass=='huicheng'){
							list.push('<li>'+ arr[j] +'</li>');
						}else if(this.pickStart!=null && this.pickEnd !=null && forDate > this.pickStart && forDate < this.pickEnd){
							list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else{
						list.push('<li>&nbsp;</li>');
					}
				}



			}else{
				//alert(5);
				tyear = new Date().getFullYear(); tmonth = new Date().getMonth()+1;
				//console.log(tyear);
				for(var j=0, k=arr.length; j<k; j++){
					var forDate = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j]);
					if((tyear > this.year && arr[j]) || ((tyear == this.year) && (tmonth > this.month) && arr[j]) || ((tyear == this.year) && (tmonth == this.month) && arr[j] && (arr[j] < today))){
						list.push('<li>'+ arr[j] +'</li>');
					}else if((cyear == this.year) && (cmonth == this.month) && arr[j] && arr[j]==cday){
						//list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						if(this.choiceClass=='huicheng'){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else if(forDate==this.pickStart){
							list.push('<li><a href="#" class="now" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(forDate==this.pickEnd){
							list.push('<li><a href="#" class="end" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
					}else if(arr[j]){
						//list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						if(this.pickStart!=null && this.pickEnd !=null && forDate < this.pickStart && this.choiceClass=='huicheng'){
							//alert(1);
							list.push('<li>'+ arr[j] +'</li>');
						}else if(this.pickStart!=null && this.pickEnd !=null && forDate > this.pickStart && forDate < this.pickEnd){
							//alert(2);
							list.push('<li><a href="#" class="choice" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}else{
							//alerr(3);
							list.push('<li><a href="#" title="'+this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(arr[j]<10 ? ("0"+arr[j]) : arr[j])+'">'+ (this._getHolidayName(forDate) == null ? arr[j] :  this._getHolidayName(forDate)) +'</a></li>');
						}
					}else{
						list.push('<li>&nbsp;</li>');
					}




				}

			}

			return list;

		},
		_getDayList : function(frag,lineFlag){
			var dplist = ['日','一','二','三','四','五','六'];
			var today = new Date().getDate();
			var tmonth = new Date().getMonth()+1;
			var tyear = new Date().getFullYear();
			var cyear = frag ? frag[0] : tyear;
			var cmonth = frag ? frag[1] : tmonth;

			var cday =  null;



			var addDay = this.addDay;
			//if(addDay) {var operaAddDay = this._operaAddDay(addDay);}
			//console.log('start date = '+this.startDate);
			//console.log(this.year);
			//console.log(cday);
			var arr = [], firstday, lastday, list = [], plist;
			firstday = new Date(this.year, this.month - 1, 1).getDay(); //当月第一天在第一周中的位置 this.month已经发生改变并非预定义的this.month
			lastday = new Date(this.year, this.month, 0).getDate(); //返回当月天数
			for(var i=1; i<=firstday; i++){arr.push(0);}
			for(var i=1; i<=lastday; i++){arr.push(i);}



			if( this.weekend == 'weekend'){
			    var wkarr = [], wkstr;
			    for(var k=1; k<=lastday; k++){
				    if(new Date(this.year,this.month-1,k).getDay()==0 || new Date(this.year,this.month-1,k).getDay()==6){
					    wkstr = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(k<10 ? ("0"+k) : k);
					    wkarr.push(wkstr);
					}
				}
				this.datelist = wkarr;
			}

			if( this.weeklist && this.weeklist.length){
			    var wlarr = [], wlstr, wll = this.weeklist.length;
			    for(var k=1; k<=lastday; k++){
				    for(var z=0; z<wll; z++){
					    if(new Date(this.year,this.month-1,k).getDay() == this.weeklist[z]){
						    wlstr = this.year+'-'+(this.month<10 ? ("0"+this.month) : this.month)+'-'+(k<10 ? ("0"+k) : k);
						    wlarr.push(wlstr);
						}

					}
				}
				this.datelist = wlarr;
				//console.log(this.datelist);
			}


			if(this.startDate && this.endDate && !addDay){

				tyear = this.startDate[0]; tmonth = this.startDate[1];
				var sday = this.startDate[2], eyear = this.endDate[0], emonth = this.endDate[1], eday = this.endDate[2];

				if(this.cflag && this.datelist.length){
					list = this._getFlagList(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday, lastday);
				}else{
					list = this._getcommlist(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday);
				}


			}else if(this.startDate && addDay){

				tyear = this.startDate[0]; tmonth = this.startDate[1];
				var operaAddDay = this._operaAddDay(this.startDate, addDay);
				var  sday = this.startDate[2], eyear = operaAddDay[0], emonth = operaAddDay[1], eday = operaAddDay[2];

				if(this.cflag && this.datelist.length){

				    list = this._getFlagList(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday, lastday);
				}else{

				    list = this._getcommlist(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday);
				}


			}else if(this.startDate){

				tyear = this.startDate[0]; tmonth = this.startDate[1];
				var  sday = this.startDate[2];

				if(this.cflag && this.datelist.length){
				    list = this._getFlagList(arr, tyear, tmonth, sday, 0, 0, 0, today, cyear, cmonth, cday, lastday);
				}else{
				    list = this._getcommlist(arr, tyear, tmonth, sday, 0, 0, 0, today, cyear, cmonth, cday);
				}

			}else if(this.endDate){

				var eyear = this.endDate[0], emonth = this.endDate[1], eday = this.endDate[2];
				var  sday = today;
				if(this.cflag && this.datelist.length){
				    list = this._getFlagList(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday, lastday);
				}else{
				    list = this._getcommlist(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday);
				}
			}else if(addDay){

				var operaAddDay = this._operaAddDay(this.startDate, addDay);
				var  eyear = operaAddDay[0], emonth = operaAddDay[1], eday = operaAddDay[2];
				var  sday = today;
				if(this.cflag && this.datelist.length){

				    list = this._getFlagList(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday, lastday);
				}else{

				    list = this._getcommlist(arr, tyear, tmonth, sday, eyear, emonth, eday, today, cyear, cmonth, cday);
				}

			}else{

				if(this.cflag && this.datelist.length){
				    list = this._getFlagList(arr, 0, 0, 0, 0, 0, 0, today, cyear, cmonth, cday, lastday);
				}else{
				    //console.log(today);
				    list = this._getcommlist(arr, 0, 0, 0, 0, 0, 0, today, cyear, cmonth, cday);
				}

			}
			if(lineFlag >0){
				plist = '<div class="line"></div>';
			}else{
				plist = '';
			}
			plist += '<div class="line"></div><div class="pickerbody"><div class="pickhead"><strong>'+ this.year +'年'+ this.month +'月</strong></div><div class="pickweek"><li class="weekend">'+ dplist[0] +'</li><li>'+ dplist[1] +'</li><li>'+ dplist[2] +'</li><li>'+ dplist[3] +'</li><li>'+ dplist[4] +'</li><li>'+ dplist[5] +'</li><li class="weekend">'+ dplist[6] +'</li></div><div class="dateswrap '+this.choiceClass+'" ><ul>'+ list.slice(0).join('') +'</ul></div></div>';

			return plist;
		},
		_operaAddDay : function(sdate, num){
			var now = new Date();
			var d = sdate;
			//console.log(d);
			if(d){
			    now.setFullYear(d[0], d[1]-1, d[2]);
				//now.setMonth(d[1]-1);
				//now.setDate(d[2]);
			}
			//console.log(now);
			/*
			var obj = {
			    year : '2011',
				month : '01',
				day : '15'
			};
			*/
			var obj = [];
			var olddate = now.getDate();
			now.setDate(now.getDate()+num);
			obj.push(now.getFullYear());
			obj.push((now.getMonth()+1)<10 ? "0"+(now.getMonth()+1): (now.getMonth()+1));
			obj.push(now.getDate()<10 ? "0"+now.getDate() :now.getDate());
			//console.log(obj);
			return obj;
			//return now.getFullYear() + '-' + ((now.getMonth()+1)<10 ? "0"+(now.getMonth()+1): (now.getMonth()+1))+'-'+ (now.getDate()<10 ? "0"+now.getDate() :now.getDate());
        },
		_getCurrDay : function(date){
			var cdate = {
				year : 0,
				month : 0,
				day : 0
			}
			if(/^(\d{4})-(\d{2})-(\d{2})$/g.test(date)){
				var darr = date.split('-');
				cdate.year = darr[0];
				cdate.month = darr[1];
				cdate.day = darr[2];
			}else{
				cdate.year=new Date().getFullYear();
				cdate.month=new Date().getMonth()+1;
				cdate.day=new Date().getDay();
			}


			return cdate;

		},
		_preMonth : function(){
			var tm = this.ttMonth;
			if(tm){
				this._getCalendar(new Date(this.year, this.month-3-tm, 1),false);
			}else{
				this._getCalendar(new Date(this.year, this.month-3, 1), false);
			}

		},
		_nextMonth : function(){
			var tm = this.ttMonth;
			if(tm){
				this._getCalendar(new Date(this.year, this.month+1-tm, 1), false);
			}else{
				this._getCalendar(new Date(this.year, this.month+1, 1), false);
			}

		},
		_setposition : function(el){
			var pos = getoffset(el);
			getid('dp_id').style.left = pos.left + "px";
			getid('dp_id').style.top = pos.top + el.offsetHeight + "px";
		},
		_resetPosition : function(){
			getid('dp_id').style.left = '-9999px';
		},
		_click : function(e, input){

			e = e || window.event;
			var eTarget = e.target || e.srcElement;
			var sTag = eTarget.nodeName;
			var that = this;
			switch(sTag){
				case 'EM' :
					if(/prevMonth/.test(eTarget.className)) {that._preMonth();}
				    if(/nextMonth/.test(eTarget.className)) {that._nextMonth();}
					break;
				case 'A' :
					that.cday = eTarget.getAttribute('title');
				    input.value = (that.cday) ? that.cday : '';
				    $('input[name='+input.name+']').nextAll('div').eq(0).html(updateIcoVal(that.cday));
//				    $('input[name='+input.name+']').next('.date_ico').text(updateIcoVal(that.cday));

					var holiName = this._getHolidayName(input.value);
					if(next(input) && next(next(input)) && next(next(input)).className == 'holitip'){
					    next(next(input)).innerHTML = holiName ?holiName : '';
					}
					that._resetPosition();
					if(next(input) && next(input).className == 'hidetxt' ){
					    next(input).style.display = '';
					}
					if((input.id==this.startInput) && this.autoDateCallback){

					    this.autoDateCallback(input.value);

					}
					if((input.id==this.endInput) && getid('daysOfStay') && this.timeDiffer){
					    this.timeDiffer();
					}

				    break;
				case 'SPAN' :
					that.cday = eTarget.parentNode.getAttribute('title');
				    input.value = (that.cday) ? that.cday : '';
				    $('input[name='+input.name+']').nextAll('div').eq(0).html(updateIcoVal(that.cday));
//				    $('input[name='+input.name+']').next('.date_ico').text(updateIcoVal(that.cday));

					var holiName = this._getHolidayName(input.value);
					if(next(input) && next(next(input)) && next(next(input)).className == 'holitip'){
					    next(next(input)).innerHTML = holiName ?holiName : '';
					}
					that._resetPosition();
					if(next(input) && next(input).className == 'hidetxt' ){
					    next(input).style.display = '';
					}
					if((input.id==this.startInput) && this.autoDateCallback){
					    this.autoDateCallback(input.value);
						//var sdarr = input.value.split('-');
						//this.startDate = [sdarr[0], sdarr[1], sdarr[2]-1];
					}
					if((input.id==this.endInput) && getid('daysOfStay') && this.timeDiffer){
					    this.timeDiffer();
					}

				    break;
				default :
					break;

			}
		},
		_startEvent : function(){

			if(!this.isopen) return;
			var that = this;

			var targetinput = getid('startDay');
			var panel = getid('dp_id');
			var inputs = document.getElementsByTagName('input');


            for(var i=0; i<inputs.length; i++){
				if(eval("/"+this.className+"/").test(inputs[i].className)){
					(function(){
						var cur = inputs[i]; //for ie
						addEvent(cur, 'focus', function(){
						    removeClass(cur, 'required');
							if(cur.alt && cur.alt.length){
							    that.startDate = cur.alt.split('-');
							}
						    var oldscroll = document.body.scrollWidth;

							if(!cur.value || cur.value == cur.defaultValue){
								//cur.value = '';
								that._setposition(cur);
								if(document.body.scrollWidth != oldscroll){
								    that._setposition(cur);
									oldscroll = document.body.scrollWidth;
								}

								that._getCalendar(new Date(), true);
							}else{
								var newdate = that._getCurrDay(cur.value);
								that._setposition(cur);
								if(document.body.scrollWidth != oldscroll){
								    that._setposition(cur);
									oldscroll = document.body.scrollWidth;
								}
								that._getCalendar(new Date(newdate.year, newdate.month-1, newdate.day), true);

							}

							panel.onclick = function(e){
								that._click(e, cur);
								return false;
							};

						});

					})();
				}
			}

			addEvent(document, 'mousedown', function(e){
				e = e || window.event;
				var eTarget = e.target || e.srcElement;
				if(eTarget.nodeName == 'INPUT' && eval("/"+this.className+"/").test(eTarget.className)) return;
				if(contains(panel, eTarget)) return;
				that._resetPosition();

			});

		},
		_getHolidayName : function(dateStr){
			var thisYear = new Date().getFullYear(); thisMonth = new Date().getMonth()+1; thisDay = new Date().getDate();
			var thisDate =thisYear+'-'+(thisMonth<10 ? ("0"+thisMonth) : thisMonth)+'-'+(thisDay<10 ? ("0"+thisDay) : thisDay);
			if(thisDate == dateStr){
				return '<span class="today">&nbsp;</span>';
			}else{
				return (!!holiday[dateStr]) ? '<span class="'+holiday[dateStr].className+'">&nbsp;</span>' : null;
			}
	    }
	};

	function getid(id){ return (typeof id === "string") ? document.getElementById(id) : id; }

	function removeClass (obj, sClass){
		var reg = new RegExp("(^|\\s)" +sClass+ "(\\s|$)");
		if(obj.className){
		    obj.className = obj.className.replace(reg, ' ');
		}else{
		    obj.className = obj.className.replace(reg, '');
		}

	}

	function addClass(obj, sClass){
	    if(obj.className.length){
			var cln = obj.className.split(" ");
			cln.push(sClass);
			obj.className = cln.join(" ");
		}else{
		    obj.className = sClass;
		}
	}

	function next(elem){
	    do{
		  elem = elem.nextSibling
		}while(elem && elem.nodeType !=1)
		return elem;
	}

	function addEvent(obj, type, fn){
		if(obj.addEventListener){
			obj.addEventListener(type, fn, false);
		}else if(obj.attachEvent){
			obj.attachEvent("on" + type, fn);
		}else{
			obj["on" + type] = fn;
		}
	}
	function delEvent(obj, type, fn){
		if(window.removeEventListener){
			obj.removeEventListener(type, fn, false);
		}else if(window.detachEvent){
			obj.detachEvent('on'+type,fn);
		}else{
			obj['on'+type] = null;
		}
	}
	var contains = function(a, b){
		if(!a) return false;
		var iscontain = false;
		if(a.contains){
			iscontain = a.contains(b);
		}else{
			iscontain = a.compareDocumentPosition(b) == 20 ? true : false;
		}
		return iscontain;
	}

	var getoffset = function(el){
		if(!el || !el.ownerDocument){return null;}
		var pos = {
			left : 0,
			top : 0
		};
		var box = el.getBoundingClientRect(),
			root = el.ownerDocument,
			body = root.body,
			docelem = root.documentElement,
			clTop = docelem.clientTop || body.clientTop || 0,
			clLeft = docelem.clientLeft || body.clientLeft || 0;
			pos.left = box.left +(self.pageXOffset || boxModel && docelem.scrollLeft || body.scrollLeft) - clLeft;
			pos.top = box.top + (self.pageYOffset || boxModel && docelem.scrollTop || body.scrollTop) -clTop;
		return pos;

	}

	var boxModel = function(){
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";
		document.body.appendChild(div);
		var boxModel = div.offsetWidth === 2;
		document.body.removeChild(div).style.display = "none";
		div = null;
		return boxModel;
	};

	function updateIcoVal(date2){
		var date = new Date();
		var year = date.getFullYear();
		var month= (date.getMonth()+1);
		var days = date.getDate();
		month = month<10 ? '0'+month : month;
		days  = days <10 ? '0'+days  : days;

		date2 = date2.split('-');
		var time1 = year+month+days;
		var time2 = date2.join('');
		var time = time2-time1;
		var html = '';
		if(time>=0 && time<3){
			switch(time){
				case 0:
					html = '今天';
					break;
				case 1:
					html = '明天';
					break;
				case 2:
					html = '后天';
					break;
			}
		}else{
			var weeks = new Date(date2[0],(date2[1]-1),date2[2]);
			var week = weeks.getDay();
			switch(week){
			case 0:
				html = '周日';
				break;
			case 1:
				html = '周一';
				break;
			case 2:
				html = '周二';
				break;
			case 3:
				html = '周三';
				break;
			case 4:
				html = '周四';
				break;
			case 5:
				html = '周五';
				break;
			case 6:
				html = '周六';
				break;
			}
		}
		return html;
	}
//})();
