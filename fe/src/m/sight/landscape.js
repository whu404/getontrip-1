/**
 * @ignore
 * @file map.js
 * @author fanyy(1178223444@qq.com)
 * @time 15-1-11
 */

define(function(require) {
    var $ = require('jquery');
    require('common/extra/jplayer/jquery.jplayer');
    var IScroll = require('common/iscroll');
    var myScroll;

    function init(data) {
        audio = data;
        bindEvents.init();
        
    }
    var bindEvents = {
        init: function() { 
                this.initPlayer(); 
            this.limitText();
            //this.inintScroll();
        },
        initPlayer: function() {
            if (!audio) {
                $("#jPlayerBox,#jp_container_1").hide();
                return;
            } 
            $("#jPlayerBox").jPlayer({
                ready: function() {
                    $(this).jPlayer("setMedia", {
                        title: "Bubble",
                        mp3: '/audio/' + audio
                    }).jPlayer('play');
                },
                cssSelectorAncestor: '#jp_container_1',
                swfPath: '../common/extra/jplayer',
                supplied: "mp3",
                wmode: "window",
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: false,
                remainingDuration: false,
                toggleDuration: false,
            });
        },
        limitText: function() {
            //字数限制  
            $.fn.limitText = function(opts) {
                var defaults = {
                    maxNumber: 140, //允许输入的最大字数   
                    more: 'more',
                    onOk: function() {},
                    onOver: function() {}
                }
                var option = $.extend(defaults, opts);
                //处理输入的内容是文字还是字母的函数
                var getLength = function(str) {
                    return String(str).replace(/[^\x00-\xff]/g, 'aa').length;
                };
                this.each(function() {
                    var _this = $(this);
                    var fn = function() {
                        //Math函数向上取值
                        var alredyNumber = Math.ceil(getLength(_this.html()) / 2);
                        var extraNumber = option.maxNumber - alredyNumber;
                        var $more = $('.' + option.more);
                        if (extraNumber >= 0) {
                            option.onOk();
                        } else {
                            option.onOver();
                        }
                    };
                    fn();
                });


            }

            $('.content').limitText({
                maxNumber: 360,
                onOk: function() {
                    $('.more').hide();
                },
                onOver: function() {
                    $('.content').css({
                        'height': ($('#wrapper').height() - 126) + 'px',
                        'overflow': 'hidden'
                    });
                    $('.more').show();
                }
            });

            $('#wrapper').delegate('.more', 'click', function(event) {
                $('.content').css({
                    'height': '100%',
                    'overflow': 'scroll'
                });
                $(this).hide();
            });
        },
        inintScroll: function() { 
             myScroll = new IScroll('#wrapper', {
                 probeType: 2,
                 bindToWrapper: true,
                 scrollY: true,
                 mouseWheel: true,
                 click: false
             }); 
             setTimeout(function() {
                 document.getElementById('wrapper').style.left = '0';
             }, 800);
             document.addEventListener('touchmove', function(e) {
                 e.preventDefault();
             }, false);
         },
    };

    return {
        init: init
    };
});
