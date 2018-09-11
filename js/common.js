function randomColor() {
	var R = randomInt(0, 255);
	var G = randomInt(0, 255);
	var B = randomInt(0, 255);
	return "rgb(" + R + "," + G + "," + B + ")";
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function textNodefilter(nodelist) {
	var temp = [];
	for (var i = 0; i < nodelist.length; i++) {
		if (nodelist[i].nodeType == 1) {
			temp.push(nodelist[i]);
		}
	}
	return temp;
}
//获取非行内样式
function getStyle(ele) {
	if (ele.currentStyle) {
		return ele.currentStyle; //IE
	} else {
		return getComputedStyle(ele); //非IE
	}
}


(function () {
	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function (classname) {
			var allEle = document.getElementsByTagName("*");
			var temp = [];
			for (var i = 0; i < allEle.length; i++) {
				if (allEle[i].className.indexOf(classname) != -1) {
					temp.push(allEle[i]);
				}
			}
			return temp;
		}
	}
})();



//页面图像定位
//计算一个dom元素的PageX/Y
//循环
function getPagePosition(ele) {
	var left = ele.offsetLeft;
	var top = ele.offsetTop;

	while (ele.offsetParent != null) {
		left += ele.offsetParent.offsetLeft;
		top += ele.offsetParent.offsetTop;

		ele = ele.offsetParent;
	}
	return {
		pageX: left,
		pageY: top
	};
}
//递归
//f(x)=x+f(x.父元素定位)
function getPagePos(ele) {
	if (ele == null) {
		return {
			pageX: 0,
			pageY: 0
		}
	}
	//var page=getPagePos(ele.offsetParent);//替换getPagePos(ele.offsetParent)
	return {
		pageX: ele.offsetLeft + getPagePos(ele.offsetParent).pageX,
		pageY: ele.offsetTop + getPagePos(ele.offsetParent).pageY
	}
}
//事件捕获
//封装事件监听的添加
function capture(ele, eventtype /*事件*/ , fun /*函数*/ , isCapture) {
	if (ele.addEventListener) {
		ele.addEventListener(eventtype, fun, isCapture);
	} else {
		ele.attachEvent("on" + eventtype, fun);
	}
}

//限定一个数字的大小范围
function section(val, min, max) {
	return Math.max(min, Math.min(max, val));
}

//------------Cookie封装----------------------


//expires的单位是秒
function setCookie(key, value, expires, path) {
	switch (arguments.length) {
		case 0:
		case 1:
			throw new Error("传参错了，重输一次！！！");
		case 2:
			{
				document.cookie = key + "=" + value;
				break;
			}
		case 3:
			{
				var nam = arguments[2];
				if (typeof nam == "number") {
					var d = new Date();
					d.setSeconds(d.getSeconds() + nam);
					document.cookie = key + "=" + value + ";expires=" + d;
				} else if (typeof nam == "string") {
					document.cookie = key + "=" + value + ";path=" + nam;
				}
				break;
			}
		case 4:
			{
				var d = new Date();
				d.setSeconds(d.getSeconds() + nam);
				document.cookie = key + "=" + value + ";expires=" + d + ";path=" + path;
			}
	}
}

//
function getCookie(key) {
	var str = document.cookie;
	var list = str.split("; ");
	for (var i = 0; i < list.length; i++) {
		var kvs = list[i].split("=");
		if (kvs[0] == key) {
			return kvs[1];
		}
	}
	/*
	var res = list.filter(function(item){
		var kv = item.split("=");
		return kv[0] == key; 
	});
	return res[0].split("=")[1];
	*/
	return null;
}

