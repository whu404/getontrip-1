/**
 * @ignore
 * @file detail.js
 * @author fyy
 * @time 15-8-7
 */

define(function(require) {
    var $ = require('jquery');
    require('common/extra/jquery.lazyload');
    require('common/imgSize');

    function init() {

        $(".rich-text img").css('display', 'block').lazyload({
            threshold: 400, 
            container:'.rich-text' 
        });
        $('.bg-img').imgSize({rate:(89/138)});
    }
    return {
        init: init
    };
});