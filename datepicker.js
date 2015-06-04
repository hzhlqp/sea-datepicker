/*
	jQuery datepicker Plugin
	@name jquery.seadatepicker.js
	@auther hzh 
	@version 1.0.0
	@date 2015/05/
	opts{
		start:[2015, 05, 11],				 //开始日期
		end :[2015, 05, 13],				 //结束日期
		format:"YYYY/MM/DD" OR "YYYY-MM-DD" //日期格式
		lang :lang["zh_CN"],				 //语言
		init:function(){}, 	  	  			 //初始化后回调
		change:function(){}       			 //日期改变时回调

	}
*/
(function($,win,undef){
	var ndate = new Date();
	var nowDate = [ndate.getFullYear(), ndate.getMonth()+1, ndate.getDate()]

	//可自行扩展或抽出 
	var lang = {
		zh_CN: {
			week: ['日','一','二','三','四','五','六'],
			months: ['01','02','03','04','05','06','07','08','09','10','11','12'],
			today: '今天',
			close: '关闭',
			button: '确定',
			timeTitle: '请输入时间'
		}
	};

	//默认参数
	var opts = {
		start 			: null,
		end   			: null,
		format          : "YYYY-MM-DD",
		lang			: lang["zh_CN"],
		init			: null,
		change 			: null	
	}; 

	var datepicker = (function(options) {
		//感觉用原型太丑了，用对象试试
		var myDate = {};

		//初始化
		myDate.init = function () {	
			if($("#sea-datepicker").length > 1){
				 $("#sea-datepicker").show();
			}else{
				var start = this.opts.start || nowDate;
				var end = this.opts.end || nowDate;
				this.bulid(start,end);
				this.bind();
				var $that = this.handler;
				var offset = $that.offset();
				var top = offset.top + $that.height()+4;
				var left = offset.left;	
				$("#sea-datepicker").css({left:left,top:top});	
			}											
		};

		//更新参数
		myDate.update = function (options) {
			$.extend(true, this.opts, options);				
		};

		//解除绑定
		myDate.clear = function () {
			clearTimeout(this.resizeTimer);	
			$("window").unbind('datepicker');
		};

		//绑定日期操作的事件
		myDate.bind = function () {
			var that = this;	
			var sState = false;
			var $sea = $("#sea-datepicker");
			that.handler.focus(function() {
				$sea.show();
			}).blur(function() {
				if(!sState){					
					$sea.hide();
				}
			});

			//有点烦
			$sea.hover(
				function () {
					sState = true;
				},function () {
					sState = false;
				}
			);

			//显示更多年或月
			var mState = false;
			$sea.find(".current").focus(function() {
				$(this).siblings(".current-more").show();
			}).blur(function() {
				var $this = $(this);
				var $more = $this.siblings(".current-more");
				if(!mState){					
					$more.hide();
				}
			});

			//有点烦
			$(".current-more").hover(
				function () {
					mState = true;
				},function () {
					mState = false;
				}
			);

			//选择年
			$sea.find(".more-y li").click(function() {
				var y = $(this).text();	
				$sea.find(".more-y").hide();			
				$sea.find(".current-y").val(y);
				var m = $sea.find(".current-m").val();
				that.change([y, m, 1]);
			});
			//选择月
			$sea.find(".more-m li").click(function() {
				var m = $(this).text();	
				$sea.find(".more-m").hide();			
				$sea.find(".current-m").val(m);
				var y = $sea.find(".current-y").val();
				that.change([y, m, 1]);
			});	

			//年月的增减
			$sea.find(".triangle").click(function() {				
				var $this = $(this);
				var $y = $sea.find(".current-y");				
				var $m = $sea.find(".current-m");
				var y = $y.val();
				var m = $m.val();
				var $current = $this.siblings('.current');	
				var val = parseInt($current.val());			
				if($this.hasClass("triangle-prev")){							
					if($current.hasClass('current-y')){
					    y = val === 1900 ? 1900 : val-1;
					    $y.val(y);
					}else{
						if(val === 1){
							m = 12;
							y = parseInt($y.val())-1;
							$m.val(m);
							$y.val(y);
						}else{
							m = val-1;
							m = (m+"").length === 1 ? "0"+m : m;
							$m.val(m);
						}						
					}						   
				}else{	
					if($current.hasClass('current-y')){
					    y = val === 2099 ? 2099 : val+1;
					    $y.val(y);
					}else{
						if(val === 12){
							m = "01";							
							y = parseInt($y.val())+1;
							$m.val(m);
							$y.val(y);
						}else{
							m = val+1;
							m = (m+"").length === 1 ? "0"+m : m;
							$m.val(m);
						}	
					}	
				}
				$y.val(y);
				$m.val(m);	
				that.change([y, m, 1]);		
			});	

			//年的上下
			$sea.find(".y-list").click(function() {
				var $y = $sea.find(".current-y")
				var y =  $y.val();
				var yhtml = "";
				if($(this).hasClass("y-up")){				
					y = parseInt(y)+14;
					y = y > 2099 ? 2099-6 : y;
					$y.val(y);
					yhtml = that.Years(y);
				}else{
					y = parseInt(y)-14;
					y = y < 1900 ? 1900+7 : y;
					$y.val(y);
					yhtml  = that.Years(y);
				}	
				$sea.find(".more-y ul").remove();	
				$sea.find(".more-y .y-up").after(yhtml);	
				$sea.find(".more-y li").click(function() {
					var y = $(this).text();	
					$sea.find(".more-y").hide();			
					$sea.find(".current-y").val(y);
					var m = $sea.find(".current-m").val();
					that.change([y, m, 1]);
				});	
				mState = true;
			});			

			//清空
			$sea.find(".clear").click(function() {
				that.handler.val("");
				$sea.hide();
			});

			//确认
			$sea.find(".affirm").click(function() {
				var $isStart = $sea.find(".is-start");
				var y = $isStart.attr("y");
				var m = $isStart.attr("m");
				var d = $isStart.attr("d");
				d = (""+d).length === 1 ? "0"+d : d;
				var date = y + "-" + m + "-" +d;
				that.handler.val(date);
				$sea.hide();
			});

			//今天 
			$sea.find(".now").click(function() {
				var y = nowDate[0];
				var m = nowDate[1];
				m = (""+m).length === 1 ? "0"+m : m;
				var d = nowDate[2];
				d = (""+d).length === 1 ? "0"+d : d;
				var date = nowDate[0] + "-" + m + "-" + d;
				$sea.find(".current-y").val(y);
				$sea.find(".current-m").val(m);
				that.handler.val(date);
				$sea.hide();
				var _html = that.Days([y, m, d]);
				$sea.find(".sea-table").empty().append(_html);
				that.select();
			});		

			that.select();	
		};

		//改变年月时调用
		myDate.change = function (arr) {
			var y = arr[0], m = arr[1], d = arr[2];			
			var that = this;
			var $handler = that.handler;
			var change = this.opts.change;
			var $sea = $("#sea-datepicker");
			var _html = that.Days([y, m, d]);
			$sea.find(".sea-table").empty().append(_html);
			that.select();
			if(typeof change === "function"){
				change();
			}
		};

		//绑定日期
		myDate.select = function () {
			var that = this;			
			var $handler = that.handler;
			var $sea = $("#sea-datepicker");
			$sea.find("td:not(.is-void)").click(function() {
				var $this = $(this);
				var split = /-/.test(that.opts.format) ? "-" : "/";			
				var y = m = d = 0;
				y = $this.attr("y");
				m = $this.attr("m");
				d = $this.attr("d");
				d = (d+"").length === 1 ? "0" + d : d;			
				$sea.find(".current-y").val(y);
				$sea.find(".current-m").val(m);
				var date = y+split+m+split+d;
				$handler.val(date);
				$sea.hide();
				var _html = that.Days([y, m, d]);
				$sea.find(".sea-table").empty().append(_html);
				that.select();
			});		
		};

		//判断是否是闰年
		myDate.isleap = function (year) {
			return (year%4 === 0 && year%100 !== 0) || year%400 === 0;
		};

		//日期骨架
		myDate.bulid = function (start, end) {
			var lang = this.opts["lang"];
			month = (start[1]+"").length === 1 ? "0" + start[1] : start[1];
			var months = lang["months"];
			var _html  = '<div id="sea-datepicker">'
				   +'	<div class="sea-header cc">'					
				   +'		<div class="year-cont fl cc">'
				   +'			<a class="triangle triangle-prev fl" href="javascript:;"></a>'
				   +'			<input class="current-y current fl" type="text" readonly value="'+start[0]+'"/>'
				   +'			<a class="triangle triangle-next fl" href="javascript:;"></a>'
				   +'			<div class="more-y current-more hide">'
				   +'				<a class="y-up y-list" href="javascript:;"></a>'
				   + 				this.Years(start[0])
				   +'				<a class="y-down y-list" href="javascript:;"></a>'
				   +'			</div>'
				   +'		</div>'						
				   +'		<div class="month-cont fl cc">'
				   +'			<a class="triangle triangle-prev fl" href="javascript:;"></a>'
				   +'			<input class="current-m current fl" type="text" readonly value="'+month+'"/>'
				   +'			<a class="triangle triangle-next fl" href="javascript:;"></a>'
				   +'			<div class="more-m current-more hide">'
				   +'				<ul>'
				   +'					<li m="1">'+months[0]+'</li>'
				   +'					<li m="2">'+months[1]+'</li>'
				   +'					<li m="3">'+months[2]+'</li>'
				   +'					<li m="4">'+months[3]+'</li>'
				   +'					<li m="5">'+months[4]+'</li>'
				   +'					<li m="6">'+months[5]+'</li>'
				   +'					<li m="7">'+months[6]+'</li>'
				   +'					<li m="8">'+months[7]+'</li>'			
				   +'					<li m="9">'+months[8]+'</li>'
				   +'					<li m="10">'+months[9]+'</li>'
				   +'					<li m="11">'+months[10]+'</li>'
				   +'					<li m="12">'+months[11]+'</li>'
				   +'				</ul>'			
				   +'			</div>'
				   +'		</div>'
				   +'	</div>'
				   +'	<div class="sea-table">'
				   +	this.Days(start)
				   +'	</div>'
				   +'	<div class="sea-btn">'
				   +'	     <a href="javascript:;" class="affirm fr">确认</a>'				  
				   +'	     <a href="javascript:;" class="now fr">今天</a>'
				   +'	     <a href="javascript:;" class="clear fr">清空</a>'
				   +'	</div>'
				   +'</div>';
			$("body").append(_html);

			//初始化调用  （暂时放在这里）
			if(typeof this.opts.init === "function"){
				this.opts.init();	
			}			
		};

		//判断是否 是有效日期	
		myDate.isVoid = function (arr) {
			var y = arr[0],  m= arr[1], d = arr[2];
			var start = this.opts.start, end = this.opts.end;
			var nYear = sYear = sMonth = eMonth = sDay = eDay = false;
			if(start){
				sYear = start[0]; 
				sMonth = start[1]; 
				sDay = start[2];
				if(end){
					eYear = end[0];
					eMonth = end[1]; 
					eDay = end[2];	
					if((y > sYear || (y == sYear &&  m > sMonth) || (y == eYear &&  m== sMonth && d >= sDay)) &&
						(y < eYear || (y == eYear &&  m < eMonth) || (y == eYear &&  m== eMonth && d <= eDay))){
						return false;
					}else{
						return true;
					}	
				}else{
					if(y > sYear || (y == sYear &&  m > sMonth) || (y == sYear &&  m== sMonth && d >= sDay)){
						return false;
					}else{
						return true;
					}
				}
			}else{
				if(end){
					eYear = end[0];
					eMonth = end[1]; 
					eDay = end[2];	
					if(y < eYear || (y == eYear &&  m < eMonth) || (y == eYear &&  m == eMonth && d <= eDay)){
						return false;
					}else{
						return true;
					}
				}else{
					return false;
				}
			}
		};

		//年列表		
		myDate.Years = function (year) {
			var _yhtml = '<ul class="cc">'
			for(var i = year-7; i < year+7; i++) {
				_yhtml += '<li y="'+i+'">'+i+'</li>'
			}
			_yhtml += '</ul>';
			return _yhtml;
		};

		//日列表
		myDate.Days = function (start) {
			var log = {}, Dates={},  dMM = {};
			var nYear = nowDate[0], nMonth = nowDate[1], nDay = nowDate[2];			
			var year = typeof start[0] === "string" ? parseInt(start[0]) : start[0];
			var month = typeof start[1] === "string" ? parseInt(start[1])-1 : start[1]-1;
			var day = start[2] ? start[2] : 1; 	
			var lang = this.opts.lang;
			Dates.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		    Dates.months[1] = this.isleap(year) ? 29 : 28;	
		    log.FDay = new Date(year, month, 1).getDay();
		    log.PDay = Dates.months[month == 0 ? 11 : month - 1] - log.FDay + 1;
		    log.NDay = 1;
		    var _thtml = '<table class="sea-table" id="sea-table">'
		    			+'	 <thead>'
		    			+'		<tr>'
		    			+'			<th>'+lang["week"][0]+'</th>'
		    			+'			<th>'+lang["week"][1]+'</th>'
		    			+'			<th>'+lang["week"][2]+'</th>'
		    			+'			<th>'+lang["week"][3]+'</th>'
		    			+'			<th>'+lang["week"][4]+'</th>'
		    			+'			<th>'+lang["week"][5]+'</th>'
		    			+'			<th>'+lang["week"][6]+'</th>'
		    			+'		</tr>'
		    			+'	  </thead>'
		    			+'	  <tbody>'			    			
		    for(var i = 0; i < 42; i++) {
		    	var YY = year, MM = month + 1, DD, isThis = "";

		    	//根据年月 判断
		    	if(i < log.FDay) {
		    		DD = i + log.PDay;
		    		MM == 1 && (YY -= 1);
		            MM = MM == 1 ? 12 : MM - 1; 
		            isThis = 'class="no-this';
		    	} else if(i >= log.FDay && i < log.FDay + Dates.months[month]) {
		    		DD = i  - log.FDay + 1;	
		    		isThis = 'class="is-this'	    		
		    	} else {
		    		DD = log.NDay++;
		    		MM == 12 && (YY += 1);
		            MM = MM == 12 ? 1 : MM + 1; 
		            isThis = 'class="no-this';
		    	}

		    	
		    	var isVoid = this.isVoid([YY,MM,DD]);	    
		    	if(isVoid) {
		    		 isThis = 'class="is-void'; 	
		    	}else{			    	
			    	var isStart = (YY == year && MM == (month+1) &&  DD == day) ? " is-start" : "";
			    	var isNow = (YY == nYear && MM == nMonth &&  DD == nDay) ? " is-now" : "";
			    	isThis = isThis + isStart + isNow;	
		    	}	  
		    	dMM = (MM+"").length === 1 ? "0"+MM : MM;  	

		    	//判断一行
		    	if((i+1)%7 === 0 ) {
		    		_thtml += '<td y="'+YY+'" m="'+dMM+'" d="'+DD+'" '+isThis+'">'+DD+'</td></tr>'
		    	}else if (i%7 === 0 || i===0){		    		
		    		_thtml += '<tr><td y="'+YY+'" m="'+dMM+'" d="'+DD+'" '+isThis+'">'+DD+'</td>'
		    	}else{
		    		_thtml += '<td y="'+YY+'" m="'+dMM+'" d="'+DD+'" '+isThis+'">'+DD+'</td>'
		    	}			    	
		    }
		    _thtml += '	  </tbody>'
		    	   +'</table>'
		    return _thtml;			  
		};

		//
		function datepicker(handler,options){
			//元素
			this.handler = handler;

			//参数
			this.opts = {};

			//合并参数
			$.extend(true, this.opts, opts, options);
		};	

		datepicker.prototype = myDate;		
		return datepicker;
	})();

	//暴露接口
	$.fn.datepicker = function (options) {
		if(!this.datepickerInstance){
			this.datepickerInstance = new datepicker(this, options || {});
		}else{
			this.datepickerInstance.update(options || {});
		}
		this.datepickerInstance.init();
	};

})(jQuery,window,undefined)
