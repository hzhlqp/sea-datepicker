# sea-datepicker

##用例

`$(function(){
	$(".date").datepicker({
		start:[2015,6,3],
		end:[2015,7,18],
		init:function(){
			console.log("init");
		},
		change:function() {
			console.log("change");
		},
		format:"YYYY/MM/DD"
	});
});`

##option

* start
开始时间
* end
结束时间
* init
初始化执行
* change
日期改变时执行
* form
日期格式


##授权协议

免费，且开源，基于LGPL协议。

