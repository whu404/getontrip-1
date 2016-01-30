(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('common/extra/jplayer/jplayer.playlist', ['jquery'], factory);
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
    jPlayerPlaylist = function (cssSelector, playlist, options) {
        var self = this;
        this.current = 0;
        this.loop = false;
        this.shuffled = false;
        this.removing = false;
        this.cssSelector = $.extend({}, this._cssSelector, cssSelector);
        this.options = $.extend(true, {
            keyBindings: {
                next: {
                    key: 221,
                    fn: function () {
                        self.next();
                    }
                },
                previous: {
                    key: 219,
                    fn: function () {
                        self.previous();
                    }
                },
                shuffle: {
                    key: 83,
                    fn: function () {
                        self.shuffle();
                    }
                }
            },
            stateClass: { shuffled: 'jp-state-shuffled' }
        }, this._options, options);
        this.playlist = [];
        this.original = [];
        this._initPlaylist(playlist);
        this.cssSelector.details = this.cssSelector.cssSelectorAncestor + ' .jp-details';
        this.cssSelector.playlist = this.cssSelector.cssSelectorAncestor + ' .jp-playlist';
        this.cssSelector.next = this.cssSelector.cssSelectorAncestor + ' .jp-next';
        this.cssSelector.previous = this.cssSelector.cssSelectorAncestor + ' .jp-previous';
        this.cssSelector.shuffle = this.cssSelector.cssSelectorAncestor + ' .jp-shuffle';
        this.cssSelector.shuffleOff = this.cssSelector.cssSelectorAncestor + ' .jp-shuffle-off';
        this.options.cssSelectorAncestor = this.cssSelector.cssSelectorAncestor;
        this.options.repeat = function (event) {
            self.loop = event.jPlayer.options.loop;
        };
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.ready, function () {
            self._init();
        });
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.ended, function () {
            self.next();
        });
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.play, function () {
            $(this).jPlayer('pauseOthers');
        });
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.resize, function (event) {
            if (event.jPlayer.options.fullScreen) {
                $(self.cssSelector.details).show();
            } else {
                $(self.cssSelector.details).hide();
            }
        });
        $(this.cssSelector.previous).click(function (e) {
            e.preventDefault();
            self.previous();
            self.blur(this);
        });
        $(this.cssSelector.next).click(function (e) {
            e.preventDefault();
            self.next();
            self.blur(this);
        });
        $(this.cssSelector.shuffle).click(function (e) {
            e.preventDefault();
            if (self.shuffled && $(self.cssSelector.jPlayer).jPlayer('option', 'useStateClassSkin')) {
                self.shuffle(false);
            } else {
                self.shuffle(true);
            }
            self.blur(this);
        });
        $(this.cssSelector.shuffleOff).click(function (e) {
            e.preventDefault();
            self.shuffle(false);
            self.blur(this);
        }).hide();
        if (!this.options.fullScreen) {
            $(this.cssSelector.details).hide();
        }
        $(this.cssSelector.playlist + ' ul').empty();
        this._createItemHandlers();
        $(this.cssSelector.jPlayer).jPlayer(this.options);
    };
    jPlayerPlaylist.prototype = {
        _cssSelector: {
            jPlayer: '#jquery_jplayer_1',
            cssSelectorAncestor: '#jp_container_1'
        },
        _options: {
            playlistOptions: {
                autoPlay: false,
                loopOnPrevious: false,
                shuffleOnLoop: true,
                enableRemoveControls: false,
                displayTime: 'slow',
                addTime: 'fast',
                removeTime: 'fast',
                shuffleTime: 'slow',
                itemClass: 'jp-playlist-item',
                freeGroupClass: 'jp-free-media',
                freeItemClass: 'jp-playlist-item-free',
                removeItemClass: 'jp-playlist-item-remove'
            }
        },
        option: function (option, value) {
            if (value === undefined) {
                return this.options.playlistOptions[option];
            }
            this.options.playlistOptions[option] = value;
            switch (option) {
            case 'enableRemoveControls':
                this._updateControls();
                break;
            case 'itemClass':
            case 'freeGroupClass':
            case 'freeItemClass':
            case 'removeItemClass':
                this._refresh(true);
                this._createItemHandlers();
                break;
            }
            return this;
        },
        _init: function () {
            var self = this;
            this._refresh(function () {
                if (self.options.playlistOptions.autoPlay) {
                    self.play(self.current);
                } else {
                    self.select(self.current);
                }
            });
        },
        _initPlaylist: function (playlist) {
            this.current = 0;
            this.shuffled = false;
            this.removing = false;
            this.original = $.extend(true, [], playlist);
            this._originalPlaylist();
        },
        _originalPlaylist: function () {
            var self = this;
            this.playlist = [];
            $.each(this.original, function (i) {
                self.playlist[i] = self.original[i];
            });
        },
        _refresh: function (instant) {
            var self = this;
            if (instant && !$.isFunction(instant)) {
                $(this.cssSelector.playlist + ' ul').empty();
                $.each(this.playlist, function (i) {
                    $(self.cssSelector.playlist + ' ul').append(self._createListItem(self.playlist[i]));
                });
                this._updateControls();
            } else {
                var displayTime = $(this.cssSelector.playlist + ' ul').children().length ? this.options.playlistOptions.displayTime : 0;
                $(this.cssSelector.playlist + ' ul').slideUp(displayTime, function () {
                    var $this = $(this);
                    $(this).empty();
                    $.each(self.playlist, function (i) {
                        $this.append(self._createListItem(self.playlist[i]));
                    });
                    self._updateControls();
                    if ($.isFunction(instant)) {
                        instant();
                    }
                    if (self.playlist.length) {
                        $(this).slideDown(self.options.playlistOptions.displayTime);
                    } else {
                        $(this).show();
                    }
                });
            }
        },
        _createListItem: function (media) {
            var self = this;
            var listItem = '<li><div>';
            listItem += '<a href=\'javascript:;\' class=\'' + this.options.playlistOptions.removeItemClass + '\'>&times;</a>';
            if (media.free) {
                var first = true;
                listItem += '<span class=\'' + this.options.playlistOptions.freeGroupClass + '\'>(';
                $.each(media, function (property, value) {
                    if ($.jPlayer.prototype.format[property]) {
                        if (first) {
                            first = false;
                        } else {
                            listItem += ' | ';
                        }
                        listItem += '<a class=\'' + self.options.playlistOptions.freeItemClass + '\' href=\'' + value + '\' tabindex=\'-1\'>' + property + '</a>';
                    }
                });
                listItem += ')</span>';
            }
            listItem += '<a href=\'javascript:;\' class=\'' + this.options.playlistOptions.itemClass + '\' tabindex=\'0\'>' + media.title + (media.artist ? ' <span class=\'jp-artist\'>by ' + media.artist + '</span>' : '') + '</a>';
            listItem += '</div></li>';
            return listItem;
        },
        _createItemHandlers: function () {
            var self = this;
            $(this.cssSelector.playlist).off('click', 'a.' + this.options.playlistOptions.itemClass).on('click', 'a.' + this.options.playlistOptions.itemClass, function (e) {
                e.preventDefault();
                var index = $(this).parent().parent().index();
                if (self.current !== index) {
                    self.play(index);
                } else {
                    $(self.cssSelector.jPlayer).jPlayer('play');
                }
                self.blur(this);
            });
            $(this.cssSelector.playlist).off('click', 'a.' + this.options.playlistOptions.freeItemClass).on('click', 'a.' + this.options.playlistOptions.freeItemClass, function (e) {
                e.preventDefault();
                $(this).parent().parent().find('.' + self.options.playlistOptions.itemClass).click();
                self.blur(this);
            });
            $(this.cssSelector.playlist).off('click', 'a.' + this.options.playlistOptions.removeItemClass).on('click', 'a.' + this.options.playlistOptions.removeItemClass, function (e) {
                e.preventDefault();
                var index = $(this).parent().parent().index();
                self.remove(index);
                self.blur(this);
            });
        },
        _updateControls: function () {
            if (this.options.playlistOptions.enableRemoveControls) {
                $(this.cssSelector.playlist + ' .' + this.options.playlistOptions.removeItemClass).show();
            } else {
                $(this.cssSelector.playlist + ' .' + this.options.playlistOptions.removeItemClass).hide();
            }
            if (this.shuffled) {
                $(this.cssSelector.jPlayer).jPlayer('addStateClass', 'shuffled');
            } else {
                $(this.cssSelector.jPlayer).jPlayer('removeStateClass', 'shuffled');
            }
            if ($(this.cssSelector.shuffle).length && $(this.cssSelector.shuffleOff).length) {
                if (this.shuffled) {
                    $(this.cssSelector.shuffleOff).show();
                    $(this.cssSelector.shuffle).hide();
                } else {
                    $(this.cssSelector.shuffleOff).hide();
                    $(this.cssSelector.shuffle).show();
                }
            }
        },
        _highlight: function (index) {
            if (this.playlist.length && index !== undefined) {
                $(this.cssSelector.playlist + ' .jp-playlist-current').removeClass('jp-playlist-current');
                $(this.cssSelector.playlist + ' li:nth-child(' + (index + 1) + ')').addClass('jp-playlist-current').find('.jp-playlist-item').addClass('jp-playlist-current');
            }
        },
        setPlaylist: function (playlist) {
            this._initPlaylist(playlist);
            this._init();
        },
        add: function (media, playNow) {
            $(this.cssSelector.playlist + ' ul').append(this._createListItem(media)).find('li:last-child').hide().slideDown(this.options.playlistOptions.addTime);
            this._updateControls();
            this.original.push(media);
            this.playlist.push(media);
            if (playNow) {
                this.play(this.playlist.length - 1);
            } else {
                if (this.original.length === 1) {
                    this.select(0);
                }
            }
        },
        remove: function (index) {
            var self = this;
            if (index === undefined) {
                this._initPlaylist([]);
                this._refresh(function () {
                    $(self.cssSelector.jPlayer).jPlayer('clearMedia');
                });
                return true;
            } else {
                if (this.removing) {
                    return false;
                } else {
                    index = index < 0 ? self.original.length + index : index;
                    if (0 <= index && index < this.playlist.length) {
                        this.removing = true;
                        $(this.cssSelector.playlist + ' li:nth-child(' + (index + 1) + ')').slideUp(this.options.playlistOptions.removeTime, function () {
                            $(this).remove();
                            if (self.shuffled) {
                                var item = self.playlist[index];
                                $.each(self.original, function (i) {
                                    if (self.original[i] === item) {
                                        self.original.splice(i, 1);
                                        return false;
                                    }
                                });
                                self.playlist.splice(index, 1);
                            } else {
                                self.original.splice(index, 1);
                                self.playlist.splice(index, 1);
                            }
                            if (self.original.length) {
                                if (index === self.current) {
                                    self.current = index < self.original.length ? self.current : self.original.length - 1;
                                    self.select(self.current);
                                } else if (index < self.current) {
                                    self.current--;
                                }
                            } else {
                                $(self.cssSelector.jPlayer).jPlayer('clearMedia');
                                self.current = 0;
                                self.shuffled = false;
                                self._updateControls();
                            }
                            self.removing = false;
                        });
                    }
                    return true;
                }
            }
        },
        select: function (index) {
            index = index < 0 ? this.original.length + index : index;
            if (0 <= index && index < this.playlist.length) {
                this.current = index;
                this._highlight(index);
                $(this.cssSelector.jPlayer).jPlayer('setMedia', this.playlist[this.current]);
            } else {
                this.current = 0;
            }
        },
        play: function (index) {
            index = index < 0 ? this.original.length + index : index;
            if (0 <= index && index < this.playlist.length) {
                if (this.playlist.length) {
                    this.select(index);
                    $(this.cssSelector.jPlayer).jPlayer('play');
                }
            } else if (index === undefined) {
                $(this.cssSelector.jPlayer).jPlayer('play');
            }
        },
        pause: function () {
            $(this.cssSelector.jPlayer).jPlayer('pause');
        },
        next: function () {
            var index = this.current + 1 < this.playlist.length ? this.current + 1 : 0;
            if (this.loop) {
                if (index === 0 && this.shuffled && this.options.playlistOptions.shuffleOnLoop && this.playlist.length > 1) {
                    this.shuffle(true, true);
                } else {
                    this.play(index);
                }
            } else {
                if (index > 0) {
                    this.play(index);
                }
            }
        },
        previous: function () {
            var index = this.current - 1 >= 0 ? this.current - 1 : this.playlist.length - 1;
            if (this.loop && this.options.playlistOptions.loopOnPrevious || index < this.playlist.length - 1) {
                this.play(index);
            }
        },
        shuffle: function (shuffled, playNow) {
            var self = this;
            if (shuffled === undefined) {
                shuffled = !this.shuffled;
            }
            if (shuffled || shuffled !== this.shuffled) {
                $(this.cssSelector.playlist + ' ul').slideUp(this.options.playlistOptions.shuffleTime, function () {
                    self.shuffled = shuffled;
                    if (shuffled) {
                        self.playlist.sort(function () {
                            return 0.5 - Math.random();
                        });
                    } else {
                        self._originalPlaylist();
                    }
                    self._refresh(true);
                    if (playNow || !$(self.cssSelector.jPlayer).data('jPlayer').status.paused) {
                        self.play(0);
                    } else {
                        self.select(0);
                    }
                    $(this).slideDown(self.options.playlistOptions.shuffleTime);
                });
            }
        },
        blur: function (that) {
            if ($(this.cssSelector.jPlayer).jPlayer('option', 'autoBlur')) {
                $(that).blur();
            }
        }
    };
}));