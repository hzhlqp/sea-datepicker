# sea-datepicker
遵循LGPL协议，欢迎大家使用，也希望大家能积极的给意见

$(".date").datepicker(function(){
    	start:[2015,6,3],
		end:[2015,7,18],
		init:function(){
			console.log("init");
		},
		change:function() {
			console.log("change");
		},
		format:"YYYY/MM/DD"
})