//元素的运动缓冲
//animate( obj, {left: 300, width: 400})
function animate(ele /*元素*/ , option /*元素属性，是一个对象，对象的值为百分制*/ , callback) {
	if (ele.isMoving) return;

	ele.isMoving = true;
	//遍历对象
	for (var i in option) {
		//自调用函数
		(function (prop) {
			//设定终点距离
			var end = option[prop];
			//设定时器,ele[prop+"-timer"]:元素中的遍历出的每一个属性
			ele[prop + "-timer"] = setInterval(function () {
				//判断是不是opacity透明度属性
				if (prop == "opacity") {
					//定义变量并赋值当前元素的透明度数值并转为百分制
					var currentValue = getStyle(ele)[prop] * 100;
					//定义变量,算出速度,用终点数值减去当前已进行的数值在除以8,得到每次前进的数值
					var speed = (end - currentValue) / 8;
					//判断speed变量是否大于0
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					//将逐渐进行的数值,依次转为浮点数,在添加到元素中
					// 					ele.style[prop] = (currentValue + speed) / 100;
					// 					//判断该当该元素值已经超过或者等于设定的终点数值时,结束定时器
					// 					//一般来说,由于前面已经向上或向下取整了,所以一般不会出现超过终点值的情况
					// 					if ("opacity" >= end) {
					// 						clearInterval(ele[opacity + "-timer"]);
					// 					}
					ele.style.opacity = (currentValue + speed) / 100;
					ele.style.filter = "alpha(opacity=" + (currentValue + speed) + ")"
					if (ele.style.opacity == end / 100) {
						clearInterval(ele["opacity-timer"]);
						if (isAllover()) {
							callback ? callback() : "";
						}
					}

				} else {
					//定义变量并赋值当前元素的值并取整
					var currentValue = parseInt(getStyle(ele)[prop]);
					//定义变量,算出速度,用终点距离减去当前已进行的鞠丽丽在除以8,得到每次前进的距离
					var speed = (end - currentValue) / 8;
					//判断speed变量是否大于0
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
					//将每次前进的距离依次添加到元素中
					ele.style[prop] = currentValue + speed + "px";
					// 					//判断该当该元素值已经超过或者等于设定的终点数值时,结束定时器
					// 					//一般来说,由于前面已经向上或向下取整了,所以一般不会出现超过终点值的情况
					// 					if (parseInt(getStyle(ele)[prop]) >= end) {
					// 						clearInterval(ele[prop + "-timer"]);
					// 					}
					if (parseInt(getStyle(ele)[prop]) == end) {
						clearInterval(ele[prop + "-timer"]);
						if (isAllover()) {
							callback ? callback() : "";
						}
					}
				}
			}, 30)
		})(i);
	}

	function isAllover() {
		var flag = true;
		for (var attr in option) {
			var end = option[attr];
			var curtVal = parseInt(getStyle(ele)[attr]);
			if (attr == "opacity") {
				curtVal = getStyle(ele)[attr] * 100;
			}
			if (curtVal != end) {
				flag = false;
				return flag;
			}
		}
		ele.isMoving = false;
		return flag;
	}
}

//判断某年份是否为闰年
function isLeapYear(year) {
	return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
}


//将日期格式化输出 “2015-08-24”
function date2string(date, sep) {
	var sep = sep || "-";

	var m = date.getMonth() + 1;
	var d = date.getDate();
	return date.getFullYear() + sep + (m < 10 ? "0" + m : m) + sep + (d < 10 ? "0" + d : d);
}

date2string(new Date())

//获得某个月份的天数
function getDaysByMonth(month, year) {
	year = year || new Date().getFullYear();

	if (!month || typeof month != "number") {
		console.error("参数必须为数字类型！");
		return;
	}
	if (!(month > 0 && month < 13)) {
		console.error("月份必须在1-12之间");
		return;
	}
	month = Math.round(month);

	switch (month) {
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return 31;
		case 2:
			return (isLeapYear(year) ? 29 : 28);
		case 4:
		case 6:
		case 9:
		case 11:
			return 30;
	}
}


//将字符串转换为日期
function string2Date(datestr, sep) {

	if (!sep || !(datestr && datestr.length >= 8)) {
		console.error("字符串格式错误！不能解析");
		return;
	}

	var list = datestr.split(sep);
	if (!(list[0].length == 4 && list[1] > 0 && list[1] < 13 && list[2] > 0 && list[2] < 32)) {
		console.error("字符串格式错误！不能解析");
		return;
	}
	return new Date(datestr);
}


//判断两个日期相差的天数
function getDaysBetweenMonths(d1, d2) {
	if (!(d1 instanceof Date && d2 instanceof Date)) {
		console.error("参数传错了！重来！");
		return;
	}
	var dis = Math.abs(d1.getTime() - d2.getTime());
	return (dis / 1000 / 3600 / 24).toFixed(2);
}


//获得N天以后的日期(string/date)
function getAfterDay(n) {
	var now = new Date();
	now.setDate(now.getDate() + n);
	return date2string(now);
}

function throttle(callback, duration, context){
	var lasttime = 0;
	return function(e){
		var now = new Date().getTime();
		if(now - lasttime > duration) {
			lasttime = new Date().getTime();
			callback.call(context, e);
		}
	}
}

function debounce(callback, delay=300, context){
	var t = null;
	return function(e){
		clearTimeout(t);
		t = setTimeout(()=>{
			callback.call(context, e);
		}, delay);
	}
}