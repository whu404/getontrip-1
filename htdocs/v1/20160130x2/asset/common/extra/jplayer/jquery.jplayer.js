(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('common/extra/jplayer/jquery.jplayer', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        if (root.jQuery) {
            factory(root.jQuery);
        } else {
            factory(root.Zepto);
        }
    }
}(this, function ($, undefined) {
    $.fn.jPlayer = function (options) {
        var name = 'jPlayer';
        var isMethodCall = typeof options === 'string', args = Array.prototype.slice.call(arguments, 1), returnValue = this;
        options = !isMethodCall && args.length ? $.extend.apply(null, [
            true,
            options
        ].concat(args)) : options;
        if (isMethodCall && options.charAt(0) === '_') {
            return returnValue;
        }
        if (isMethodCall) {
            this.each(function () {
                var instance = $(this).data(name), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : instance;
                if (methodValue !== instance && methodValue !== undefined) {
                    returnValue = methodValue;
                    return false;
                }
            });
        } else {
            this.each(function () {
                var instance = $(this).data(name);
                if (instance) {
                    instance.option(options || {});
                } else {
                    $(this).data(name, new $.jPlayer(options, this));
                }
            });
        }
        return returnValue;
    };
    $.jPlayer = function (options, element) {
        if (arguments.length) {
            this.element = $(element);
            this.options = $.extend(true, {}, this.options, options);
            var self = this;
            this.element.bind('remove.jPlayer', function () {
                self.destroy();
            });
            this._init();
        }
    };
    if (typeof $.fn.stop !== 'function') {
        $.fn.stop = function () {
        };
    }
    $.jPlayer.emulateMethods = 'load play pause';
    $.jPlayer.emulateStatus = 'src readyState networkState currentTime duration paused ended playbackRate';
    $.jPlayer.emulateOptions = 'muted volume';
    $.jPlayer.reservedEvent = 'ready flashreset resize repeat error warning';
    $.jPlayer.event = {};
    $.each([
        'ready',
        'setmedia',
        'flashreset',
        'resize',
        'repeat',
        'click',
        'error',
        'warning',
        'loadstart',
        'progress',
        'suspend',
        'abort',
        'emptied',
        'stalled',
        'play',
        'pause',
        'loadedmetadata',
        'loadeddata',
        'waiting',
        'playing',
        'canplay',
        'canplaythrough',
        'seeking',
        'seeked',
        'timeupdate',
        'ended',
        'ratechange',
        'durationchange',
        'volumechange'
    ], function () {
        $.jPlayer.event[this] = 'jPlayer_' + this;
    });
    $.jPlayer.htmlEvent = [
        'loadstart',
        'abort',
        'emptied',
        'stalled',
        'loadedmetadata',
        'canplay',
        'canplaythrough'
    ];
    $.jPlayer.pause = function () {
        $.jPlayer.prototype.destroyRemoved();
        $.each($.jPlayer.prototype.instances, function (i, element) {
            if (element.data('jPlayer').status.srcSet) {
                element.jPlayer('pause');
            }
        });
    };
    $.jPlayer.timeFormat = {
        showHour: false,
        showMin: true,
        showSec: true,
        padHour: false,
        padMin: true,
        padSec: true,
        sepHour: ':',
        sepMin: ':',
        sepSec: ''
    };
    var ConvertTime = function () {
        this.init();
    };
    ConvertTime.prototype = {
        init: function () {
            this.options = { timeFormat: $.jPlayer.timeFormat };
        },
        time: function (s) {
            s = s && typeof s === 'number' ? s : 0;
            var myTime = new Date(s * 1000), hour = myTime.getUTCHours(), min = this.options.timeFormat.showHour ? myTime.getUTCMinutes() : myTime.getUTCMinutes() + hour * 60, sec = this.options.timeFormat.showMin ? myTime.getUTCSeconds() : myTime.getUTCSeconds() + min * 60, strHour = this.options.timeFormat.padHour && hour < 10 ? '0' + hour : hour, strMin = this.options.timeFormat.padMin && min < 10 ? '0' + min : min, strSec = this.options.timeFormat.padSec && sec < 10 ? '0' + sec : sec, strTime = '';
            strTime += this.options.timeFormat.showHour ? strHour + this.options.timeFormat.sepHour : '';
            strTime += this.options.timeFormat.showMin ? strMin + this.options.timeFormat.sepMin : '';
            strTime += this.options.timeFormat.showSec ? strSec + this.options.timeFormat.sepSec : '';
            return strTime;
        }
    };
    var myConvertTime = new ConvertTime();
    $.jPlayer.convertTime = function (s) {
        return myConvertTime.time(s);
    };
    $.jPlayer.uaBrowser = function (userAgent) {
        var ua = userAgent.toLowerCase();
        var rwebkit = /(webkit)[ \/]([\w.]+)/;
        var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
        var rmsie = /(msie) ([\w.]+)/;
        var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf('compatible') < 0 && rmozilla.exec(ua) || [];
        return {
            browser: match[1] || '',
            version: match[2] || '0'
        };
    };
    $.jPlayer.uaPlatform = function (userAgent) {
        var ua = userAgent.toLowerCase();
        var rplatform = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/;
        var rtablet = /(ipad|playbook)/;
        var randroid = /(android)/;
        var rmobile = /(mobile)/;
        var platform = rplatform.exec(ua) || [];
        var tablet = rtablet.exec(ua) || !rmobile.exec(ua) && randroid.exec(ua) || [];
        if (platform[1]) {
            platform[1] = platform[1].replace(/\s/g, '_');
        }
        return {
            platform: platform[1] || '',
            tablet: tablet[1] || ''
        };
    };
    $.jPlayer.browser = {};
    $.jPlayer.platform = {};
    var browserMatch = $.jPlayer.uaBrowser(navigator.userAgent);
    if (browserMatch.browser) {
        $.jPlayer.browser[browserMatch.browser] = true;
        $.jPlayer.browser.version = browserMatch.version;
    }
    var platformMatch = $.jPlayer.uaPlatform(navigator.userAgent);
    if (platformMatch.platform) {
        $.jPlayer.platform[platformMatch.platform] = true;
        $.jPlayer.platform.mobile = !platformMatch.tablet;
        $.jPlayer.platform.tablet = !!platformMatch.tablet;
    }
    $.jPlayer.getDocMode = function () {
        var docMode;
        if ($.jPlayer.browser.msie) {
            if (document.documentMode) {
                docMode = document.documentMode;
            } else {
                docMode = 5;
                if (document.compatMode) {
                    if (document.compatMode === 'CSS1Compat') {
                        docMode = 7;
                    }
                }
            }
        }
        return docMode;
    };
    $.jPlayer.browser.documentMode = $.jPlayer.getDocMode();
    $.jPlayer.nativeFeatures = {
        init: function () {
            var d = document, v = d.createElement('video'), spec = {
                    w3c: [
                        'fullscreenEnabled',
                        'fullscreenElement',
                        'requestFullscreen',
                        'exitFullscreen',
                        'fullscreenchange',
                        'fullscreenerror'
                    ],
                    moz: [
                        'mozFullScreenEnabled',
                        'mozFullScreenElement',
                        'mozRequestFullScreen',
                        'mozCancelFullScreen',
                        'mozfullscreenchange',
                        'mozfullscreenerror'
                    ],
                    webkit: [
                        '',
                        'webkitCurrentFullScreenElement',
                        'webkitRequestFullScreen',
                        'webkitCancelFullScreen',
                        'webkitfullscreenchange',
                        ''
                    ],
                    webkitVideo: [
                        'webkitSupportsFullscreen',
                        'webkitDisplayingFullscreen',
                        'webkitEnterFullscreen',
                        'webkitExitFullscreen',
                        '',
                        ''
                    ],
                    ms: [
                        '',
                        'msFullscreenElement',
                        'msRequestFullscreen',
                        'msExitFullscreen',
                        'MSFullscreenChange',
                        'MSFullscreenError'
                    ]
                }, specOrder = [
                    'w3c',
                    'moz',
                    'webkit',
                    'webkitVideo',
                    'ms'
                ], fs, i, il;
            this.fullscreen = fs = {
                support: {
                    w3c: !!d[spec.w3c[0]],
                    moz: !!d[spec.moz[0]],
                    webkit: typeof d[spec.webkit[3]] === 'function',
                    webkitVideo: typeof v[spec.webkitVideo[2]] === 'function',
                    ms: typeof v[spec.ms[2]] === 'function'
                },
                used: {}
            };
            for (i = 0, il = specOrder.length; i < il; i++) {
                var n = specOrder[i];
                if (fs.support[n]) {
                    fs.spec = n;
                    fs.used[n] = true;
                    break;
                }
            }
            if (fs.spec) {
                var s = spec[fs.spec];
                fs.api = {
                    fullscreenEnabled: true,
                    fullscreenElement: function (elem) {
                        elem = elem ? elem : d;
                        return elem[s[1]];
                    },
                    requestFullscreen: function (elem) {
                        return elem[s[2]]();
                    },
                    exitFullscreen: function (elem) {
                        elem = elem ? elem : d;
                        return elem[s[3]]();
                    }
                };
                fs.event = {
                    fullscreenchange: s[4],
                    fullscreenerror: s[5]
                };
            } else {
                fs.api = {
                    fullscreenEnabled: false,
                    fullscreenElement: function () {
                        return null;
                    },
                    requestFullscreen: function () {
                    },
                    exitFullscreen: function () {
                    }
                };
                fs.event = {};
            }
        }
    };
    $.jPlayer.nativeFeatures.init();
    $.jPlayer.focus = null;
    $.jPlayer.keyIgnoreElementNames = 'A INPUT TEXTAREA SELECT BUTTON';
    var keyBindings = function (event) {
        var f = $.jPlayer.focus, ignoreKey;
        if (f) {
            $.each($.jPlayer.keyIgnoreElementNames.split(/\s+/g), function (i, name) {
                if (event.target.nodeName.toUpperCase() === name.toUpperCase()) {
                    ignoreKey = true;
                    return false;
                }
            });
            if (!ignoreKey) {
                $.each(f.options.keyBindings, function (action, binding) {
                    if (binding && $.isFunction(binding.fn) && (typeof binding.key === 'number' && event.which === binding.key || typeof binding.key === 'string' && event.key === binding.key)) {
                        event.preventDefault();
                        binding.fn(f);
                        return false;
                    }
                });
            }
        }
    };
    $.jPlayer.keys = function (en) {
        var event = 'keydown.jPlayer';
        $(document.documentElement).unbind(event);
        if (en) {
            $(document.documentElement).bind(event, keyBindings);
        }
    };
    $.jPlayer.keys(true);
    $.jPlayer.prototype = {
        count: 0,
        version: {
            script: '2.9.2',
            needFlash: '2.9.0',
            flash: 'unknown'
        },
        options: {
            swfPath: 'js',
            solution: 'html, flash',
            supplied: 'mp3',
            auroraFormats: 'wav',
            preload: 'metadata',
            volume: 0.8,
            muted: false,
            remainingDuration: false,
            toggleDuration: false,
            captureDuration: true,
            playbackRate: 1,
            defaultPlaybackRate: 1,
            minPlaybackRate: 0.5,
            maxPlaybackRate: 4,
            wmode: 'opaque',
            backgroundColor: '#000000',
            cssSelectorAncestor: '#jp_container_1',
            cssSelector: {
                videoPlay: '.jp-video-play',
                play: '.jp-play',
                pause: '.jp-pause',
                stop: '.jp-stop',
                seekBar: '.jp-seek-bar',
                playBar: '.jp-play-bar',
                playBall: '.jp-play-ball',
                mute: '.jp-mute',
                unmute: '.jp-unmute',
                volumeBar: '.jp-volume-bar',
                volumeBarValue: '.jp-volume-bar-value',
                volumeMax: '.jp-volume-max',
                playbackRateBar: '.jp-playback-rate-bar',
                playbackRateBarValue: '.jp-playback-rate-bar-value',
                currentTime: '.jp-current-time',
                duration: '.jp-duration',
                title: '.jp-title',
                fullScreen: '.jp-full-screen',
                restoreScreen: '.jp-restore-screen',
                repeat: '.jp-repeat',
                repeatOff: '.jp-repeat-off',
                gui: '.jp-gui',
                noSolution: '.jp-no-solution'
            },
            stateClass: {
                playing: 'jp-state-playing',
                seeking: 'jp-state-seeking',
                muted: 'jp-state-muted',
                looped: 'jp-state-looped',
                fullScreen: 'jp-state-full-screen',
                noVolume: 'jp-state-no-volume'
            },
            useStateClassSkin: false,
            autoBlur: true,
            smoothPlayBar: false,
            fullScreen: false,
            fullWindow: false,
            autohide: {
                restored: false,
                full: true,
                fadeIn: 200,
                fadeOut: 600,
                hold: 1000
            },
            loop: false,
            repeat: function (event) {
                if (event.jPlayer.options.loop) {
                    $(this).unbind('.jPlayerRepeat').bind($.jPlayer.event.ended + '.jPlayer.jPlayerRepeat', function () {
                        $(this).jPlayer('play');
                    });
                } else {
                    $(this).unbind('.jPlayerRepeat');
                }
            },
            nativeVideoControls: {},
            noFullWindow: {
                msie: /msie [0-6]\./,
                ipad: /ipad.*?os [0-4]\./,
                iphone: /iphone/,
                ipod: /ipod/,
                android_pad: /android [0-3]\.(?!.*?mobile)/,
                android_phone: /(?=.*android)(?!.*chrome)(?=.*mobile)/,
                blackberry: /blackberry/,
                windows_ce: /windows ce/,
                iemobile: /iemobile/,
                webos: /webos/
            },
            noVolume: {
                ipad: /ipad/,
                iphone: /iphone/,
                ipod: /ipod/,
                android_pad: /android(?!.*?mobile)/,
                android_phone: /android.*?mobile/,
                blackberry: /blackberry/,
                windows_ce: /windows ce/,
                iemobile: /iemobile/,
                webos: /webos/,
                playbook: /playbook/
            },
            timeFormat: {},
            keyEnabled: false,
            audioFullScreen: false,
            keyBindings: {
                play: {
                    key: 80,
                    fn: function (f) {
                        if (f.status.paused) {
                            f.play();
                        } else {
                            f.pause();
                        }
                    }
                },
                fullScreen: {
                    key: 70,
                    fn: function (f) {
                        if (f.status.video || f.options.audioFullScreen) {
                            f._setOption('fullScreen', !f.options.fullScreen);
                        }
                    }
                },
                muted: {
                    key: 77,
                    fn: function (f) {
                        f._muted(!f.options.muted);
                    }
                },
                volumeUp: {
                    key: 190,
                    fn: function (f) {
                        f.volume(f.options.volume + 0.1);
                    }
                },
                volumeDown: {
                    key: 188,
                    fn: function (f) {
                        f.volume(f.options.volume - 0.1);
                    }
                },
                loop: {
                    key: 76,
                    fn: function (f) {
                        f._loop(!f.options.loop);
                    }
                }
            },
            verticalVolume: false,
            verticalPlaybackRate: false,
            globalVolume: false,
            idPrefix: 'jp',
            noConflict: 'jQuery',
            emulateHtml: false,
            consoleAlerts: true,
            errorAlerts: false,
            warningAlerts: false
        },
        optionsAudio: {
            size: {
                width: '0px',
                height: '0px',
                cssClass: ''
            },
            sizeFull: {
                width: '0px',
                height: '0px',
                cssClass: ''
            }
        },
        optionsVideo: {
            size: {
                width: '480px',
                height: '270px',
                cssClass: 'jp-video-270p'
            },
            sizeFull: {
                width: '100%',
                height: '100%',
                cssClass: 'jp-video-full'
            }
        },
        instances: {},
        status: {
            src: '',
            media: {},
            paused: true,
            format: {},
            formatType: '',
            waitForPlay: true,
            waitForLoad: true,
            srcSet: false,
            video: false,
            seekPercent: 0,
            currentPercentRelative: 0,
            currentPercentAbsolute: 0,
            currentTime: 0,
            duration: 0,
            remaining: 0,
            videoWidth: 0,
            videoHeight: 0,
            readyState: 0,
            networkState: 0,
            playbackRate: 1,
            ended: 0
        },
        internal: { ready: false },
        solution: {
            html: true,
            aurora: true,
            flash: true
        },
        format: {
            amr: {
                codec: 'audio/amr-wb amr',
                flashCanPlay: true,
                media: 'audio'
            },
            mp3: {
                codec: 'audio/mpeg',
                flashCanPlay: true,
                media: 'audio'
            },
            m4a: {
                codec: 'audio/mp4; codecs="mp4a.40.2"',
                flashCanPlay: true,
                media: 'audio'
            },
            m3u8a: {
                codec: 'application/vnd.apple.mpegurl; codecs="mp4a.40.2"',
                flashCanPlay: false,
                media: 'audio'
            },
            m3ua: {
                codec: 'audio/mpegurl',
                flashCanPlay: false,
                media: 'audio'
            },
            oga: {
                codec: 'audio/ogg; codecs="vorbis, opus"',
                flashCanPlay: false,
                media: 'audio'
            },
            flac: {
                codec: 'audio/x-flac',
                flashCanPlay: false,
                media: 'audio'
            },
            wav: {
                codec: 'audio/wav; codecs="1"',
                flashCanPlay: false,
                media: 'audio'
            },
            webma: {
                codec: 'audio/webm; codecs="vorbis"',
                flashCanPlay: false,
                media: 'audio'
            },
            fla: {
                codec: 'audio/x-flv',
                flashCanPlay: true,
                media: 'audio'
            },
            rtmpa: {
                codec: 'audio/rtmp; codecs="rtmp"',
                flashCanPlay: true,
                media: 'audio'
            },
            m4v: {
                codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                flashCanPlay: true,
                media: 'video'
            },
            m3u8v: {
                codec: 'application/vnd.apple.mpegurl; codecs="avc1.42E01E, mp4a.40.2"',
                flashCanPlay: false,
                media: 'video'
            },
            m3uv: {
                codec: 'audio/mpegurl',
                flashCanPlay: false,
                media: 'video'
            },
            ogv: {
                codec: 'video/ogg; codecs="theora, vorbis"',
                flashCanPlay: false,
                media: 'video'
            },
            webmv: {
                codec: 'video/webm; codecs="vorbis, vp8"',
                flashCanPlay: false,
                media: 'video'
            },
            flv: {
                codec: 'video/x-flv',
                flashCanPlay: true,
                media: 'video'
            },
            rtmpv: {
                codec: 'video/rtmp; codecs="rtmp"',
                flashCanPlay: true,
                media: 'video'
            }
        },
        _init: function () {
            var self = this;
            this.element.empty();
            this.status = $.extend({}, this.status);
            this.internal = $.extend({}, this.internal);
            this.options.timeFormat = $.extend({}, $.jPlayer.timeFormat, this.options.timeFormat);
            this.internal.cmdsIgnored = $.jPlayer.platform.ipad || $.jPlayer.platform.iphone || $.jPlayer.platform.ipod;
            this.internal.domNode = this.element.get(0);
            if (this.options.keyEnabled && !$.jPlayer.focus) {
                $.jPlayer.focus = this;
            }
            this.androidFix = {
                setMedia: false,
                play: false,
                pause: false,
                time: NaN
            };
            if ($.jPlayer.platform.android) {
                this.options.preload = this.options.preload !== 'auto' ? 'metadata' : 'auto';
            }
            this.formats = [];
            this.solutions = [];
            this.require = {};
            this.htmlElement = {};
            this.html = {};
            this.html.audio = {};
            this.html.video = {};
            this.aurora = {};
            this.aurora.formats = [];
            this.aurora.properties = [];
            this.flash = {};
            this.css = {};
            this.css.cs = {};
            this.css.jq = {};
            this.ancestorJq = [];
            this.options.volume = this._limitValue(this.options.volume, 0, 1);
            $.each(this.options.supplied.toLowerCase().split(','), function (index1, value1) {
                var format = value1.replace(/^\s+|\s+$/g, '');
                if (self.format[format]) {
                    var dupFound = false;
                    $.each(self.formats, function (index2, value2) {
                        if (format === value2) {
                            dupFound = true;
                            return false;
                        }
                    });
                    if (!dupFound) {
                        self.formats.push(format);
                    }
                }
            });
            $.each(this.options.solution.toLowerCase().split(','), function (index1, value1) {
                var solution = value1.replace(/^\s+|\s+$/g, '');
                if (self.solution[solution]) {
                    var dupFound = false;
                    $.each(self.solutions, function (index2, value2) {
                        if (solution === value2) {
                            dupFound = true;
                            return false;
                        }
                    });
                    if (!dupFound) {
                        self.solutions.push(solution);
                    }
                }
            });
            $.each(this.options.auroraFormats.toLowerCase().split(','), function (index1, value1) {
                var format = value1.replace(/^\s+|\s+$/g, '');
                if (self.format[format]) {
                    var dupFound = false;
                    $.each(self.aurora.formats, function (index2, value2) {
                        if (format === value2) {
                            dupFound = true;
                            return false;
                        }
                    });
                    if (!dupFound) {
                        self.aurora.formats.push(format);
                    }
                }
            });
            this.internal.instance = 'jp_' + this.count;
            this.instances[this.internal.instance] = this.element;
            if (!this.element.attr('id')) {
                this.element.attr('id', this.options.idPrefix + '_jplayer_' + this.count);
            }
            this.internal.self = $.extend({}, {
                id: this.element.attr('id'),
                jq: this.element
            });
            this.internal.audio = $.extend({}, {
                id: this.options.idPrefix + '_audio_' + this.count,
                jq: undefined
            });
            this.internal.video = $.extend({}, {
                id: this.options.idPrefix + '_video_' + this.count,
                jq: undefined
            });
            this.internal.flash = $.extend({}, {
                id: this.options.idPrefix + '_flash_' + this.count,
                jq: undefined,
                swf: this.options.swfPath + (this.options.swfPath.toLowerCase().slice(-4) !== '.swf' ? (this.options.swfPath && this.options.swfPath.slice(-1) !== '/' ? '/' : '') + 'jquery.jplayer.swf' : '')
            });
            this.internal.poster = $.extend({}, {
                id: this.options.idPrefix + '_poster_' + this.count,
                jq: undefined
            });
            $.each($.jPlayer.event, function (eventName, eventType) {
                if (self.options[eventName] !== undefined) {
                    self.element.bind(eventType + '.jPlayer', self.options[eventName]);
                    self.options[eventName] = undefined;
                }
            });
            this.require.audio = false;
            this.require.video = false;
            $.each(this.formats, function (priority, format) {
                self.require[self.format[format].media] = true;
            });
            if (this.require.video) {
                this.options = $.extend(true, {}, this.optionsVideo, this.options);
            } else {
                this.options = $.extend(true, {}, this.optionsAudio, this.options);
            }
            this._setSize();
            this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
            this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
            this.status.noVolume = this._uaBlocklist(this.options.noVolume);
            if ($.jPlayer.nativeFeatures.fullscreen.api.fullscreenEnabled) {
                this._fullscreenAddEventListeners();
            }
            this._restrictNativeVideoControls();
            this.htmlElement.poster = document.createElement('img');
            this.htmlElement.poster.id = this.internal.poster.id;
            this.htmlElement.poster.onload = function () {
                if (!self.status.video || self.status.waitForPlay) {
                    self.internal.poster.jq.show();
                }
            };
            this.element.append(this.htmlElement.poster);
            this.internal.poster.jq = $('#' + this.internal.poster.id);
            this.internal.poster.jq.css({
                'width': this.status.width,
                'height': this.status.height
            });
            this.internal.poster.jq.hide();
            this.internal.poster.jq.bind('click.jPlayer', function () {
                self._trigger($.jPlayer.event.click);
            });
            this.html.audio.available = false;
            if (this.require.audio) {
                this.htmlElement.audio = document.createElement('audio');
                this.htmlElement.audio.id = this.internal.audio.id;
                this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio);
            }
            this.html.video.available = false;
            if (this.require.video) {
                this.htmlElement.video = document.createElement('video');
                this.htmlElement.video.id = this.internal.video.id;
                this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video);
            }
            this.flash.available = this._checkForFlash(10.1);
            this.html.canPlay = {};
            this.aurora.canPlay = {};
            this.flash.canPlay = {};
            $.each(this.formats, function (priority, format) {
                self.html.canPlay[format] = self.html[self.format[format].media].available && '' !== self.htmlElement[self.format[format].media].canPlayType(self.format[format].codec);
                self.aurora.canPlay[format] = $.inArray(format, self.aurora.formats) > -1;
                self.flash.canPlay[format] = self.format[format].flashCanPlay && self.flash.available;
            });
            this.html.desired = false;
            this.aurora.desired = false;
            this.flash.desired = false;
            $.each(this.solutions, function (solutionPriority, solution) {
                if (solutionPriority === 0) {
                    self[solution].desired = true;
                } else {
                    var audioCanPlay = false;
                    var videoCanPlay = false;
                    $.each(self.formats, function (formatPriority, format) {
                        if (self[self.solutions[0]].canPlay[format]) {
                            if (self.format[format].media === 'video') {
                                videoCanPlay = true;
                            } else {
                                audioCanPlay = true;
                            }
                        }
                    });
                    self[solution].desired = self.require.audio && !audioCanPlay || self.require.video && !videoCanPlay;
                }
            });
            this.html.support = {};
            this.aurora.support = {};
            this.flash.support = {};
            $.each(this.formats, function (priority, format) {
                self.html.support[format] = self.html.canPlay[format] && self.html.desired;
                self.aurora.support[format] = self.aurora.canPlay[format] && self.aurora.desired;
                self.flash.support[format] = self.flash.canPlay[format] && self.flash.desired;
            });
            this.html.used = false;
            this.aurora.used = false;
            this.flash.used = false;
            $.each(this.solutions, function (solutionPriority, solution) {
                $.each(self.formats, function (formatPriority, format) {
                    if (self[solution].support[format]) {
                        self[solution].used = true;
                        return false;
                    }
                });
            });
            this._resetActive();
            this._resetGate();
            this._cssSelectorAncestor(this.options.cssSelectorAncestor);
            if (!(this.html.used || this.aurora.used || this.flash.used)) {
                this._error({
                    type: $.jPlayer.error.NO_SOLUTION,
                    context: '{solution:\'' + this.options.solution + '\', supplied:\'' + this.options.supplied + '\'}',
                    message: $.jPlayer.errorMsg.NO_SOLUTION,
                    hint: $.jPlayer.errorHint.NO_SOLUTION
                });
                if (this.css.jq.noSolution.length) {
                    this.css.jq.noSolution.show();
                }
            } else {
                if (this.css.jq.noSolution.length) {
                    this.css.jq.noSolution.hide();
                }
            }
            if (this.flash.used) {
                var htmlObj, flashVars = 'jQuery=' + encodeURI(this.options.noConflict) + '&id=' + encodeURI(this.internal.self.id) + '&vol=' + this.options.volume + '&muted=' + this.options.muted;
                if ($.jPlayer.browser.msie && (Number($.jPlayer.browser.version) < 9 || $.jPlayer.browser.documentMode < 9)) {
                    var objStr = '<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>';
                    var paramStr = [
                            '<param name="movie" value="' + this.internal.flash.swf + '" />',
                            '<param name="FlashVars" value="' + flashVars + '" />',
                            '<param name="allowScriptAccess" value="always" />',
                            '<param name="bgcolor" value="' + this.options.backgroundColor + '" />',
                            '<param name="wmode" value="' + this.options.wmode + '" />'
                        ];
                    htmlObj = document.createElement(objStr);
                    for (var i = 0; i < paramStr.length; i++) {
                        htmlObj.appendChild(document.createElement(paramStr[i]));
                    }
                } else {
                    var createParam = function (el, n, v) {
                        var p = document.createElement('param');
                        p.setAttribute('name', n);
                        p.setAttribute('value', v);
                        el.appendChild(p);
                    };
                    htmlObj = document.createElement('object');
                    htmlObj.setAttribute('id', this.internal.flash.id);
                    htmlObj.setAttribute('name', this.internal.flash.id);
                    htmlObj.setAttribute('data', this.internal.flash.swf);
                    htmlObj.setAttribute('type', 'application/x-shockwave-flash');
                    htmlObj.setAttribute('width', '1');
                    htmlObj.setAttribute('height', '1');
                    htmlObj.setAttribute('tabindex', '-1');
                    createParam(htmlObj, 'flashvars', flashVars);
                    createParam(htmlObj, 'allowscriptaccess', 'always');
                    createParam(htmlObj, 'bgcolor', this.options.backgroundColor);
                    createParam(htmlObj, 'wmode', this.options.wmode);
                }
                this.element.append(htmlObj);
                this.internal.flash.jq = $(htmlObj);
            }
            if (this.html.used && !this.flash.used) {
                this.status.playbackRateEnabled = this._testPlaybackRate('audio');
            } else {
                this.status.playbackRateEnabled = false;
            }
            this._updatePlaybackRate();
            if (this.html.used) {
                if (this.html.audio.available) {
                    this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio);
                    this.element.append(this.htmlElement.audio);
                    this.internal.audio.jq = $('#' + this.internal.audio.id);
                }
                if (this.html.video.available) {
                    this._addHtmlEventListeners(this.htmlElement.video, this.html.video);
                    this.element.append(this.htmlElement.video);
                    this.internal.video.jq = $('#' + this.internal.video.id);
                    if (this.status.nativeVideoControls) {
                        this.internal.video.jq.css({
                            'width': this.status.width,
                            'height': this.status.height
                        });
                    } else {
                        this.internal.video.jq.css({
                            'width': '0px',
                            'height': '0px'
                        });
                    }
                    this.internal.video.jq.bind('click.jPlayer', function () {
                        self._trigger($.jPlayer.event.click);
                    });
                }
            }
            if (this.aurora.used) {
            }
            if (this.options.emulateHtml) {
                this._emulateHtmlBridge();
            }
            if ((this.html.used || this.aurora.used) && !this.flash.used) {
                setTimeout(function () {
                    self.internal.ready = true;
                    self.version.flash = 'n/a';
                    self._trigger($.jPlayer.event.repeat);
                    self._trigger($.jPlayer.event.ready);
                }, 100);
            }
            this._updateNativeVideoControls();
            if (this.css.jq.videoPlay.length) {
                this.css.jq.videoPlay.hide();
            }
            $.jPlayer.prototype.count++;
        },
        destroy: function () {
            this.clearMedia();
            this._removeUiClass();
            if (this.css.jq.currentTime.length) {
                this.css.jq.currentTime.text('');
            }
            if (this.css.jq.duration.length) {
                this.css.jq.duration.text('');
            }
            $.each(this.css.jq, function (fn, jq) {
                if (jq.length) {
                    jq.unbind('.jPlayer');
                }
            });
            this.internal.poster.jq.unbind('.jPlayer');
            if (this.internal.video.jq) {
                this.internal.video.jq.unbind('.jPlayer');
            }
            this._fullscreenRemoveEventListeners();
            if (this === $.jPlayer.focus) {
                $.jPlayer.focus = null;
            }
            if (this.options.emulateHtml) {
                this._destroyHtmlBridge();
            }
            this.element.removeData('jPlayer');
            this.element.unbind('.jPlayer');
            this.element.empty();
            delete this.instances[this.internal.instance];
        },
        destroyRemoved: function () {
            var self = this;
            $.each(this.instances, function (i, element) {
                if (self.element !== element) {
                    if (!element.data('jPlayer')) {
                        element.jPlayer('destroy');
                        delete self.instances[i];
                    }
                }
            });
        },
        enable: function () {
        },
        disable: function () {
        },
        _testCanPlayType: function (elem) {
            try {
                elem.canPlayType(this.format.mp3.codec);
                return true;
            } catch (err) {
                return false;
            }
        },
        _testPlaybackRate: function (type) {
            var el, rate = 0.5;
            type = typeof type === 'string' ? type : 'audio';
            el = document.createElement(type);
            try {
                if ('playbackRate' in el) {
                    el.playbackRate = rate;
                    return el.playbackRate === rate;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        },
        _uaBlocklist: function (list) {
            var ua = navigator.userAgent.toLowerCase(), block = false;
            $.each(list, function (p, re) {
                if (re && re.test(ua)) {
                    block = true;
                    return false;
                }
            });
            return block;
        },
        _restrictNativeVideoControls: function () {
            if (this.require.audio) {
                if (this.status.nativeVideoControls) {
                    this.status.nativeVideoControls = false;
                    this.status.noFullWindow = true;
                }
            }
        },
        _updateNativeVideoControls: function () {
            if (this.html.video.available && this.html.used) {
                this.htmlElement.video.controls = this.status.nativeVideoControls;
                this._updateAutohide();
                if (this.status.nativeVideoControls && this.require.video) {
                    this.internal.poster.jq.hide();
                    this.internal.video.jq.css({
                        'width': this.status.width,
                        'height': this.status.height
                    });
                } else if (this.status.waitForPlay && this.status.video) {
                    this.internal.poster.jq.show();
                    this.internal.video.jq.css({
                        'width': '0px',
                        'height': '0px'
                    });
                }
            }
        },
        _addHtmlEventListeners: function (mediaElement, entity) {
            var self = this;
            mediaElement.preload = this.options.preload;
            mediaElement.muted = this.options.muted;
            mediaElement.volume = this.options.volume;
            if (this.status.playbackRateEnabled) {
                mediaElement.defaultPlaybackRate = this.options.defaultPlaybackRate;
                mediaElement.playbackRate = this.options.playbackRate;
            }
            mediaElement.addEventListener('progress', function () {
                if (entity.gate) {
                    if (self.internal.cmdsIgnored && this.readyState > 0) {
                        self.internal.cmdsIgnored = false;
                    }
                    self._getHtmlStatus(mediaElement);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.progress);
                }
            }, false);
            mediaElement.addEventListener('loadeddata', function () {
                if (entity.gate) {
                    self.androidFix.setMedia = false;
                    if (self.androidFix.play) {
                        self.androidFix.play = false;
                        self.play(self.androidFix.time);
                    }
                    if (self.androidFix.pause) {
                        self.androidFix.pause = false;
                        self.pause(self.androidFix.time);
                    }
                    self._trigger($.jPlayer.event.loadeddata);
                }
            }, false);
            mediaElement.addEventListener('timeupdate', function () {
                if (entity.gate) {
                    self._getHtmlStatus(mediaElement);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.timeupdate);
                }
            }, false);
            mediaElement.addEventListener('durationchange', function () {
                if (entity.gate) {
                    self._getHtmlStatus(mediaElement);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.durationchange);
                }
            }, false);
            mediaElement.addEventListener('play', function () {
                if (entity.gate) {
                    self._updateButtons(true);
                    self._html_checkWaitForPlay();
                    self._trigger($.jPlayer.event.play);
                }
            }, false);
            mediaElement.addEventListener('playing', function () {
                if (entity.gate) {
                    self._updateButtons(true);
                    self._seeked();
                    self._trigger($.jPlayer.event.playing);
                }
            }, false);
            mediaElement.addEventListener('pause', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._trigger($.jPlayer.event.pause);
                }
            }, false);
            mediaElement.addEventListener('waiting', function () {
                if (entity.gate) {
                    self._seeking();
                    self._trigger($.jPlayer.event.waiting);
                }
            }, false);
            mediaElement.addEventListener('seeking', function () {
                if (entity.gate) {
                    self._seeking();
                    self._trigger($.jPlayer.event.seeking);
                }
            }, false);
            mediaElement.addEventListener('seeked', function () {
                if (entity.gate) {
                    self._seeked();
                    self._trigger($.jPlayer.event.seeked);
                }
            }, false);
            mediaElement.addEventListener('volumechange', function () {
                if (entity.gate) {
                    self.options.volume = mediaElement.volume;
                    self.options.muted = mediaElement.muted;
                    self._updateMute();
                    self._updateVolume();
                    self._trigger($.jPlayer.event.volumechange);
                }
            }, false);
            mediaElement.addEventListener('ratechange', function () {
                if (entity.gate) {
                    self.options.defaultPlaybackRate = mediaElement.defaultPlaybackRate;
                    self.options.playbackRate = mediaElement.playbackRate;
                    self._updatePlaybackRate();
                    self._trigger($.jPlayer.event.ratechange);
                }
            }, false);
            mediaElement.addEventListener('suspend', function () {
                if (entity.gate) {
                    self._seeked();
                    self._trigger($.jPlayer.event.suspend);
                }
            }, false);
            mediaElement.addEventListener('ended', function () {
                if (entity.gate) {
                    if (!$.jPlayer.browser.webkit) {
                        self.htmlElement.media.currentTime = 0;
                    }
                    self.htmlElement.media.pause();
                    self._updateButtons(false);
                    self._getHtmlStatus(mediaElement, true);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.ended);
                }
            }, false);
            mediaElement.addEventListener('error', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._seeked();
                    if (self.status.srcSet) {
                        clearTimeout(self.internal.htmlDlyCmdId);
                        self.status.waitForLoad = true;
                        self.status.waitForPlay = true;
                        if (self.status.video && !self.status.nativeVideoControls) {
                            self.internal.video.jq.css({
                                'width': '0px',
                                'height': '0px'
                            });
                        }
                        if (self._validString(self.status.media.poster) && !self.status.nativeVideoControls) {
                            self.internal.poster.jq.show();
                        }
                        if (self.css.jq.videoPlay.length) {
                            self.css.jq.videoPlay.show();
                        }
                        self._error({
                            type: $.jPlayer.error.URL,
                            context: self.status.src,
                            message: $.jPlayer.errorMsg.URL,
                            hint: $.jPlayer.errorHint.URL
                        });
                    }
                }
            }, false);
            $.each($.jPlayer.htmlEvent, function (i, eventType) {
                mediaElement.addEventListener(this, function () {
                    if (entity.gate) {
                        self._trigger($.jPlayer.event[eventType]);
                    }
                }, false);
            });
        },
        _addAuroraEventListeners: function (player, entity) {
            var self = this;
            player.volume = this.options.volume * 100;
            player.on('progress', function () {
                if (entity.gate) {
                    if (self.internal.cmdsIgnored && this.readyState > 0) {
                        self.internal.cmdsIgnored = false;
                    }
                    self._getAuroraStatus(player);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.progress);
                    if (player.duration > 0) {
                        self._trigger($.jPlayer.event.timeupdate);
                    }
                }
            }, false);
            player.on('ready', function () {
                if (entity.gate) {
                    self._trigger($.jPlayer.event.loadeddata);
                }
            }, false);
            player.on('duration', function () {
                if (entity.gate) {
                    self._getAuroraStatus(player);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.durationchange);
                }
            }, false);
            player.on('end', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._getAuroraStatus(player, true);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.ended);
                }
            }, false);
            player.on('error', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._seeked();
                    if (self.status.srcSet) {
                        self.status.waitForLoad = true;
                        self.status.waitForPlay = true;
                        if (self.status.video && !self.status.nativeVideoControls) {
                            self.internal.video.jq.css({
                                'width': '0px',
                                'height': '0px'
                            });
                        }
                        if (self._validString(self.status.media.poster) && !self.status.nativeVideoControls) {
                            self.internal.poster.jq.show();
                        }
                        if (self.css.jq.videoPlay.length) {
                            self.css.jq.videoPlay.show();
                        }
                        self._error({
                            type: $.jPlayer.error.URL,
                            context: self.status.src,
                            message: $.jPlayer.errorMsg.URL,
                            hint: $.jPlayer.errorHint.URL
                        });
                    }
                }
            }, false);
        },
        _getHtmlStatus: function (media, override) {
            var ct = 0, cpa = 0, sp = 0, cpr = 0;
            if (isFinite(media.duration)) {
                this.status.duration = media.duration;
            }
            ct = media.currentTime;
            cpa = this.status.duration > 0 ? 100 * ct / this.status.duration : 0;
            if (typeof media.seekable === 'object' && media.seekable.length > 0) {
                sp = this.status.duration > 0 ? 100 * media.seekable.end(media.seekable.length - 1) / this.status.duration : 100;
                cpr = this.status.duration > 0 ? 100 * media.currentTime / media.seekable.end(media.seekable.length - 1) : 0;
                sp = 100;
                cpr = this.status.duration > 0 ? 100 * media.currentTime / this.status.duration : 0;
            } else {
                sp = 100;
                cpr = cpa;
            }
            if (override) {
                ct = 0;
                cpr = 0;
                cpa = 0;
            }
            this.status.seekPercent = sp;
            this.status.currentPercentRelative = cpr;
            this.status.currentPercentAbsolute = cpa;
            this.status.currentTime = ct;
            this.status.remaining = this.status.duration - this.status.currentTime;
            this.status.videoWidth = media.videoWidth;
            this.status.videoHeight = media.videoHeight;
            this.status.readyState = media.readyState;
            this.status.networkState = media.networkState;
            this.status.playbackRate = media.playbackRate;
            this.status.ended = media.ended;
        },
        _getAuroraStatus: function (player, override) {
            var ct = 0, cpa = 0, sp = 0, cpr = 0;
            this.status.duration = player.duration / 1000;
            ct = player.currentTime / 1000;
            cpa = this.status.duration > 0 ? 100 * ct / this.status.duration : 0;
            if (player.buffered > 0) {
                sp = this.status.duration > 0 ? player.buffered * this.status.duration / this.status.duration : 100;
                cpr = this.status.duration > 0 ? ct / (player.buffered * this.status.duration) : 0;
            } else {
                sp = 100;
                cpr = cpa;
            }
            if (override) {
                ct = 0;
                cpr = 0;
                cpa = 0;
            }
            this.status.seekPercent = sp;
            this.status.currentPercentRelative = cpr;
            this.status.currentPercentAbsolute = cpa;
            this.status.currentTime = ct;
            this.status.remaining = this.status.duration - this.status.currentTime;
            this.status.readyState = 4;
            this.status.networkState = 0;
            this.status.playbackRate = 1;
            this.status.ended = false;
        },
        _resetStatus: function () {
            this.status = $.extend({}, this.status, $.jPlayer.prototype.status);
        },
        _trigger: function (eventType, error, warning) {
            var event = $.Event(eventType);
            event.jPlayer = {};
            event.jPlayer.version = $.extend({}, this.version);
            event.jPlayer.options = $.extend(true, {}, this.options);
            event.jPlayer.status = $.extend(true, {}, this.status);
            event.jPlayer.html = $.extend(true, {}, this.html);
            event.jPlayer.aurora = $.extend(true, {}, this.aurora);
            event.jPlayer.flash = $.extend(true, {}, this.flash);
            if (error) {
                event.jPlayer.error = $.extend({}, error);
            }
            if (warning) {
                event.jPlayer.warning = $.extend({}, warning);
            }
            this.element.trigger(event);
        },
        jPlayerFlashEvent: function (eventType, status) {
            if (eventType === $.jPlayer.event.ready) {
                if (!this.internal.ready) {
                    this.internal.ready = true;
                    this.internal.flash.jq.css({
                        'width': '0px',
                        'height': '0px'
                    });
                    this.version.flash = status.version;
                    if (this.version.needFlash !== this.version.flash) {
                        this._error({
                            type: $.jPlayer.error.VERSION,
                            context: this.version.flash,
                            message: $.jPlayer.errorMsg.VERSION + this.version.flash,
                            hint: $.jPlayer.errorHint.VERSION
                        });
                    }
                    this._trigger($.jPlayer.event.repeat);
                    this._trigger(eventType);
                } else {
                    if (this.flash.gate) {
                        if (this.status.srcSet) {
                            var currentTime = this.status.currentTime, paused = this.status.paused;
                            this.setMedia(this.status.media);
                            this.volumeWorker(this.options.volume);
                            if (currentTime > 0) {
                                if (paused) {
                                    this.pause(currentTime);
                                } else {
                                    this.play(currentTime);
                                }
                            }
                        }
                        this._trigger($.jPlayer.event.flashreset);
                    }
                }
            }
            if (this.flash.gate) {
                switch (eventType) {
                case $.jPlayer.event.progress:
                    this._getFlashStatus(status);
                    this._updateInterface();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.timeupdate:
                    this._getFlashStatus(status);
                    this._updateInterface();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.play:
                    this._seeked();
                    this._updateButtons(true);
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.pause:
                    this._updateButtons(false);
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.ended:
                    this._updateButtons(false);
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.click:
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.error:
                    this.status.waitForLoad = true;
                    this.status.waitForPlay = true;
                    if (this.status.video) {
                        this.internal.flash.jq.css({
                            'width': '0px',
                            'height': '0px'
                        });
                    }
                    if (this._validString(this.status.media.poster)) {
                        this.internal.poster.jq.show();
                    }
                    if (this.css.jq.videoPlay.length && this.status.video) {
                        this.css.jq.videoPlay.show();
                    }
                    if (this.status.video) {
                        this._flash_setVideo(this.status.media);
                    } else {
                        this._flash_setAudio(this.status.media);
                    }
                    this._updateButtons(false);
                    this._error({
                        type: $.jPlayer.error.URL,
                        context: status.src,
                        message: $.jPlayer.errorMsg.URL,
                        hint: $.jPlayer.errorHint.URL
                    });
                    break;
                case $.jPlayer.event.seeking:
                    this._seeking();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.seeked:
                    this._seeked();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.ready:
                    break;
                default:
                    this._trigger(eventType);
                }
            }
            return false;
        },
        _getFlashStatus: function (status) {
            this.status.seekPercent = status.seekPercent;
            this.status.currentPercentRelative = status.currentPercentRelative;
            this.status.currentPercentAbsolute = status.currentPercentAbsolute;
            this.status.currentTime = status.currentTime;
            this.status.duration = status.duration;
            this.status.remaining = status.duration - status.currentTime;
            this.status.videoWidth = status.videoWidth;
            this.status.videoHeight = status.videoHeight;
            this.status.readyState = 4;
            this.status.networkState = 0;
            this.status.playbackRate = 1;
            this.status.ended = false;
        },
        _updateButtons: function (playing) {
            if (playing === undefined) {
                playing = !this.status.paused;
            } else {
                this.status.paused = !playing;
            }
            if (playing) {
                this.addStateClass('playing');
            } else {
                this.removeStateClass('playing');
            }
            if (!this.status.noFullWindow && this.options.fullWindow) {
                this.addStateClass('fullScreen');
            } else {
                this.removeStateClass('fullScreen');
            }
            if (this.options.loop) {
                this.addStateClass('looped');
            } else {
                this.removeStateClass('looped');
            }
            if (this.css.jq.play.length && this.css.jq.pause.length) {
                if (playing) {
                    this.css.jq.play.hide();
                    this.css.jq.pause.show();
                } else {
                    this.css.jq.play.show();
                    this.css.jq.pause.hide();
                }
            }
            if (this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length) {
                if (this.status.noFullWindow) {
                    this.css.jq.fullScreen.hide();
                    this.css.jq.restoreScreen.hide();
                } else if (this.options.fullWindow) {
                    this.css.jq.fullScreen.hide();
                    this.css.jq.restoreScreen.show();
                } else {
                    this.css.jq.fullScreen.show();
                    this.css.jq.restoreScreen.hide();
                }
            }
            if (this.css.jq.repeat.length && this.css.jq.repeatOff.length) {
                if (this.options.loop) {
                    this.css.jq.repeat.hide();
                    this.css.jq.repeatOff.show();
                } else {
                    this.css.jq.repeat.show();
                    this.css.jq.repeatOff.hide();
                }
            }
        },
        _updateInterface: function () {
            if (this.css.jq.seekBar.length) {
                this.css.jq.seekBar.width(this.status.seekPercent + '%');
            }
            if (this.css.jq.playBar.length) {
                if (this.options.smoothPlayBar) {
                    this.css.jq.playBar.stop().animate({ width: this.status.currentPercentAbsolute + '%' }, 250, 'linear');
                    this.css.jq.playBall.stop().animate({ left: this.status.currentPercentAbsolute < this.css.jq.playBall.width() / 2 ? this.status.currentPercentAbsolute : this.status.currentPercentAbsolute - this.css.jq.playBall.width() / 2 + '%' }, 250, 'linear');
                } else {
                    this.css.jq.playBar.width(this.status.currentPercentRelative + '%');
                    this.css.jq.playBall.css({ 'left': this.status.currentPercentRelative < this.css.jq.playBall.width() / 2 ? this.status.currentPercentRelative : this.status.currentPercentRelative - this.css.jq.playBall.width() / 2 + '%' });
                }
            }
            var currentTimeText = '';
            if (this.css.jq.currentTime.length) {
                currentTimeText = this._convertTime(this.status.currentTime);
                if (currentTimeText !== this.css.jq.currentTime.text()) {
                    this.css.jq.currentTime.text(this._convertTime(this.status.currentTime));
                }
            }
            var durationText = '', duration = this.status.duration, remaining = this.status.remaining;
            if (this.css.jq.duration.length) {
                if (typeof this.status.media.duration === 'string') {
                    durationText = this.status.media.duration;
                } else {
                    if (typeof this.status.media.duration === 'number') {
                        duration = this.status.media.duration;
                        remaining = duration - this.status.currentTime;
                    }
                    if (this.options.remainingDuration) {
                        durationText = (remaining > 0 ? '-' : '') + this._convertTime(remaining);
                    } else {
                        durationText = this._convertTime(duration);
                    }
                }
                if (durationText !== this.css.jq.duration.text()) {
                    this.css.jq.duration.text(durationText);
                }
            }
        },
        _convertTime: ConvertTime.prototype.time,
        _seeking: function () {
            if (this.css.jq.seekBar.length) {
                this.css.jq.seekBar.addClass('jp-seeking-bg');
            }
            this.addStateClass('seeking');
        },
        _seeked: function () {
            if (this.css.jq.seekBar.length) {
                this.css.jq.seekBar.removeClass('jp-seeking-bg');
            }
            this.removeStateClass('seeking');
        },
        _resetGate: function () {
            this.html.audio.gate = false;
            this.html.video.gate = false;
            this.aurora.gate = false;
            this.flash.gate = false;
        },
        _resetActive: function () {
            this.html.active = false;
            this.aurora.active = false;
            this.flash.active = false;
        },
        _escapeHtml: function (s) {
            return s.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
        },
        _qualifyURL: function (url) {
            var el = document.createElement('div');
            el.innerHTML = '<a href="' + this._escapeHtml(url) + '">x</a>';
            return el.firstChild.href;
        },
        _absoluteMediaUrls: function (media) {
            var self = this;
            $.each(media, function (type, url) {
                if (url && self.format[type] && url.substr(0, 5) !== 'data:') {
                    media[type] = self._qualifyURL(url);
                }
            });
            return media;
        },
        addStateClass: function (state) {
            if (this.ancestorJq.length) {
                this.ancestorJq.addClass(this.options.stateClass[state]);
            }
        },
        removeStateClass: function (state) {
            if (this.ancestorJq.length) {
                this.ancestorJq.removeClass(this.options.stateClass[state]);
            }
        },
        setMedia: function (media) {
            var self = this, supported = false, posterChanged = this.status.media.poster !== media.poster;
            this._resetMedia();
            this._resetGate();
            this._resetActive();
            this.androidFix.setMedia = false;
            this.androidFix.play = false;
            this.androidFix.pause = false;
            media = this._absoluteMediaUrls(media);
            $.each(this.formats, function (formatPriority, format) {
                var isVideo = self.format[format].media === 'video';
                $.each(self.solutions, function (solutionPriority, solution) {
                    if (self[solution].support[format] && self._validString(media[format])) {
                        var isHtml = solution === 'html';
                        var isAurora = solution === 'aurora';
                        if (isVideo) {
                            if (isHtml) {
                                self.html.video.gate = true;
                                self._html_setVideo(media);
                                self.html.active = true;
                            } else {
                                self.flash.gate = true;
                                self._flash_setVideo(media);
                                self.flash.active = true;
                            }
                            if (self.css.jq.videoPlay.length) {
                                self.css.jq.videoPlay.show();
                            }
                            self.status.video = true;
                        } else {
                            if (isHtml) {
                                self.html.audio.gate = true;
                                self._html_setAudio(media);
                                self.html.active = true;
                                if ($.jPlayer.platform.android) {
                                    self.androidFix.setMedia = true;
                                }
                            } else if (isAurora) {
                                self.aurora.gate = true;
                                self._aurora_setAudio(media);
                                self.aurora.active = true;
                            } else {
                                self.flash.gate = true;
                                self._flash_setAudio(media);
                                self.flash.active = true;
                            }
                            if (self.css.jq.videoPlay.length) {
                                self.css.jq.videoPlay.hide();
                            }
                            self.status.video = false;
                        }
                        supported = true;
                        return false;
                    }
                });
                if (supported) {
                    return false;
                }
            });
            if (supported) {
                if (!(this.status.nativeVideoControls && this.html.video.gate)) {
                    if (this._validString(media.poster)) {
                        if (posterChanged) {
                            this.htmlElement.poster.src = media.poster;
                        } else {
                            this.internal.poster.jq.show();
                        }
                    }
                }
                if (typeof media.title === 'string') {
                    if (this.css.jq.title.length) {
                        this.css.jq.title.html(media.title);
                    }
                    if (this.htmlElement.audio) {
                        this.htmlElement.audio.setAttribute('title', media.title);
                    }
                    if (this.htmlElement.video) {
                        this.htmlElement.video.setAttribute('title', media.title);
                    }
                }
                this.status.srcSet = true;
                this.status.media = $.extend({}, media);
                this._updateButtons(false);
                this._updateInterface();
                this._trigger($.jPlayer.event.setmedia);
            } else {
                this._error({
                    type: $.jPlayer.error.NO_SUPPORT,
                    context: '{supplied:\'' + this.options.supplied + '\'}',
                    message: $.jPlayer.errorMsg.NO_SUPPORT,
                    hint: $.jPlayer.errorHint.NO_SUPPORT
                });
            }
        },
        _resetMedia: function () {
            this._resetStatus();
            this._updateButtons(false);
            this._updateInterface();
            this._seeked();
            this.internal.poster.jq.hide();
            clearTimeout(this.internal.htmlDlyCmdId);
            if (this.html.active) {
                this._html_resetMedia();
            } else if (this.aurora.active) {
                this._aurora_resetMedia();
            } else if (this.flash.active) {
                this._flash_resetMedia();
            }
        },
        clearMedia: function () {
            this._resetMedia();
            if (this.html.active) {
                this._html_clearMedia();
            } else if (this.aurora.active) {
                this._aurora_clearMedia();
            } else if (this.flash.active) {
                this._flash_clearMedia();
            }
            this._resetGate();
            this._resetActive();
        },
        load: function () {
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_load();
                } else if (this.aurora.active) {
                    this._aurora_load();
                } else if (this.flash.active) {
                    this._flash_load();
                }
            } else {
                this._urlNotSetError('load');
            }
        },
        focus: function () {
            if (this.options.keyEnabled) {
                $.jPlayer.focus = this;
            }
        },
        play: function (time) {
            var guiAction = typeof time === 'object';
            if (guiAction && this.options.useStateClassSkin && !this.status.paused) {
                this.pause(time);
            } else {
                time = typeof time === 'number' ? time : NaN;
                if (this.status.srcSet) {
                    this.focus();
                    if (this.html.active) {
                        this._html_play(time);
                    } else if (this.aurora.active) {
                        this._aurora_play(time);
                    } else if (this.flash.active) {
                        this._flash_play(time);
                    }
                } else {
                    this._urlNotSetError('play');
                }
            }
        },
        videoPlay: function () {
            this.play();
        },
        pause: function (time) {
            time = typeof time === 'number' ? time : NaN;
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_pause(time);
                } else if (this.aurora.active) {
                    this._aurora_pause(time);
                } else if (this.flash.active) {
                    this._flash_pause(time);
                }
            } else {
                this._urlNotSetError('pause');
            }
        },
        tellOthers: function (command, conditions) {
            var self = this, hasConditions = typeof conditions === 'function', args = Array.prototype.slice.call(arguments);
            if (typeof command !== 'string') {
                return;
            }
            if (hasConditions) {
                args.splice(1, 1);
            }
            $.jPlayer.prototype.destroyRemoved();
            $.each(this.instances, function () {
                if (self.element !== this) {
                    if (!hasConditions || conditions.call(this.data('jPlayer'), self)) {
                        this.jPlayer.apply(this, args);
                    }
                }
            });
        },
        pauseOthers: function (time) {
            this.tellOthers('pause', function () {
                return this.status.srcSet;
            }, time);
        },
        stop: function () {
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_pause(0);
                } else if (this.aurora.active) {
                    this._aurora_pause(0);
                } else if (this.flash.active) {
                    this._flash_pause(0);
                }
            } else {
                this._urlNotSetError('stop');
            }
        },
        playHead: function (p) {
            p = this._limitValue(p, 0, 100);
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_playHead(p);
                } else if (this.aurora.active) {
                    this._aurora_playHead(p);
                } else if (this.flash.active) {
                    this._flash_playHead(p);
                }
            } else {
                this._urlNotSetError('playHead');
            }
        },
        _muted: function (muted) {
            this.mutedWorker(muted);
            if (this.options.globalVolume) {
                this.tellOthers('mutedWorker', function () {
                    return this.options.globalVolume;
                }, muted);
            }
        },
        mutedWorker: function (muted) {
            this.options.muted = muted;
            if (this.html.used) {
                this._html_setProperty('muted', muted);
            }
            if (this.aurora.used) {
                this._aurora_mute(muted);
            }
            if (this.flash.used) {
                this._flash_mute(muted);
            }
            if (!this.html.video.gate && !this.html.audio.gate) {
                this._updateMute(muted);
                this._updateVolume(this.options.volume);
                this._trigger($.jPlayer.event.volumechange);
            }
        },
        mute: function (mute) {
            var guiAction = typeof mute === 'object';
            if (guiAction && this.options.useStateClassSkin && this.options.muted) {
                this._muted(false);
            } else {
                mute = mute === undefined ? true : !!mute;
                this._muted(mute);
            }
        },
        unmute: function (unmute) {
            unmute = unmute === undefined ? true : !!unmute;
            this._muted(!unmute);
        },
        _updateMute: function (mute) {
            if (mute === undefined) {
                mute = this.options.muted;
            }
            if (mute) {
                this.addStateClass('muted');
            } else {
                this.removeStateClass('muted');
            }
            if (this.css.jq.mute.length && this.css.jq.unmute.length) {
                if (this.status.noVolume) {
                    this.css.jq.mute.hide();
                    this.css.jq.unmute.hide();
                } else if (mute) {
                    this.css.jq.mute.hide();
                    this.css.jq.unmute.show();
                } else {
                    this.css.jq.mute.show();
                    this.css.jq.unmute.hide();
                }
            }
        },
        volume: function (v) {
            this.volumeWorker(v);
            if (this.options.globalVolume) {
                this.tellOthers('volumeWorker', function () {
                    return this.options.globalVolume;
                }, v);
            }
        },
        volumeWorker: function (v) {
            v = this._limitValue(v, 0, 1);
            this.options.volume = v;
            if (this.html.used) {
                this._html_setProperty('volume', v);
            }
            if (this.aurora.used) {
                this._aurora_volume(v);
            }
            if (this.flash.used) {
                this._flash_volume(v);
            }
            if (!this.html.video.gate && !this.html.audio.gate) {
                this._updateVolume(v);
                this._trigger($.jPlayer.event.volumechange);
            }
        },
        volumeBar: function (e) {
            if (this.css.jq.volumeBar.length) {
                var $bar = $(e.currentTarget), offset = $bar.offset(), x = e.pageX - offset.left, w = $bar.width(), y = $bar.height() - e.pageY + offset.top, h = $bar.height();
                if (this.options.verticalVolume) {
                    this.volume(y / h);
                } else {
                    this.volume(x / w);
                }
            }
            if (this.options.muted) {
                this._muted(false);
            }
        },
        _updateVolume: function (v) {
            if (v === undefined) {
                v = this.options.volume;
            }
            v = this.options.muted ? 0 : v;
            if (this.status.noVolume) {
                this.addStateClass('noVolume');
                if (this.css.jq.volumeBar.length) {
                    this.css.jq.volumeBar.hide();
                }
                if (this.css.jq.volumeBarValue.length) {
                    this.css.jq.volumeBarValue.hide();
                }
                if (this.css.jq.volumeMax.length) {
                    this.css.jq.volumeMax.hide();
                }
            } else {
                this.removeStateClass('noVolume');
                if (this.css.jq.volumeBar.length) {
                    this.css.jq.volumeBar.show();
                }
                if (this.css.jq.volumeBarValue.length) {
                    this.css.jq.volumeBarValue.show();
                    this.css.jq.volumeBarValue[this.options.verticalVolume ? 'height' : 'width'](v * 100 + '%');
                }
                if (this.css.jq.volumeMax.length) {
                    this.css.jq.volumeMax.show();
                }
            }
        },
        volumeMax: function () {
            this.volume(1);
            if (this.options.muted) {
                this._muted(false);
            }
        },
        _cssSelectorAncestor: function (ancestor) {
            var self = this;
            this.options.cssSelectorAncestor = ancestor;
            this._removeUiClass();
            this.ancestorJq = ancestor ? $(ancestor) : [];
            if (ancestor && this.ancestorJq.length !== 1) {
                this._warning({
                    type: $.jPlayer.warning.CSS_SELECTOR_COUNT,
                    context: ancestor,
                    message: $.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + ' found for cssSelectorAncestor.',
                    hint: $.jPlayer.warningHint.CSS_SELECTOR_COUNT
                });
            }
            this._addUiClass();
            $.each(this.options.cssSelector, function (fn, cssSel) {
                self._cssSelector(fn, cssSel);
            });
            this._updateInterface();
            this._updateButtons();
            this._updateAutohide();
            this._updateVolume();
            this._updateMute();
        },
        _cssSelector: function (fn, cssSel) {
            var self = this;
            if (typeof cssSel === 'string') {
                if ($.jPlayer.prototype.options.cssSelector[fn]) {
                    if (this.css.jq[fn] && this.css.jq[fn].length) {
                        this.css.jq[fn].unbind('.jPlayer');
                    }
                    this.options.cssSelector[fn] = cssSel;
                    this.css.cs[fn] = this.options.cssSelectorAncestor + ' ' + cssSel;
                    if (cssSel) {
                        this.css.jq[fn] = $(this.css.cs[fn]);
                    } else {
                        this.css.jq[fn] = [];
                    }
                    if (this.css.jq[fn].length && this[fn]) {
                        var handler = function (e) {
                            e.preventDefault();
                            self[fn](e);
                            if (self.options.autoBlur) {
                                $(this).blur();
                            } else {
                                $(this).focus();
                            }
                        };
                        this.css.jq[fn].bind('click.jPlayer', handler);
                    }
                    if (cssSel && this.css.jq[fn].length !== 1) {
                        this._warning({
                            type: $.jPlayer.warning.CSS_SELECTOR_COUNT,
                            context: this.css.cs[fn],
                            message: $.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[fn].length + ' found for ' + fn + ' method.',
                            hint: $.jPlayer.warningHint.CSS_SELECTOR_COUNT
                        });
                    }
                } else {
                    this._warning({
                        type: $.jPlayer.warning.CSS_SELECTOR_METHOD,
                        context: fn,
                        message: $.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
                        hint: $.jPlayer.warningHint.CSS_SELECTOR_METHOD
                    });
                }
            } else {
                this._warning({
                    type: $.jPlayer.warning.CSS_SELECTOR_STRING,
                    context: cssSel,
                    message: $.jPlayer.warningMsg.CSS_SELECTOR_STRING,
                    hint: $.jPlayer.warningHint.CSS_SELECTOR_STRING
                });
            }
        },
        duration: function (e) {
            if (this.options.toggleDuration) {
                if (this.options.captureDuration) {
                    e.stopPropagation();
                }
                this._setOption('remainingDuration', !this.options.remainingDuration);
            }
        },
        seekBar: function (e) {
            if (this.css.jq.seekBar.length) {
                var $bar = $(e.currentTarget), offset = $bar.offset(), x = e.pageX - offset.left, w = $bar.width(), p = 100 * x / w;
                this.playHead(p);
            }
        },
        playbackRate: function (pbr) {
            this._setOption('playbackRate', pbr);
        },
        playbackRateBar: function (e) {
            if (this.css.jq.playbackRateBar.length) {
                var $bar = $(e.currentTarget), offset = $bar.offset(), x = e.pageX - offset.left, w = $bar.width(), y = $bar.height() - e.pageY + offset.top, h = $bar.height(), ratio, pbr;
                if (this.options.verticalPlaybackRate) {
                    ratio = y / h;
                } else {
                    ratio = x / w;
                }
                pbr = ratio * (this.options.maxPlaybackRate - this.options.minPlaybackRate) + this.options.minPlaybackRate;
                this.playbackRate(pbr);
            }
        },
        _updatePlaybackRate: function () {
            var pbr = this.options.playbackRate, ratio = (pbr - this.options.minPlaybackRate) / (this.options.maxPlaybackRate - this.options.minPlaybackRate);
            if (this.status.playbackRateEnabled) {
                if (this.css.jq.playbackRateBar.length) {
                    this.css.jq.playbackRateBar.show();
                }
                if (this.css.jq.playbackRateBarValue.length) {
                    this.css.jq.playbackRateBarValue.show();
                    this.css.jq.playbackRateBarValue[this.options.verticalPlaybackRate ? 'height' : 'width'](ratio * 100 + '%');
                }
            } else {
                if (this.css.jq.playbackRateBar.length) {
                    this.css.jq.playbackRateBar.hide();
                }
                if (this.css.jq.playbackRateBarValue.length) {
                    this.css.jq.playbackRateBarValue.hide();
                }
            }
        },
        repeat: function (event) {
            var guiAction = typeof event === 'object';
            if (guiAction && this.options.useStateClassSkin && this.options.loop) {
                this._loop(false);
            } else {
                this._loop(true);
            }
        },
        repeatOff: function () {
            this._loop(false);
        },
        _loop: function (loop) {
            if (this.options.loop !== loop) {
                this.options.loop = loop;
                this._updateButtons();
                this._trigger($.jPlayer.event.repeat);
            }
        },
        option: function (key, value) {
            var options = key;
            if (arguments.length === 0) {
                return $.extend(true, {}, this.options);
            }
            if (typeof key === 'string') {
                var keys = key.split('.');
                if (value === undefined) {
                    var opt = $.extend(true, {}, this.options);
                    for (var i = 0; i < keys.length; i++) {
                        if (opt[keys[i]] !== undefined) {
                            opt = opt[keys[i]];
                        } else {
                            this._warning({
                                type: $.jPlayer.warning.OPTION_KEY,
                                context: key,
                                message: $.jPlayer.warningMsg.OPTION_KEY,
                                hint: $.jPlayer.warningHint.OPTION_KEY
                            });
                            return undefined;
                        }
                    }
                    return opt;
                }
                options = {};
                var opts = options;
                for (var j = 0; j < keys.length; j++) {
                    if (j < keys.length - 1) {
                        opts[keys[j]] = {};
                        opts = opts[keys[j]];
                    } else {
                        opts[keys[j]] = value;
                    }
                }
            }
            this._setOptions(options);
            return this;
        },
        _setOptions: function (options) {
            var self = this;
            $.each(options, function (key, value) {
                self._setOption(key, value);
            });
            return this;
        },
        _setOption: function (key, value) {
            var self = this;
            switch (key) {
            case 'volume':
                this.volume(value);
                break;
            case 'muted':
                this._muted(value);
                break;
            case 'globalVolume':
                this.options[key] = value;
                break;
            case 'cssSelectorAncestor':
                this._cssSelectorAncestor(value);
                break;
            case 'cssSelector':
                $.each(value, function (fn, cssSel) {
                    self._cssSelector(fn, cssSel);
                });
                break;
            case 'playbackRate':
                this.options[key] = value = this._limitValue(value, this.options.minPlaybackRate, this.options.maxPlaybackRate);
                if (this.html.used) {
                    this._html_setProperty('playbackRate', value);
                }
                this._updatePlaybackRate();
                break;
            case 'defaultPlaybackRate':
                this.options[key] = value = this._limitValue(value, this.options.minPlaybackRate, this.options.maxPlaybackRate);
                if (this.html.used) {
                    this._html_setProperty('defaultPlaybackRate', value);
                }
                this._updatePlaybackRate();
                break;
            case 'minPlaybackRate':
                this.options[key] = value = this._limitValue(value, 0.1, this.options.maxPlaybackRate - 0.1);
                this._updatePlaybackRate();
                break;
            case 'maxPlaybackRate':
                this.options[key] = value = this._limitValue(value, this.options.minPlaybackRate + 0.1, 16);
                this._updatePlaybackRate();
                break;
            case 'fullScreen':
                if (this.options[key] !== value) {
                    var wkv = $.jPlayer.nativeFeatures.fullscreen.used.webkitVideo;
                    if (!wkv || wkv && !this.status.waitForPlay) {
                        if (!wkv) {
                            this.options[key] = value;
                        }
                        if (value) {
                            this._requestFullscreen();
                        } else {
                            this._exitFullscreen();
                        }
                        if (!wkv) {
                            this._setOption('fullWindow', value);
                        }
                    }
                }
                break;
            case 'fullWindow':
                if (this.options[key] !== value) {
                    this._removeUiClass();
                    this.options[key] = value;
                    this._refreshSize();
                }
                break;
            case 'size':
                if (!this.options.fullWindow && this.options[key].cssClass !== value.cssClass) {
                    this._removeUiClass();
                }
                this.options[key] = $.extend({}, this.options[key], value);
                this._refreshSize();
                break;
            case 'sizeFull':
                if (this.options.fullWindow && this.options[key].cssClass !== value.cssClass) {
                    this._removeUiClass();
                }
                this.options[key] = $.extend({}, this.options[key], value);
                this._refreshSize();
                break;
            case 'autohide':
                this.options[key] = $.extend({}, this.options[key], value);
                this._updateAutohide();
                break;
            case 'loop':
                this._loop(value);
                break;
            case 'remainingDuration':
                this.options[key] = value;
                this._updateInterface();
                break;
            case 'toggleDuration':
                this.options[key] = value;
                break;
            case 'nativeVideoControls':
                this.options[key] = $.extend({}, this.options[key], value);
                this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
                this._restrictNativeVideoControls();
                this._updateNativeVideoControls();
                break;
            case 'noFullWindow':
                this.options[key] = $.extend({}, this.options[key], value);
                this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
                this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
                this._restrictNativeVideoControls();
                this._updateButtons();
                break;
            case 'noVolume':
                this.options[key] = $.extend({}, this.options[key], value);
                this.status.noVolume = this._uaBlocklist(this.options.noVolume);
                this._updateVolume();
                this._updateMute();
                break;
            case 'emulateHtml':
                if (this.options[key] !== value) {
                    this.options[key] = value;
                    if (value) {
                        this._emulateHtmlBridge();
                    } else {
                        this._destroyHtmlBridge();
                    }
                }
                break;
            case 'timeFormat':
                this.options[key] = $.extend({}, this.options[key], value);
                break;
            case 'keyEnabled':
                this.options[key] = value;
                if (!value && this === $.jPlayer.focus) {
                    $.jPlayer.focus = null;
                }
                break;
            case 'keyBindings':
                this.options[key] = $.extend(true, {}, this.options[key], value);
                break;
            case 'audioFullScreen':
                this.options[key] = value;
                break;
            case 'autoBlur':
                this.options[key] = value;
                break;
            }
            return this;
        },
        _refreshSize: function () {
            this._setSize();
            this._addUiClass();
            this._updateSize();
            this._updateButtons();
            this._updateAutohide();
            this._trigger($.jPlayer.event.resize);
        },
        _setSize: function () {
            if (this.options.fullWindow) {
                this.status.width = this.options.sizeFull.width;
                this.status.height = this.options.sizeFull.height;
                this.status.cssClass = this.options.sizeFull.cssClass;
            } else {
                this.status.width = this.options.size.width;
                this.status.height = this.options.size.height;
                this.status.cssClass = this.options.size.cssClass;
            }
            this.element.css({
                'width': this.status.width,
                'height': this.status.height
            });
        },
        _addUiClass: function () {
            if (this.ancestorJq.length) {
                this.ancestorJq.addClass(this.status.cssClass);
            }
        },
        _removeUiClass: function () {
            if (this.ancestorJq.length) {
                this.ancestorJq.removeClass(this.status.cssClass);
            }
        },
        _updateSize: function () {
            this.internal.poster.jq.css({
                'width': this.status.width,
                'height': this.status.height
            });
            if (!this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls) {
                this.internal.video.jq.css({
                    'width': this.status.width,
                    'height': this.status.height
                });
            } else if (!this.status.waitForPlay && this.flash.active && this.status.video) {
                this.internal.flash.jq.css({
                    'width': this.status.width,
                    'height': this.status.height
                });
            }
        },
        _updateAutohide: function () {
            var self = this, event = 'mousemove.jPlayer', namespace = '.jPlayerAutohide', eventType = event + namespace, handler = function (event) {
                    var moved = false, deltaX, deltaY;
                    if (typeof self.internal.mouse !== 'undefined') {
                        deltaX = self.internal.mouse.x - event.pageX;
                        deltaY = self.internal.mouse.y - event.pageY;
                        moved = Math.floor(deltaX) > 0 || Math.floor(deltaY) > 0;
                    } else {
                        moved = true;
                    }
                    self.internal.mouse = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    if (moved) {
                        self.css.jq.gui.fadeIn(self.options.autohide.fadeIn, function () {
                            clearTimeout(self.internal.autohideId);
                            self.internal.autohideId = setTimeout(function () {
                                self.css.jq.gui.fadeOut(self.options.autohide.fadeOut);
                            }, self.options.autohide.hold);
                        });
                    }
                };
            if (this.css.jq.gui.length) {
                this.css.jq.gui.stop(true, true);
                clearTimeout(this.internal.autohideId);
                delete this.internal.mouse;
                this.element.unbind(namespace);
                this.css.jq.gui.unbind(namespace);
                if (!this.status.nativeVideoControls) {
                    if (this.options.fullWindow && this.options.autohide.full || !this.options.fullWindow && this.options.autohide.restored) {
                        this.element.bind(eventType, handler);
                        this.css.jq.gui.bind(eventType, handler);
                        this.css.jq.gui.hide();
                    } else {
                        this.css.jq.gui.show();
                    }
                } else {
                    this.css.jq.gui.hide();
                }
            }
        },
        fullScreen: function (event) {
            var guiAction = typeof event === 'object';
            if (guiAction && this.options.useStateClassSkin && this.options.fullScreen) {
                this._setOption('fullScreen', false);
            } else {
                this._setOption('fullScreen', true);
            }
        },
        restoreScreen: function () {
            this._setOption('fullScreen', false);
        },
        _fullscreenAddEventListeners: function () {
            var self = this, fs = $.jPlayer.nativeFeatures.fullscreen;
            if (fs.api.fullscreenEnabled) {
                if (fs.event.fullscreenchange) {
                    if (typeof this.internal.fullscreenchangeHandler !== 'function') {
                        this.internal.fullscreenchangeHandler = function () {
                            self._fullscreenchange();
                        };
                    }
                    document.addEventListener(fs.event.fullscreenchange, this.internal.fullscreenchangeHandler, false);
                }
            }
        },
        _fullscreenRemoveEventListeners: function () {
            var fs = $.jPlayer.nativeFeatures.fullscreen;
            if (this.internal.fullscreenchangeHandler) {
                document.removeEventListener(fs.event.fullscreenchange, this.internal.fullscreenchangeHandler, false);
            }
        },
        _fullscreenchange: function () {
            if (this.options.fullScreen && !$.jPlayer.nativeFeatures.fullscreen.api.fullscreenElement()) {
                this._setOption('fullScreen', false);
            }
        },
        _requestFullscreen: function () {
            var e = this.ancestorJq.length ? this.ancestorJq[0] : this.element[0], fs = $.jPlayer.nativeFeatures.fullscreen;
            if (fs.used.webkitVideo) {
                e = this.htmlElement.video;
            }
            if (fs.api.fullscreenEnabled) {
                fs.api.requestFullscreen(e);
            }
        },
        _exitFullscreen: function () {
            var fs = $.jPlayer.nativeFeatures.fullscreen, e;
            if (fs.used.webkitVideo) {
                e = this.htmlElement.video;
            }
            if (fs.api.fullscreenEnabled) {
                fs.api.exitFullscreen(e);
            }
        },
        _html_initMedia: function (media) {
            var $media = $(this.htmlElement.media).empty();
            $.each(media.track || [], function (i, v) {
                var track = document.createElement('track');
                track.setAttribute('kind', v.kind ? v.kind : '');
                track.setAttribute('src', v.src ? v.src : '');
                track.setAttribute('srclang', v.srclang ? v.srclang : '');
                track.setAttribute('label', v.label ? v.label : '');
                if (v.def) {
                    track.setAttribute('default', v.def);
                }
                $media.append(track);
            });
            this.htmlElement.media.src = this.status.src;
            if (this.options.preload !== 'none') {
                this._html_load();
            }
            this._trigger($.jPlayer.event.timeupdate);
        },
        _html_setFormat: function (media) {
            var self = this;
            $.each(this.formats, function (priority, format) {
                if (self.html.support[format] && media[format]) {
                    self.status.src = media[format];
                    self.status.format[format] = true;
                    self.status.formatType = format;
                    return false;
                }
            });
        },
        _html_setAudio: function (media) {
            this._html_setFormat(media);
            this.htmlElement.media = this.htmlElement.audio;
            this._html_initMedia(media);
        },
        _html_setVideo: function (media) {
            this._html_setFormat(media);
            if (this.status.nativeVideoControls) {
                this.htmlElement.video.poster = this._validString(media.poster) ? media.poster : '';
            }
            this.htmlElement.media = this.htmlElement.video;
            this._html_initMedia(media);
        },
        _html_resetMedia: function () {
            if (this.htmlElement.media) {
                if (this.htmlElement.media.id === this.internal.video.id && !this.status.nativeVideoControls) {
                    this.internal.video.jq.css({
                        'width': '0px',
                        'height': '0px'
                    });
                }
                this.htmlElement.media.pause();
            }
        },
        _html_clearMedia: function () {
            if (this.htmlElement.media) {
                this.htmlElement.media.src = 'about:blank';
                this.htmlElement.media.load();
            }
        },
        _html_load: function () {
            if (this.status.waitForLoad) {
                this.status.waitForLoad = false;
                this.htmlElement.media.load();
            }
            clearTimeout(this.internal.htmlDlyCmdId);
        },
        _html_play: function (time) {
            var self = this, media = this.htmlElement.media;
            this.androidFix.pause = false;
            this._html_load();
            if (this.androidFix.setMedia) {
                this.androidFix.play = true;
                this.androidFix.time = time;
            } else if (!isNaN(time)) {
                if (this.internal.cmdsIgnored) {
                    media.play();
                }
                try {
                    if (!media.seekable || typeof media.seekable === 'object' && media.seekable.length > 0) {
                        media.currentTime = time;
                        media.play();
                    } else {
                        throw 1;
                    }
                } catch (err) {
                    this.internal.htmlDlyCmdId = setTimeout(function () {
                        self.play(time);
                    }, 250);
                    return;
                }
            } else {
                media.play();
            }
            this._html_checkWaitForPlay();
        },
        _html_pause: function (time) {
            var self = this, media = this.htmlElement.media;
            this.androidFix.play = false;
            if (time > 0) {
                this._html_load();
            } else {
                clearTimeout(this.internal.htmlDlyCmdId);
            }
            media.pause();
            if (this.androidFix.setMedia) {
                this.androidFix.pause = true;
                this.androidFix.time = time;
            } else if (!isNaN(time)) {
                try {
                    if (!media.seekable || typeof media.seekable === 'object' && media.seekable.length > 0) {
                        media.currentTime = time;
                    } else {
                        throw 1;
                    }
                } catch (err) {
                    this.internal.htmlDlyCmdId = setTimeout(function () {
                        self.pause(time);
                    }, 250);
                    return;
                }
            }
            if (time > 0) {
                this._html_checkWaitForPlay();
            }
        },
        _html_playHead: function (percent) {
            var self = this, media = this.htmlElement.media;
            this._html_load();
            try {
                if (typeof media.seekable === 'object' && media.seekable.length > 0) {
                    media.currentTime = percent * media.seekable.end(media.seekable.length - 1) / 100;
                } else if (media.duration > 0 && !isNaN(media.duration)) {
                    media.currentTime = percent * media.duration / 100;
                } else {
                    throw 'e';
                }
            } catch (err) {
                this.internal.htmlDlyCmdId = setTimeout(function () {
                    self.playHead(percent);
                }, 250);
                return;
            }
            if (!this.status.waitForLoad) {
                this._html_checkWaitForPlay();
            }
        },
        _html_checkWaitForPlay: function () {
            if (this.status.waitForPlay) {
                this.status.waitForPlay = false;
                if (this.css.jq.videoPlay.length) {
                    this.css.jq.videoPlay.hide();
                }
                if (this.status.video) {
                    this.internal.poster.jq.hide();
                    this.internal.video.jq.css({
                        'width': this.status.width,
                        'height': this.status.height
                    });
                }
            }
        },
        _html_setProperty: function (property, value) {
            if (this.html.audio.available) {
                this.htmlElement.audio[property] = value;
            }
            if (this.html.video.available) {
                this.htmlElement.video[property] = value;
            }
        },
        _aurora_setAudio: function (media) {
            var self = this;
            $.each(this.formats, function (priority, format) {
                if (self.aurora.support[format] && media[format]) {
                    self.status.src = media[format];
                    self.status.format[format] = true;
                    self.status.formatType = format;
                    return false;
                }
            });
            this.aurora.player = new AV.Player.fromURL(this.status.src);
            this._addAuroraEventListeners(this.aurora.player, this.aurora);
            if (this.options.preload === 'auto') {
                this._aurora_load();
                this.status.waitForLoad = false;
            }
        },
        _aurora_resetMedia: function () {
            if (this.aurora.player) {
                this.aurora.player.stop();
            }
        },
        _aurora_clearMedia: function () {
        },
        _aurora_load: function () {
            if (this.status.waitForLoad) {
                this.status.waitForLoad = false;
                this.aurora.player.preload();
            }
        },
        _aurora_play: function (time) {
            if (!this.status.waitForLoad) {
                if (!isNaN(time)) {
                    this.aurora.player.seek(time);
                }
            }
            if (!this.aurora.player.playing) {
                this.aurora.player.play();
            }
            this.status.waitForLoad = false;
            this._aurora_checkWaitForPlay();
            this._updateButtons(true);
            this._trigger($.jPlayer.event.play);
        },
        _aurora_pause: function (time) {
            if (!isNaN(time)) {
                this.aurora.player.seek(time * 1000);
            }
            this.aurora.player.pause();
            if (time > 0) {
                this._aurora_checkWaitForPlay();
            }
            this._updateButtons(false);
            this._trigger($.jPlayer.event.pause);
        },
        _aurora_playHead: function (percent) {
            if (this.aurora.player.duration > 0) {
                this.aurora.player.seek(percent * this.aurora.player.duration / 100);
            }
            if (!this.status.waitForLoad) {
                this._aurora_checkWaitForPlay();
            }
        },
        _aurora_checkWaitForPlay: function () {
            if (this.status.waitForPlay) {
                this.status.waitForPlay = false;
            }
        },
        _aurora_volume: function (v) {
            this.aurora.player.volume = v * 100;
        },
        _aurora_mute: function (m) {
            if (m) {
                this.aurora.properties.lastvolume = this.aurora.player.volume;
                this.aurora.player.volume = 0;
            } else {
                this.aurora.player.volume = this.aurora.properties.lastvolume;
            }
            this.aurora.properties.muted = m;
        },
        _flash_setAudio: function (media) {
            var self = this;
            try {
                $.each(this.formats, function (priority, format) {
                    if (self.flash.support[format] && media[format]) {
                        switch (format) {
                        case 'm4a':
                        case 'fla':
                            self._getMovie().fl_setAudio_m4a(media[format]);
                            break;
                        case 'mp3':
                            self._getMovie().fl_setAudio_mp3(media[format]);
                            break;
                        case 'rtmpa':
                            self._getMovie().fl_setAudio_rtmp(media[format]);
                            break;
                        }
                        self.status.src = media[format];
                        self.status.format[format] = true;
                        self.status.formatType = format;
                        return false;
                    }
                });
                if (this.options.preload === 'auto') {
                    this._flash_load();
                    this.status.waitForLoad = false;
                }
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_setVideo: function (media) {
            var self = this;
            try {
                $.each(this.formats, function (priority, format) {
                    if (self.flash.support[format] && media[format]) {
                        switch (format) {
                        case 'm4v':
                        case 'flv':
                            self._getMovie().fl_setVideo_m4v(media[format]);
                            break;
                        case 'rtmpv':
                            self._getMovie().fl_setVideo_rtmp(media[format]);
                            break;
                        }
                        self.status.src = media[format];
                        self.status.format[format] = true;
                        self.status.formatType = format;
                        return false;
                    }
                });
                if (this.options.preload === 'auto') {
                    this._flash_load();
                    this.status.waitForLoad = false;
                }
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_resetMedia: function () {
            this.internal.flash.jq.css({
                'width': '0px',
                'height': '0px'
            });
            this._flash_pause(NaN);
        },
        _flash_clearMedia: function () {
            try {
                this._getMovie().fl_clearMedia();
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_load: function () {
            try {
                this._getMovie().fl_load();
            } catch (err) {
                this._flashError(err);
            }
            this.status.waitForLoad = false;
        },
        _flash_play: function (time) {
            try {
                this._getMovie().fl_play(time);
            } catch (err) {
                this._flashError(err);
            }
            this.status.waitForLoad = false;
            this._flash_checkWaitForPlay();
        },
        _flash_pause: function (time) {
            try {
                this._getMovie().fl_pause(time);
            } catch (err) {
                this._flashError(err);
            }
            if (time > 0) {
                this.status.waitForLoad = false;
                this._flash_checkWaitForPlay();
            }
        },
        _flash_playHead: function (p) {
            try {
                this._getMovie().fl_play_head(p);
            } catch (err) {
                this._flashError(err);
            }
            if (!this.status.waitForLoad) {
                this._flash_checkWaitForPlay();
            }
        },
        _flash_checkWaitForPlay: function () {
            if (this.status.waitForPlay) {
                this.status.waitForPlay = false;
                if (this.css.jq.videoPlay.length) {
                    this.css.jq.videoPlay.hide();
                }
                if (this.status.video) {
                    this.internal.poster.jq.hide();
                    this.internal.flash.jq.css({
                        'width': this.status.width,
                        'height': this.status.height
                    });
                }
            }
        },
        _flash_volume: function (v) {
            try {
                this._getMovie().fl_volume(v);
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_mute: function (m) {
            try {
                this._getMovie().fl_mute(m);
            } catch (err) {
                this._flashError(err);
            }
        },
        _getMovie: function () {
            return document[this.internal.flash.id];
        },
        _getFlashPluginVersion: function () {
            var version = 0, flash;
            if (window.ActiveXObject) {
                try {
                    flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (flash) {
                        var v = flash.GetVariable('$version');
                        if (v) {
                            v = v.split(' ')[1].split(',');
                            version = parseInt(v[0], 10) + '.' + parseInt(v[1], 10);
                        }
                    }
                } catch (e) {
                }
            } else if (navigator.plugins && navigator.mimeTypes.length > 0) {
                flash = navigator.plugins['Shockwave Flash'];
                if (flash) {
                    version = navigator.plugins['Shockwave Flash'].description.replace(/.*\s(\d+\.\d+).*/, '$1');
                }
            }
            return version * 1;
        },
        _checkForFlash: function (version) {
            var flashOk = false;
            if (this._getFlashPluginVersion() >= version) {
                flashOk = true;
            }
            return flashOk;
        },
        _validString: function (url) {
            return url && typeof url === 'string';
        },
        _limitValue: function (value, min, max) {
            return value < min ? min : value > max ? max : value;
        },
        _urlNotSetError: function (context) {
            this._error({
                type: $.jPlayer.error.URL_NOT_SET,
                context: context,
                message: $.jPlayer.errorMsg.URL_NOT_SET,
                hint: $.jPlayer.errorHint.URL_NOT_SET
            });
        },
        _flashError: function (error) {
            var errorType;
            if (!this.internal.ready) {
                errorType = 'FLASH';
            } else {
                errorType = 'FLASH_DISABLED';
            }
            this._error({
                type: $.jPlayer.error[errorType],
                context: this.internal.flash.swf,
                message: $.jPlayer.errorMsg[errorType] + error.message,
                hint: $.jPlayer.errorHint[errorType]
            });
            this.internal.flash.jq.css({
                'width': '1px',
                'height': '1px'
            });
        },
        _error: function (error) {
            this._trigger($.jPlayer.event.error, error);
            if (this.options.errorAlerts) {
                this._alert('Error!' + (error.message ? '\n' + error.message : '') + (error.hint ? '\n' + error.hint : '') + '\nContext: ' + error.context);
            }
        },
        _warning: function (warning) {
            this._trigger($.jPlayer.event.warning, undefined, warning);
            if (this.options.warningAlerts) {
                this._alert('Warning!' + (warning.message ? '\n' + warning.message : '') + (warning.hint ? '\n' + warning.hint : '') + '\nContext: ' + warning.context);
            }
        },
        _alert: function (message) {
            var msg = 'jPlayer ' + this.version.script + ' : id=\'' + this.internal.self.id + '\' : ' + message;
            if (!this.options.consoleAlerts) {
                alert(msg);
            } else if (window.console && window.console.log) {
                window.console.log(msg);
            }
        },
        _emulateHtmlBridge: function () {
            var self = this;
            $.each($.jPlayer.emulateMethods.split(/\s+/g), function (i, name) {
                self.internal.domNode[name] = function (arg) {
                    self[name](arg);
                };
            });
            $.each($.jPlayer.event, function (eventName, eventType) {
                var nativeEvent = true;
                $.each($.jPlayer.reservedEvent.split(/\s+/g), function (i, name) {
                    if (name === eventName) {
                        nativeEvent = false;
                        return false;
                    }
                });
                if (nativeEvent) {
                    self.element.bind(eventType + '.jPlayer.jPlayerHtml', function () {
                        self._emulateHtmlUpdate();
                        var domEvent = document.createEvent('Event');
                        domEvent.initEvent(eventName, false, true);
                        self.internal.domNode.dispatchEvent(domEvent);
                    });
                }
            });
        },
        _emulateHtmlUpdate: function () {
            var self = this;
            $.each($.jPlayer.emulateStatus.split(/\s+/g), function (i, name) {
                self.internal.domNode[name] = self.status[name];
            });
            $.each($.jPlayer.emulateOptions.split(/\s+/g), function (i, name) {
                self.internal.domNode[name] = self.options[name];
            });
        },
        _destroyHtmlBridge: function () {
            var self = this;
            this.element.unbind('.jPlayerHtml');
            var emulated = $.jPlayer.emulateMethods + ' ' + $.jPlayer.emulateStatus + ' ' + $.jPlayer.emulateOptions;
            $.each(emulated.split(/\s+/g), function (i, name) {
                delete self.internal.domNode[name];
            });
        }
    };
    $.jPlayer.error = {
        FLASH: 'e_flash',
        FLASH_DISABLED: 'e_flash_disabled',
        NO_SOLUTION: 'e_no_solution',
        NO_SUPPORT: 'e_no_support',
        URL: 'e_url',
        URL_NOT_SET: 'e_url_not_set',
        VERSION: 'e_version'
    };
    $.jPlayer.errorMsg = {
        FLASH: 'jPlayer\'s Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ',
        FLASH_DISABLED: 'jPlayer\'s Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ',
        NO_SOLUTION: 'No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.',
        NO_SUPPORT: 'It is not possible to play any media format provided in setMedia() on this browser using your current options.',
        URL: 'Media URL could not be loaded.',
        URL_NOT_SET: 'Attempt to issue media playback commands, while no media url is set.',
        VERSION: 'jPlayer ' + $.jPlayer.prototype.version.script + ' needs Jplayer.swf version ' + $.jPlayer.prototype.version.needFlash + ' but found '
    };
    $.jPlayer.errorHint = {
        FLASH: 'Check your swfPath option and that Jplayer.swf is there.',
        FLASH_DISABLED: 'Check that you have not display:none; the jPlayer entity or any ancestor.',
        NO_SOLUTION: 'Review the jPlayer options: support and supplied.',
        NO_SUPPORT: 'Video or audio formats defined in the supplied option are missing.',
        URL: 'Check media URL is valid.',
        URL_NOT_SET: 'Use setMedia() to set the media URL.',
        VERSION: 'Update jPlayer files.'
    };
    $.jPlayer.warning = {
        CSS_SELECTOR_COUNT: 'e_css_selector_count',
        CSS_SELECTOR_METHOD: 'e_css_selector_method',
        CSS_SELECTOR_STRING: 'e_css_selector_string',
        OPTION_KEY: 'e_option_key'
    };
    $.jPlayer.warningMsg = {
        CSS_SELECTOR_COUNT: 'The number of css selectors found did not equal one: ',
        CSS_SELECTOR_METHOD: 'The methodName given in jPlayer(\'cssSelector\') is not a valid jPlayer method.',
        CSS_SELECTOR_STRING: 'The methodCssSelector given in jPlayer(\'cssSelector\') is not a String or is empty.',
        OPTION_KEY: 'The option requested in jPlayer(\'option\') is undefined.'
    };
    $.jPlayer.warningHint = {
        CSS_SELECTOR_COUNT: 'Check your css selector and the ancestor.',
        CSS_SELECTOR_METHOD: 'Check your method name.',
        CSS_SELECTOR_STRING: 'Check your css selector is a string.',
        OPTION_KEY: 'Check your option name.'
    };
}));