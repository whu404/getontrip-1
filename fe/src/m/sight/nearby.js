 /**
  * @ignore
  * @file nearby.js
  * @author fanyy(1178223444@qq.com)
  * @time 15-1-15
  */

 define(function(require) {
     var $ = require('jquery');
     var common = require('common/mcommon');
     // var moment = require('moment');
     var etpl = require('etpl');
     var tpl = require('./list.tpl');

     var Remoter = require('common/Remoter');


     var getSightList = new Remoter('SIGHT_LIST');
     var IScroll = require('common/iscroll');
     var myScroll,
         pullDownEl, pullDownOffset,
         pullUpEl, pullUpOffset,
         generatedCount = 0;
     var currentPage = 1;
     var html = '';

     function init(acenter, alist) {
         common.init();
         htmlContainer = $('#sight_list');
         etpl.compile(tpl);
         bindEvents.init();
     }

     /*
      *绑定事件
      */
     var bindEvents = {
         init: function() {
             this.initMap();
             this.inintScroll();
             this.initClick();
         },
         initMap: function() {
             //加载地图，调用浏览器定位服务
             map = new AMap.Map('container', {
                 resizeEnable: true
             });
             map.plugin('AMap.Geolocation', function() {
                 geolocation = new AMap.Geolocation({
                     enableHighAccuracy: true, //是否使用高精度定位，默认:true
                     timeout: 10000, //超过10秒后停止定位，默认：无穷大
                     buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                     zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                     buttonPosition: 'RB'
                 });
                 map.addControl(geolocation);
                 geolocation.getCurrentPosition();
                 AMap.event.addListener(geolocation, 'complete', bindEvents.onComplete); //返回定位信息
                 AMap.event.addListener(geolocation, 'error', bindEvents.onError); //返回定位出错信息
             });
         },
         onComplete: function(data) {
             //解析定位结果 
             params = {
                     page: currentPage,
                     pageSize: 15,
                     x: data.position.getLng(),
                     y: data.position.getLat()
                 }
                 //保存cookies
                 /*  common.COOKIES.setCookie("x", params.x, "d1");
                   common.COOKIES.setCookie("y", params.y, "d1");*/
             getRemoteList.getNearByList(params);
         },
         onError: function(data) {
             //解析定位错误信息
             $('#sight_list').html('<div class="error-text">啊哦，定位失败!<a href="javascript:void(0)" class="refresh-btn"  onclick="location.reload();">&nbsp</a></div>');

         },
         inintScroll: function() {

             myScroll = new IScroll('#wrapper', {
                 probeType: 2,
                 bindToWrapper: true,
                 scrollY: true,
                 mouseWheel: true,
                 click: true
             });
             common.myScrollEvents(myScroll, bindEvents.pullUpAction, bindEvents.pullDownAction);

             setTimeout(function() {
                 document.getElementById('wrapper').style.left = '0';
             }, 800);
             document.addEventListener('touchmove', function(e) {
                 e.preventDefault();
             }, false);
         },
         pullUpAction: function() {
             //向上滑动加载列表
             currentPage++;
             params.page = currentPage;
             getRemoteList.getNearByList(params);
             myScroll.refresh(); //刷新滚动框
         },
         pullDownAction: function() {
             //下拉加载最新数据
             getRemoteList.getNearByList(params);
             myScroll.refresh();
         },
         initClick: function() {
             
         }


     };

     /**
      * 发送请求
      * @param  {[type]} page [页码]
      * @return {[type]}      [description]
      */
     var getRemoteList = {
         getNearByList: function(data) {
             // 附近景点列表
             getSightList.remote(data);
             //成功
             getSightList.on('success', function(data) {
                 ajaxCallbackfun(data, "returnSightNearbyList");
             });

         }
     };


     /**
      * ajax返回后执行的函数
      * @param  {[type]} data    [ajax数据]
      * @param  {[type]} tpl     [模板名称] 
      * @return {[type]}         [description]
      */
     var ajaxCallbackfun = function(data, tpl) {
         if (data.bizError) {
             renderError(data);
         } else {
             var pullUpEl = document.getElementById('pullUp');
             if (!data.length && currentPage == 1) {
                 htmlContainer.html(etpl.render('Error', {
                     msg: '您当前没有数据哟'
                 }));
                 return;
             }
             if (!data.length && currentPage > 1) {
                 //下拉没有更多啦
                 pullUpEl.className = '';
                 pullUpEl.querySelector('.pullUpLabel').innerHTML = '全部加载完毕';

             } else {
                 renderHTML(tpl, data);
                 //刷新myScroll
                 setTimeout(function() {
                     myScroll.refresh();
                 }, 0);
             }
         }
     }

     /**
      * 渲染页面
      * @param {string} tpl 模板target
      * @param {*} data 请求返回数据
      */
     var renderHTML = function(tpl, data) {
         // 格式化数据
         for (var i = 0, l = data.length; i < l; i++) {
             data[i].contentNum = data[i].param1.replace(/[^0-9]/ig, "");
             data[i].comment = data[i].param2.replace(/[^0-9]/ig, "");
             data[i].collect = data[i].param3.replace(/[^0-9]/ig, "");
         }

         if (currentPage == 1) {
             html = etpl.render(tpl, {
                 list: data
             });
         } else {
             html = html + etpl.render(tpl, {
                 list: data
             });
         }
         htmlContainer.html(html);
     }

     /**
      * 渲染错误提示
      * @param {*} data 请求返回的错误提示
      */
     var renderError = function(data) {
         htmlContainer.render(etpl.render('Error', {
             msg: data.statusInfo
         }));
     }


     return {
         init: init
     };
 });
