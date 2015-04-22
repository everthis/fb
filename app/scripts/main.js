$("body").on('mouseover', ".order_menu .menu", function(event) {
	event.preventDefault();
	/* Act on the event */
	$(".order_menu .submenu").removeClass('hide');
	$(this).addClass('white_bg');
});
$("body").on('mouseleave', ".order_menu .menu", function(event) {
	event.preventDefault();
	/* Act on the event */
	$(".order_menu .submenu").addClass('hide');
	$(this).removeClass('white_bg');
});

$("body").on('click', '.query_menu  .menu_item', function (event) {
    event.preventDefault();
    $(".query_menu  .menu_item").removeClass('active');
    $(this).addClass('active');
    var _category = $(this).attr('class').split(' ')[1];
    var $ori_dest = $(".query_form > .ori_dest");
    $ori_dest.removeClass('on').addClass('hide');
    for (var i = $ori_dest.length - 1; i >= 0; i--) {
    	if ($ori_dest.eq(i).hasClass(_category)) {
    		$ori_dest.eq(i).removeClass('hide').addClass('on');
    	};
    };

});


$("#train_from").css('color', '#999').val("请输入出发站");
$("#train_to").css('color', '#999').val("请输入到达站");

function startTime() {

    m = checkTime("#train_from", "请输入出发站", "");
    s = checkTime("#train_to", "请输入到达站", "");

    a = checkTime("#to_city", "请输入到达城市", "");
    b = checkTime("#from_city", "请输入出发城市", "");

    var t = setTimeout(function () { startTime() }, 10);
}

function checkTime(ele, text_one, text_two) {

    var $ele = $(ele);
    if ($ele.val() == text_one || $ele.val() == text_two) {
        $ele.css({
            'color': '#999',
            'font-size': '14px'
        });
    } else {
        $ele.css({
            'color': '#000',
            'font-size': '14px'
        });
    };
}
startTime();


$('.add_address').click(function(event) {
    $(".popup_address").removeClass('hide');
});

$('input[value="取消"]').click(function(event) {
    $(".popup_address").addClass('hide');
});

$('.passenger_list > .add_passenger_btn').click(function(event) {
    $(".popup_passenger").removeClass('hide');
});

$('input[value="取消"]').click(function(event) {
    $(".popup_passenger").addClass('hide');
});

        $("#btnsubmit").click(function(event) {
          var $ori_dest = $('#Form1 > .on');
          var _origin_code, _dest_code, _origin_name, _dest_name, _date, str, _query_type;
          if ($ori_dest.hasClass('train')) {
            _origin_code = $("#train_from_code").val();
            _origin_name = $("#train_from").val();
            _dest_code = $("#train_to_code").val();
            _dest_name = $("#train_to").val();
            _date = $("#wangdate").val();
            str = "?origin_code=" + _origin_code + "&origin_name=" + _origin_name + "&dest_code=" + _dest_code + "&dest_name=" + _dest_name + "&date=" + _date;
            window.location.href ="train_query.html" + str;
          } else if($ori_dest.hasClass('coach')) {
            _origin_name = $("#from_city").val();
            _origin_code = $("#from_city_code").val();
            _dest_name = $("#to_city").val();
            _dest_code = $("#to_city_code").val();
            _date = $("#wangdate").val();
            _query_type = 1;
            str = "?origin_code=" + _origin_code + "&origin_name=" + _origin_name + "&dest_code=" + _dest_code + "&dest_name=" + _dest_name + "&date=" + _date + "&query_type=" + _query_type;
            window.location.href ="coach_query.html" + str;

          };
        });

        $(".login_header span").on('click', function(event) {
            event.preventDefault();
            /* Act on the event */
            $(".login_header span").removeClass('active');
            $(this).addClass('active');
            if ($(this).hasClass('pwd')) {
                $(".login_header").removeClass('reverse');
                $(".val_code_login").addClass('hide');
                $(".pwd_login").removeClass('hide');
            } else{
                $(".login_header").addClass('reverse');
                $(".val_code_login").removeClass('hide');
                $(".pwd_login").addClass('hide');
            };
        });

        $('.pop_btn').click(function(event) {
            $(".shadow").removeClass('hide').css('z-index', '999'); ;
            $('div[class^="popup_"]').removeClass('hide').css('z-index', '9999'); ;
        });
                $('.close').click(function(event) {
                    $(this).parent().parent('div[class^="popup_"]').prev('.shadow').addClass('hide');
            // $(".shadow").addClass('hide');
            $(this).parent().parent('div[class^="popup_"]').addClass('hide');
        });